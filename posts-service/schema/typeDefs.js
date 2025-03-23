const { gql } = require('apollo-server');

const typeDefs = gql`
  type Post {
    id: Int!
    title: String!
    content: String!
    userId: Int!
  }

  type Query {
    posts(userId: Int): [Post]
    post(id: Int!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!, userId: Int!): Post
    updatePost(id: Int!, title: String, content: String): Post
    deletePost(id: Int!): Post
    deletePostsByUserId(userId: Int!): BatchPayload
  }

  type BatchPayload {
    count: Int!
  }

  type Subscription {
    postCreated: Post
    postUpdated: Post
    postDeleted: Post
  }
`;

module.exports = typeDefs;