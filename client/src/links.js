import { HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";


export const httpLink = new HttpLink({
    uri: 'http://localhost:4002/graphql',
    fetch: (uri, options) => {
        console.log(`HTTP request to ${uri}`);
        return fetch(uri, options);
    }
});


export const usersClient = new ApolloClient({
    uri: 'http://localhost:4001/graphql', // Pointing to the users-service
    cache: new InMemoryCache(),
});