import { gql, useQuery, useSubscription } from "@apollo/client";
import { useState, useEffect } from "react";
import { usersClient } from "./links"; // Import the usersClient to query users

// GraphQL Query to fetch all posts
const GET_POSTS = gql`
  query {
    posts {
      id
      title
      content
      userId
    }
  }
`;

// GraphQL Query to fetch all users
const GET_USERS = gql`
  query {
    users {
      id
      name
    }
  }
`;

// Subscriptions
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

function Posts() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch existing posts using the GET_POSTS query
  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(GET_POSTS);

  // Fetch existing users using the GET_USERS query
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_USERS, {
    client: usersClient, // Use the usersClient to query the users-service
  });

  // Subscription for new posts
  const { data: newPostData } = useSubscription(POST_CREATED);

  // Subscription for updated posts
  const { data: updatedPostData } = useSubscription(POST_UPDATED);

  // Subscription for deleted posts
  const { data: deletedPostData } = useSubscription(POST_DELETED);

  // Load initial posts from the query
  useEffect(() => {
    if (queryData && queryData.posts) {
      setPosts(queryData.posts);
    }
  }, [queryData]);

  // Load initial users from the query
  useEffect(() => {
    if (usersData && usersData.users) {
      setUsers(usersData.users);
    }
  }, [usersData]);

  // Handle new posts
  useEffect(() => {
    if (newPostData) {
      setPosts((prevPosts) => [...prevPosts, newPostData.postCreated]);
    }
  }, [newPostData]);

  // Handle updated posts
  useEffect(() => {
    if (updatedPostData) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPostData.postUpdated.id ? updatedPostData.postUpdated : post
        )
      );
    }
  }, [updatedPostData]);

  // Handle deleted posts
  useEffect(() => {
    if (deletedPostData) {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== deletedPostData.postDeleted.id)
      );
    }
  }, [deletedPostData]);

  if (queryLoading || usersLoading) return <p>Loading posts and users...</p>;
  if (queryError) return <p>Error loading posts: {queryError.message}</p>;
  if (usersError) return <p>Error loading users: {usersError.message}</p>;

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Unknown";
  };

  return (
    <div>
      <h2>Posts</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>User Name</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.content}</td>
              <td>{getUserName(post.userId)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Posts;