const { ApolloServer, PubSub } = require('apollo-server');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers/resolvers');

const pubSub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ pubSub }),
});

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`Posts service running at ${url}`);
});