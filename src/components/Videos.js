import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';

import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Videos({ selectedProject }) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h5" className={classes.title}>
        Updates - {selectedProject}
      </Typography>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedProject: state.appSettings.selectedProject,
  };
};

export default connect(mapStateToProps, {})(Videos);
