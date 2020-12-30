import React from 'react';
import './App.scss';
import Container from '@material-ui/core/Container';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ButtonAppBar from './components/header/ButtonAppBar';
import Projects from './components/projects/Projects';
import Copyright from './components/Copyright';
import Videos from './components/videos/Videos';
import muiTheme from './muiTheme';
import { Typography } from '@material-ui/core';

function App() {
  const theme = muiTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <Container maxWidth={false}>
        <Grid container>
          <Grid item xs={12}>
            <ButtonAppBar />
          </Grid>
          <Grid item xs={3} className='project-list'>
            <Projects />
          </Grid>
          <Grid item xs={7} className='videos-list'>
            <Videos />
          </Grid>
          <Grid item xs={2} className='broadcast-list'>
            <Typography>Broadcast</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Copyright />
          </Paper>
        </Grid>
      </Container>
    </MuiThemeProvider>
  );
}

export default App;
