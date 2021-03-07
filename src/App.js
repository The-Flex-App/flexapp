import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ButtonAppBar from './components/header/ButtonAppBar';
import Projects from './components/projects/Projects';
import Videos from './components/videos/Videos';
import Copyright from './components/Copyright';

function App() {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <ButtonAppBar />
      </Grid>
      <Grid item xs={12} className='app-wrapper'>
        <div className='sidebar'>
          <Projects />
        </div>
        <div className='content-area'>
          <Videos />
        </div>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Copyright />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default App;
