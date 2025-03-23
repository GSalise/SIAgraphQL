import React from 'react';

const PostsTable = ({ posts, users }) => {
  const getUserName = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : 'Unknown';
  };

  return (
    <div className="container mt-4">
      <h2>Posts Table</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
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
};

export default PostsTable;