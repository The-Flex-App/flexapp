import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ButtonAppBar from './components/header/ButtonAppBar';
import Projects from './components/projects/Projects';
import Videos from './components/videos/Videos';
import Copyright from './components/Copyright';

function App() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <ButtonAppBar />
      </Grid>
      <Grid item xs={3} className='project-list'>
        <Projects />
      </Grid>
      <Grid item xs={9} className='videos-list'>
        <Videos />
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
