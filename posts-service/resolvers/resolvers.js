const { PrismaClient } = require('@prisma/client');
const { PubSub } = require('graphql-subscriptions');
const axios = require('axios');
const prisma = new PrismaClient();
const pubSub = new PubSub();

const POST_CREATED = 'POST_CREATED';
const POST_UPDATED = 'POST_UPDATED';
const POST_DELETED = 'POST_DELETED';

const resolvers = {
  Query: {
    posts: (_, { userId }) => {
      if (userId) {
        return prisma.post.findMany({ where: { userId } });
      }
      return prisma.post.findMany();
    },
    post: (_, { id }) => prisma.post.findUnique({ where: { id } }),
  },
  Mutation: {
    createPost: async (_, { title, content, userId }) => {
      // Validate user existence in users-service
      const userResponse = await axios.post('http://localhost:4001/graphql', {
        query: `
          query {
            user(id: ${userId}) {
              id
            }
          }
        `,
      });

      // console.log('User Response:', userResponse.data); // Log the entire response
      // console.log('User Data:', userResponse.data.data.user.id); // Log the specific user data

      if (!userResponse.data.data.user) {
        throw new Error('User does not exist');
      }

      const newPost = await prisma.post.create({ data: { title, content, userId } });
      console.log('Publishing POST_CREATED event:', newPost); // Debug log
      pubSub.publish(POST_CREATED, { postCreated: newPost });
      return newPost;
    },
    updatePost: async (_, { id, title, content }) => {
      const updatedPost = await prisma.post.update({ where: { id }, data: { title, content } });
      console.log('Publishing POST_UPDATED event:', updatedPost); // Debug log
      pubSub.publish(POST_UPDATED, { postUpdated: updatedPost });
      return updatedPost;
    },
    deletePost: async (_, { id }) => {
      const deletedPost = await prisma.post.delete({ where: { id } });
      console.log('Publishing POST_DELETED event:', deletedPost); // Debug log
      pubSub.publish(POST_DELETED, { postDeleted: deletedPost });
      return deletedPost;
    },
    deletePostsByUserId: async (_, { userId }) => {
      try {
        const postsToDelete = await prisma.post.findMany({ where: { userId } });
        const deleteResult = await prisma.post.deleteMany({ where: { userId } });

        postsToDelete.forEach(post => {
          pubSub.publish(POST_DELETED, { postDeleted: post });
        });

        return { count: deleteResult.count };
      } catch (error) {
        console.error('Error deleting posts by userId:', error);
        throw new Error('Failed to delete posts by userId');
      }
    },
  },
  Subscription: {
    postCreated: {
      subscribe: () => pubSub.asyncIterator([POST_CREATED]),
    },
    postUpdated: {
      subscribe: () => pubSub.asyncIterator([POST_UPDATED]),
    },
    postDeleted: {
      subscribe: () => pubSub.asyncIterator([POST_DELETED]),
    },
  },
};

module.exports = resolvers;