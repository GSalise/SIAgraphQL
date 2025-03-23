import React, { useEffect, useState } from 'react';
import { useSubscription, gql, ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
// import { WebSocketLink } from '@apollo/client/link/ws';
// import { getMainDefinition } from '@apollo/client/utilities';
import UsersTable from './UsersTable';
import PostsTable from './PostsTable';

// // WebSocket link for subscriptions
// const wsLink = new WebSocketLink({
//   uri: 'ws://localhost:4002/graphql', // Replace with your WebSocket endpoint
//   options: {
//     reconnect: true,
//   },
// });

// // HTTP link for queries and mutations
// const httpLink = new HttpLink({
//   uri: 'http://localhost:4002/graphql', // Replace with your GraphQL endpoint
// });

// // Split links based on operation type
// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   wsLink,
//   httpLink
// );

// // Apollo Client instance
// const client = new ApolloClient({
//   link: splitLink,
//   cache: new InMemoryCache(),
// });

const POST_CREATED = gql`
  subscription {
    postCreated {
      id
      title
      content
      userId
    }
  }
`;

const POST_UPDATED = gql`
  subscription {
    postUpdated {
      id
      title
      content
      userId
    }
  }
`;

const POST_DELETED = gql`
  subscription {
    postDeleted {
      id
      title
      content
      userId
    }
  }
`;

const App = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const { data: newPost, error: newPostError } = useSubscription(POST_CREATED);
  const { data: updatedPost, error: updatedPostError } = useSubscription(POST_UPDATED);
  const { data: deletedPost, error: deletedPostError } = useSubscription(POST_DELETED);

  // Debug subscription errors
  useEffect(() => {
    if (newPostError) console.error('POST_CREATED subscription error:', newPostError);
    if (updatedPostError) console.error('POST_UPDATED subscription error:', updatedPostError);
    if (deletedPostError) console.error('POST_DELETED subscription error:', deletedPostError);
  }, [newPostError, updatedPostError, deletedPostError]);

  // Handle new post creation
  useEffect(() => {
    if (newPost) {
      console.log('New post received:', newPost.postCreated); // Debug log
      setPosts((prevPosts) => [...prevPosts, newPost.postCreated]);
    }
  }, [newPost]);

  // Handle post updates
  useEffect(() => {
    if (updatedPost) {
      console.log('Updated post received:', updatedPost.postUpdated); // Debug log
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPost.postUpdated.id ? updatedPost.postUpdated : post
        )
      );
    }
  }, [updatedPost]);

  // Handle post deletions
  useEffect(() => {
    if (deletedPost) {
      console.log('Deleted post received:', deletedPost.postDeleted); // Debug log
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== deletedPost.postDeleted.id)
      );
    }
  }, [deletedPost]);

  // Fetch initial data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4001/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                users {
                  id
                  name
                  email
                }
              }
            `,
          }),
        });
        const data = await response.json();
        setUsers(data.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:4002/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                posts {
                  id
                  title
                  content
                  userId
                }
              }
            `,
          }),
        });
        const data = await response.json();
        setPosts(data.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchUsers();
    fetchPosts();
  }, []);

  return (
    <div className="container">
      <h1 className="text-center my-4">Users and Posts</h1>
      <div className="row">
        <div className="col-md-6">
          <UsersTable users={users} />
        </div>
        <div className="col-md-6">
          <PostsTable posts={posts} users={users} />
        </div>
      </div>
    </div>
  );
};

export default App;