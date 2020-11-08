import React from 'react';
import './App.scss';
import Container from '@material-ui/core/Container';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ButtonAppBar from './components/ButtonAppBar';
import Projects from './components/Projects';
import Copyright from './components/Copyright';
import Videos from './components/Videos';

import { Provider } from 'react-redux';
import store from '../src/store';
import muiTheme from './muiTheme';

function App(props) {
  const { authState } = props;

  const theme = muiTheme;

  if (authState !== 'signedIn') return null;

  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Container maxWidth={false}>
          <Grid container>
            <Grid item xs={12}>
              <ButtonAppBar />
            </Grid>
            <Grid item xs={3} className="project-list">
              <Projects />
            </Grid>
            <Grid item xs={9} className="videos-list">
              <Videos />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <Copyright />
            </Paper>
          </Grid>
        </Container>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
