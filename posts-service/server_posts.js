const { ApolloServer } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers/resolvers');

const pubSub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ pubSub }),
  subscriptions: {
    path: '/subscriptions', // Explicitly set the WebSocket path
    onConnect: (connectionParams, webSocket) => {
      console.log('WebSocket connected');
    },
    onDisconnect: (webSocket, context) => {
      console.log('WebSocket disconnected');
    },
  },
  cors: {
    origin: [
      'http://localhost:3000', // Allow your React app
      'https://studio.apollographql.com', // Allow Apollo Sandbox
    ],
    credentials: true,
  },
});

server.listen({ port: 4002 }).then(({ url, subscriptionsUrl }) => {
  console.log(`Posts service running at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`); // This should now log correctly
});