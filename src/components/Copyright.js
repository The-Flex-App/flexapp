import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(2, 0),
  },
}));

export default function Copyright() {
  const classes = useStyles();
  return (
    <Typography
      variant='body2'
      className={classes.footer}
      color='textSecondary'
      align='center'
    >
      {'Copyright © communication app'} {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
