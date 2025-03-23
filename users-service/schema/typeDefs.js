const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String!
    content: String!
    userId: Int!
  }

  type Query {
    users: [User]
    user(id: Int!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: Int!, name: String, email: String): User
    deleteUser(id: Int!): User
  }
`;

module.exports = typeDefs;