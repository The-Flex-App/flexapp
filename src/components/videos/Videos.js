import React from 'react';
import { useParams } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { Typography, Grid } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AddVideo from './AddVideo';
import ReactPlayer from 'react-player';
import Divider from '@material-ui/core/Divider';
import { selectedProjectSelector } from '../../store/slices/projects';
import { VIDEOS } from '../../graphql/queries';

const renderVideo = (data) => {
  const { video, id, title } = data;
  const url = `${process.env.REACT_APP_MEDIA_URL}/${video}`;

  return (
    <>
      <ListItem key={id}>
        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='center'
          spacing={3}
        >
          <Grid item className='video-playback-container' xs={4}>
            <ReactPlayer
              url={url}
              controls
              width='100%'
              height='100%'
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

const renderVideos = (data = []) => {
  const length = data.length;

  if (length === 0) {
    return <Typography variant='body2'>No updates found</Typography>;
  }

  return <List>{data.map((video) => renderVideo(video))}</List>;
};

const renderNoUpdates = () => {
  return <Typography variant='body2'>No updates</Typography>;
};

function Videos({ selectedProject = {} }) {
  const { id = 0 } = selectedProject;
  const { workspaceId } = useSelector(({ users }) => {
    return users.loggedInUser || {};
  });
  const { workspaceId: activeWorkspaceId } = useParams();
  const { loading, error, data } = useQuery(VIDEOS, {
    variables: {
      projectId: parseInt(id, 10),
      workspaceId: activeWorkspaceId || workspaceId,
    },
  });
  const [openModal, setOpenModal] = React.useState(false);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const renderButton = () => {
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
      <Grid container alignItems='center'>
        <Grid item className='page-title'>
          <Typography variant='h5'>Updates</Typography>
        </Grid>
        <Grid item>
          <IconButton
            aria-label='add'
            color='primary'
            onClick={handleAddVideo}
            disabled={id === 0}
          >
            {renderButton()}
          </IconButton>
        </Grid>
      </Grid>
      <AddVideo
        open={openModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        projectId={id}
      />
      {!selectedProject && renderNoUpdates()}
      {selectedProject && renderVideos(data.videosByProject)}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedProject: selectedProjectSelector(state),
  };
};

export default connect(mapStateToProps, {})(Videos);
