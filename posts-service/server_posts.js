const { createServer } = require('http');
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers/resolvers');
const  cors = require('cors')


// Create an Express app
const app = express();

// Create an HTTP server
const httpServer = createServer(app);

// Create the schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create a WebSocket server
const wsServer = new WebSocketServer({
  server: httpServer, // Use the HTTP server we created
  path: '/subscriptions', // WebSocket path for subscriptions
});

// Handle WebSocket connections for subscriptions
const serverCleanup = useServer({ schema }, wsServer);

// Create the Apollo Server
const server = new ApolloServer({
  schema,
  plugins: [
    // Properly shutdown the HTTP server
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Properly shutdown the WebSocket server
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

// Start the Apollo Server
server.start().then(() => {
  // Apply the Apollo middleware to the Express app
  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
    
  );



  // Start the HTTP server
  httpServer.listen({ port: 4002 }, () => {
    console.log(`Server running at http://localhost:4002/graphql`);
    console.log(`Subscriptions ready at ws://localhost:4002/subscriptions`);
  });
});