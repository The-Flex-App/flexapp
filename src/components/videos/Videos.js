import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddVideo from './AddVideo';
import ReactPlayer from 'react-player';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { selectCurrentTopic } from '../../store/slices/topics';
import { VIDEOS_TOPIC } from '../../graphql/queries';

const useStyles = makeStyles((theme) => ({
  addVideo: {
    marginLeft: theme.spacing(1),
  },
  updateCard: {
    width: '100%',
    height: 200,
    border: `1px solid ${theme.palette.grey}`,
  },
}));

const renderVideo = (data, handleVideoSelect) => {
  const { video, id, title } = data;

  const onUpdateClick = () => {
    const url = `${process.env.REACT_APP_MEDIA_URL}/${video}`;
    handleVideoSelect(url);
  };

  const onSettingClick = (e) => {
    e.stopPropagation();
    const url = `${process.env.REACT_APP_MEDIA_URL}/${video}`;
    handleVideoSelect(url);
  };

  return (
    <>
      <ListItem key={id} disableGutters onClick={onUpdateClick}>
        <Typography
          component={'div'}
          style={{
            width: '100%',
            minHeight: 150,
            border: `1px solid`,
            padding: '8px',
          }}
        >
          <Typography>{title}</Typography>
          <Typography align='right'>
            <IconButton onClick={onSettingClick}>
              <SettingsOutlinedIcon />
            </IconButton>
          </Typography>
        </Typography>
      </ListItem>
    </>
  );
};

const renderVideos = (data = [], handleVideoSelect) => {
  const length = data.length;

  if (length === 0) {
    return <Typography variant='body2'>No updates found</Typography>;
  }

  return (
    <List>{data.map((video) => renderVideo(video, handleVideoSelect))}</List>
  );
};

const renderNoUpdates = () => {
  return <Typography variant='body2'>No updates</Typography>;
};

function Videos() {
  const classes = useStyles();
  const selectedTopic = useSelector(selectCurrentTopic);
  const { id = 0, projectId = 0 } = selectedTopic;
  const { loading, error, data } = useQuery(VIDEOS_TOPIC, {
    variables: {
      projectId: parseInt(projectId, 10),
      topicId: parseInt(id, 10),
    },
  });
  const [openModal, setOpenModal] = React.useState(false);
  const [activeURL, setActiveURL] = React.useState(null);

  useEffect(() => {
    setOpenModal(false);
    setActiveURL(null);
  }, [selectedTopic]);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const renderButton = () => {
    return <AddCircleIcon />;
  };

  const handleAddVideo = () => {
    setActiveURL(null);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleConfirm = () => {};

  const handleVideoSelect = (url) => {
    openModal && setOpenModal(false);
    setActiveURL(url);
  };

  return (
    <>
      <Grid container direction='row' justify='flex-start' spacing={3}>
        <Grid item xs={4}>
          <Grid container alignItems='center' className='page-title'>
            <Typography variant='h5'>Updates</Typography>
            <IconButton
              aria-label='add'
              color='primary'
              onClick={handleAddVideo}
              disabled={id === 0}
              className={classes.addVideo}
            >
              {renderButton()}
            </IconButton>
          </Grid>
          {!selectedTopic && renderNoUpdates()}
          {selectedTopic && renderVideos(data.videosByTopic, handleVideoSelect)}
        </Grid>
        <Grid item xs={8}>
          <AddVideo
            open={openModal}
            onClose={handleClose}
            onConfirm={handleConfirm}
            topicId={id}
            projectId={projectId}
          />
          {activeURL && (
            <ReactPlayer
              url={activeURL}
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
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default Videos;
