import React from 'react';

import './App.scss';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ButtonAppBar from './components/ButtonAppBar';
import Projects from './components/Projects';
import Copyright from './components/Copyright';
import Videos from './components/Videos';

import { Provider } from 'react-redux';
import store from '../src/store';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Provider store={store}>
      <Container maxWidth="lg" className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <ButtonAppBar />
          </Grid>
          <Grid item xs={3} className="project-list">
            <Projects />
          </Grid>
          <Grid item xs={9}>
            <Videos />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Copyright />
          </Paper>
        </Grid>
      </Container>
    </Provider>
  );
}

export default App;
