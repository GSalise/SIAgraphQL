const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

const resolvers = {
  Query: {
    users: () => prisma.user.findMany(),
    user: (_, { id }) => prisma.user.findUnique({ where: { id } }),
  },
  Mutation: {
    createUser: (_, { name, email }) =>
      prisma.user.create({ data: { name, email } }),
    updateUser: (_, { id, name, email }) =>
      prisma.user.update({ where: { id }, data: { name, email } }),
    deleteUser: async (_, { id }) => {
      // Delete the user
      const user = await prisma.user.delete({ where: { id } });

      // Delete the user's posts from the posts-service
      await axios.post('http://localhost:4002/graphql', {
        query: `
          mutation {
            deletePostsByUserId(userId: ${id}) {
              count
            }
          }
        `,
      });

      return user;
    },
  },
  User: {
    posts: async (parent) => {
      try {
        // Fetch posts from the posts-service
        const response = await axios.post('http://localhost:4002/graphql', {
          query: `
            query {
              posts(userId: ${parent.id}) {
                id
                title
                content
                userId
              }
            }
          `,
        });

        // Return the posts
        return response.data.data.posts;
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        throw new Error('Failed to fetch posts for the user.');
      }
    },
  },
};

module.exports = resolvers;