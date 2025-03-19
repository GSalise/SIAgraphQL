import React, { useEffect, useState } from 'react';
import UsersTable from './UsersTable';
import PostsTable from './PostsTable';

const App = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:4001/users');
      const data = await response.json();
      setUsers(data);
    };

    const fetchPosts = async () => {
      const response = await fetch('http://localhost:4002/posts');
      const data = await response.json();
      setPosts(data);
    };

    fetchUsers();
    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Users and Posts</h1>
      <UsersTable users={users} />
      <PostsTable posts={posts} users={users} />
    </div>
  );
};

export default App;