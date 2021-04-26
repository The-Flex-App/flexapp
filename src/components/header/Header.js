import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import UserInfo from './UserInfo';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  flexTitle: {
    fontWeight: 'bold',
    display: 'inline-block',
    fontSize: 20,
    padding: '0 12px',
    background: theme.palette.primary.main,
    height: '30px',
    lineHeight: '30px',
    color: theme.palette.primary.contrastText,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <AppBar position="static" color="transparent">
      <Toolbar variant="dense">
        <Typography variant="h5" className={classes.title}>
          <Link component={Link} href="/" className={classes.flexTitle}>
            FLEX
          </Link>
        </Typography>
        <UserInfo />
      </Toolbar>
    </AppBar>
  );
}
