import React from 'react';
import './App.scss';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ButtonAppBar from './components/header/ButtonAppBar';
import Projects from './components/projects/Projects';
import Copyright from './components/Copyright';
import Videos from './components/videos/Videos';
import muiTheme from './muiTheme';
import OverlayLoader from './components/OverlayLoader';

function App() {
  const theme = muiTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
        <OverlayLoader />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
}

export default App;
