import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// import Amplify from 'aws-amplify';
// import awsConfig from './aws-exports';
// import AppWithAuth from './AppWithAuth';
import App from './App';

const API_ENDPOINT = process.env.REACT_APP_GRAPHQL_API;

const client = new ApolloClient({
  uri: API_ENDPOINT,
  cache: new InMemoryCache(),
});

// Amplify.configure(awsConfig);

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
