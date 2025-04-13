const amqp = require('amqplib');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//sudo docker run -d --hostname act10 --name act10 -p 15672:15672 -p 5672:5672 rabbitmq:3-management

async function consumePosts() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();

    // Declare the queue
    const queue = 'postQueue';
    await channel.assertQueue(queue, { durable: false });

    console.log('Waiting for messages in %s. To exit press CTRL+C', queue);

    // Set up consumer
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const postData = JSON.parse(msg.content.toString());
          console.log('Received:', postData);

          // 1. Validate user exists (if needed)
          // ... (your existing user validation code)

          // 2. Create post using CORRECT mutation format
          const response = await axios.post('http://localhost:4002/graphql', {
            query: `
              mutation CreatePost($title: String!, $content: String!, $userId: Int!) {
                createPost(title: $title, content: $content, userId: $userId) {
                  content
                  id
                  title
                  userId
                }
              }
            `,
            variables: {
              title: postData.title,
              content: postData.content,
              userId: postData.userId
            }
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          // Check for GraphQL errors
          if (response.data.errors) {
            console.error('GraphQL Errors:', response.data.errors);
            throw new Error('Post creation failed');
          }

          const newPost = response.data.data.createPost;
          console.log('Post created:', newPost);
          channel.ack(msg);

        } catch (error) {
          console.error('Error processing message:', error.message);
          if (error.response) {
            console.error('Response error:', error.response.data);
          }
          channel.nack(msg);
        }
      }
    });
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
  }
}

consumePosts();