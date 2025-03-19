const { gql } = require('apollo-server');

const typeDefs = gql`
  type Post {
    id: Int!
    title: String!
    content: String!
  }

  type Query {
    posts: [Post]
    post(id: Int!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!): Post
    updatePost(id: Int!, title: String, content: String): Post
    deletePost(id: Int!): Post
  }

  type Subscription {
    postCreated: Post
  }
`;

module.exports = typeDefs;