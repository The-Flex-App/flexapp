import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import { useQuery, gql } from '@apollo/client';
import { Typography, Grid } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AddVideo from './AddVideo';
import ReactPlayer from 'react-player';

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

const VIDEOS = gql`
  query GetVideos($projectId: Int) {
    videosByProject(projectId: $projectId) {
      id
      video
      thumbnail
    }
  }
`;

const renderVideo = (data) => {
  const { video, id, title } = data;
  const url = `https://dggim6px82ot4.cloudfront.net/${video}`;

  return (
    <ListItem key={id}>
      <Grid container>
        <Grid item>
          <ReactPlayer url={url} />
        </Grid>
        <Grid item>
          <ListItemText primary={title} />
        </Grid>
      </Grid>
    </ListItem>
  );
};

const renderVideos = (data) => {
  const length = data.length;

  if (length === 0) {
    return <Typography variant="body2">No updates found</Typography>;
  }

  return <List>{data.map((video) => renderVideo(video))}</List>;
};

const renderNoUpdates = () => {
  return <Typography variant="body2">No updates</Typography>;
};

function Videos({ selectedProject = {} }) {
  const classes = useStyles();
  const { id = 0 } = selectedProject;
  const { loading, error, data } = useQuery(VIDEOS, {
    variables: { projectId: parseInt(id, 10) },
  });
  const [openModal, setOpenModal] = React.useState(false);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const renderButton = () => {
    if (id === 0) return null;

    return <AddIcon />;
  };

  const handleAddVideo = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleConfirm = () => {};

  return (
    <>
      <Grid container alignItems="center">
        <Grid item>
          <Typography variant="h5" className={classes.title}>
            Updates
          </Typography>
        </Grid>
        <Grid item>
          <IconButton aria-label="add" color="primary" onClick={handleAddVideo}>
            {renderButton()}
          </IconButton>
        </Grid>
      </Grid>
      <AddVideo open={openModal} onClose={handleClose} onConfirm={handleConfirm} projectId={id} />
      {!selectedProject && renderNoUpdates()}
      {selectedProject && renderVideos(data.videosByProject)}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedProject: state.selectedProject.selectedProject,
  };
};

export default connect(mapStateToProps, {})(Videos);
