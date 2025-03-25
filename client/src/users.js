import { gql, useQuery, ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useState, useEffect } from "react";
import { usersClient } from "./links";

// GraphQL Query to fetch all users
const GET_USERS = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;


function Users() {
  const [users, setUsers] = useState([]);

  // Fetch existing users using the GET_USERS query
  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(GET_USERS, {
    client: usersClient, // Use the local Apollo Client instance
  });

  // Load initial users from the query
  useEffect(() => {
    if (queryData && queryData.users) {
      setUsers(queryData.users);
    }
  }, [queryData]);

  if (queryLoading) return <p>Loading users...</p>;
  if (queryError) return <p>Error loading users: {queryError.message}</p>;

  return (
    <div>
      <h2>Users</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Wrap the Users component with ApolloProvider to provide the local client
function UsersWithProvider() {
  return (
    <ApolloProvider client={usersClient}>
      <Users />
    </ApolloProvider>
  );
}

export default UsersWithProvider;