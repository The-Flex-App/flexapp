import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import Amplify from 'aws-amplify';
import awsConfig from './aws-exports';
import AppWithAuth from './AppWithAuth';

// const client = new ApolloClient({
//   uri: 'https://api.anshconsulting.co.uk/graphql',
//   cache: new InMemoryCache(),
// });

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
});

Amplify.configure(awsConfig);

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AppWithAuth />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
