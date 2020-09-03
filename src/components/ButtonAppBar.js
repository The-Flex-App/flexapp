import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default function ButtonAppBar() {
  return (
    <div>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Typography variant="h6">Name/Logo goes here</Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
