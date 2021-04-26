import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Link } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(2, 0),
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBar position="static" color="transparent">
        <Toolbar variant="dense">
          <Grid container spacing={2} justify="center">
            <Grid item>
              <Typography variant="body2" className={classes.footer} color="textSecondary" align="center">
                {'Copyright © FlexApp'} {new Date().getFullYear()}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" className={classes.footer} color="textSecondary" align="center">
                <Link href="https://flexapp.co.uk/privacy-notice" rel="noopener noreferrer" target="_blank">
                  Privacy Notice
                </Link>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" className={classes.footer} color="textSecondary" align="center">
                <Link href="https://flexapp.co.uk/user-terms" rel="noopener noreferrer" target="_blank">
                  Terms of Use
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
