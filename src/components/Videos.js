import React from 'react';

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
import Divider from '@material-ui/core/Divider';

const VIDEOS = gql`
  query GetVideos($projectId: Int) {
    videosByProject(projectId: $projectId) {
      id
      video
      thumbnail
      title
    }
  }
`;

const renderVideo = (data) => {
  const { video, id, title } = data;
  const url = `https://dggim6px82ot4.cloudfront.net/${video}`;

  return (
    <>
      <ListItem key={id}>
        <Grid container direction="row" justify="flex-start" alignItems="center" spacing={3}>
          <Grid item className="video-playback-container" xs={4}>
            <ReactPlayer
              url={url}
              controls
              width="100%"
              height="100%"
              config={{
                file: {
                  attributes: {
                    style: { height: '100%', objectFit: 'cover' },
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <ListItemText primary={title} />
          </Grid>
        </Grid>
      </ListItem>
      <Divider />
    </>
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
          <Typography variant="h5">Updates</Typography>
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
