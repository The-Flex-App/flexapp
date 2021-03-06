import React from 'react';
import Container from '@material-ui/core/Container';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import OverlayLoader from './components/OverlayLoader';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import store from '../src/store';
import Router from './Router';
import muiTheme from './muiTheme';
import './App.scss';
import { MuiThemeProvider } from '@material-ui/core';

const API_ENDPOINT = process.env.REACT_APP_GRAPHQL_API;

const client = new ApolloClient({
  uri: API_ENDPOINT,
  cache: new InMemoryCache(),
});

export default function AppContainer() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <MuiThemeProvider theme={muiTheme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Router />

            <OverlayLoader />
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
      </Provider>
    </ApolloProvider>
  );
}
