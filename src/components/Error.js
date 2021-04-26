import React from 'react';
import { useLocation } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ButtonAppBar from './header/ButtonAppBar';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Footer from './Footer';

const useStyles = makeStyles((theme) => ({
  errorContainer: {
    margin: theme.spacing(0, 3),
    height: '40rem',
  },
}));

export default function Error() {
  const classes = useStyles();
  const { state } = useLocation();

  return (
    <Grid container>
      <Grid item xs={12}>
        <ButtonAppBar />
      </Grid>
      <Grid item xs={12} classes={{ root: classes.errorContainer }}>
        <Typography color={'secondary'}>
          <strong>Error:</strong> {state ? state.error : 'Unknown.'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Footer />
        </Paper>
      </Grid>
    </Grid>
  );
}
