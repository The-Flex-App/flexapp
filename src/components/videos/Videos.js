import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import AddVideo from './AddVideo';
import Video from './Video';
import { selectCurrentTopic } from '../../store/slices/topics';
import { selectIsOwner, selectCurrentUserId } from '../../store/slices/user';
import { getFullName, getDateTimeDiff } from '../../utils/misc';
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
  cardItem: {
    width: '100%',
    minHeight: 150,
    border: `2px solid`,
    borderRadius: 5,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '&$active': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  active: {},
  listItem: {
    display: 'block',
    padding: 0,
  },
  videoAuthor: {
    padding: theme.spacing(0.5, 0, 1),
  },
}));

const RenderVideo = (props) => {
  const classes = useStyles();
  const {
    id,
    title,
    handleVideoSelect,
    isOwner,
    userId,
    currentUserId,
    firstName,
    lastName,
    email,
    updatedAt,
    activeVideo,
  } = props;
  const limit = 100;

  const onUpdateClick = () => {
    handleVideoSelect(props);
  };

  const onSettingClick = (e) => {
    e.stopPropagation();
    handleVideoSelect({ ...props, isEdit: true });
  };

  const getContent = () => {
    if (title.length <= limit) return title;
    return title.substring(0, limit) + '...';
  };

  return (
    <ListItem disableGutters classes={{ root: classes.listItem }}>
      <Typography
        component={'div'}
        classes={{ root: classes.cardItem }}
        className={activeVideo && id === activeVideo.id ? classes.active : ''}
        onClick={onUpdateClick}
      >
        <Typography>{getContent()}</Typography>
        {isOwner || userId === currentUserId ? (
          <Typography align='right'>
            <IconButton onClick={onSettingClick}>
              <SettingsOutlinedIcon />
            </IconButton>
          </Typography>
        ) : null}
      </Typography>
      <Typography variant='body2' classes={{ root: classes.videoAuthor }}>
        &lsquo;{getFullName(firstName, lastName, email)}&rsquo;{' '}
        {getDateTimeDiff(updatedAt)}
      </Typography>
    </ListItem>
  );
};

const renderVideos = ({ videosData = [], ...rest }) => {
  const length = videosData.length;

  if (length === 0) {
    return <Typography variant='body2'>No updates found</Typography>;
  }

  return (
    <List>
      {videosData.map((video, index) => (
        <RenderVideo {...{ ...video, ...rest }} key={index} />
      ))}
    </List>
  );
};

const renderNoUpdates = () => {
  return <Typography variant='body2'>No updates</Typography>;
};

function Videos() {
  const classes = useStyles();
  const selectedTopic = useSelector(selectCurrentTopic);
  const isOwner = useSelector(selectIsOwner);
  const currentUserId = useSelector(selectCurrentUserId);
  const { id, projectId } = selectedTopic;

  const [openModal, setOpenModal] = React.useState(false);
  const [activeVideo, setActiveVideo] = React.useState(null);

  const { loading, error, data } = useQuery(VIDEOS_TOPIC, {
    variables: {
      projectId: parseInt(projectId, 10),
      topicId: parseInt(id, 10),
    },
    skip: !id || !projectId,
  });

  useEffect(() => {
    setOpenModal(false);
    setActiveVideo(null);
  }, [selectedTopic]);

  const renderButton = () => {
    return <AddCircleIcon />;
  };

  const handleAddVideo = () => {
    setActiveVideo(null);
    setOpenModal(true);
  };

  const clearActiveVideo = () => {
    setActiveVideo(null);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleVideoSelect = (activeVideo) => {
    openModal && setOpenModal(false);
    setActiveVideo(activeVideo);
  };

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return id ? (
    <Grid container direction='row' justify='flex-start' spacing={3}>
      <Grid item xs={4}>
        <Grid container alignItems='center' className='page-title'>
          <Typography variant='h5'>Updates</Typography>
          <IconButton
            aria-label='add'
            color='primary'
            onClick={handleAddVideo}
            className={classes.addVideo}
          >
            {renderButton()}
          </IconButton>
        </Grid>
        {!selectedTopic && renderNoUpdates()}
        {selectedTopic &&
          renderVideos({
            videosData: data.videosByTopic,
            handleVideoSelect,
            isOwner,
            currentUserId,
            activeVideo,
          })}
      </Grid>
      <Grid item xs={8}>
        {openModal && (
          <AddVideo
            onClose={handleClose}
            projectId={parseInt(projectId, 10)}
            topicId={parseInt(id, 10)}
          />
        )}
        {activeVideo && (
          <Video
            projectId={parseInt(projectId, 10)}
            topicId={parseInt(id, 10)}
            activeVideo={activeVideo}
            clearActiveVideo={clearActiveVideo}
          />
        )}
      </Grid>
    </Grid>
  ) : null;
}

export default Videos;
