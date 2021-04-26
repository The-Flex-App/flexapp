import React from 'react';
import { useSelector } from 'react-redux';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Portal from '@material-ui/core/Portal';
import { makeStyles } from '@material-ui/core/styles';
import { isAppLoading } from '../store/slices/app';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function OverlayLoader() {
  const classes = useStyles();
  const isLoading = useSelector(isAppLoading);

  if (!isLoading) return null;
  return (
    <Portal>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Portal>
  );
}
