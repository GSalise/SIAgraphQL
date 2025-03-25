import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';

import { httpLink } from './links';

// WebSocket Link
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4002/subscriptions',
  on: {
    connected: () => console.log('WebSocket connected'),
    connecting: () => console.log('WebSocket connecting'),
    closed: (event) => console.log('WebSocket closed', event),
    error: (error) => console.log('WebSocket error', error),
  },
}));

// Split Link
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

// Render Application
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
