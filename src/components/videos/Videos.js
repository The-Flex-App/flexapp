import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { fade } from '@material-ui/core/styles/colorManipulator';
import AddVideo from './AddVideo';
import Video from './Video';
import { selectCurrentTopic } from '../../store/slices/topics';
import { selectIsOwner, selectCurrentUserId } from '../../store/slices/user';
import { getFullName, getDateTimeDiff } from '../../utils/misc';
import { VIDEOS_TOPIC } from '../../graphql/queries';

const useStyles = makeStyles((theme) => ({
  updatesWrapper: {
    minWidth: 250,
    padding: theme.spacing(3, 2, 0, 3),
  },
  videoContainer: {
    padding: theme.spacing(3, 0),
  },
  videoList: {
    overflowY: 'auto',
    maxHeight: `calc(100vh - 200px)`,
    paddingRight: theme.spacing(1),
  },
  addVideo: {},
  cardItem: {
    width: '100%',
    minHeight: 120,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    overflowWrap: 'break-word',
    border: `1px solid #444`,
    boxShadow: `inset 0 0 2px #444`,
    cursor: 'pointer',
    borderRadius: 0,
    '&:hover': {
      // backgroundColor: 'rgba(0, 0, 0, 0.04)',
      backgroundColor: fade(theme.palette.primary.main, 0.04),
    },
    '&$active': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    '&$addVideo': {
      justifyContent: 'center',
      alignItems: 'center',
      color: theme.palette.primary.main,
      boxShadow: `inset 0 0 2px ${theme.palette.primary.main}`,
      borderColor: theme.palette.primary.main,
      marginTop: theme.spacing(1),
      '&:hover': {
        backgroundColor: fade(theme.palette.primary.main, 0.04),
      },
      '& svg': {
        fontSize: 25,
      },
    },
  },
  active: {},
  listItem: {
    display: 'block',
    padding: 0,
  },
  videoAuthor: {
    padding: theme.spacing(0.5, 0, 1),
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: theme.spacing(2, 2, 1.5),
    display: 'flex',
    flexDirection: 'column',
    minHeight: 120,
    boxSizing: 'border-box',
    '&:last-child': {
      paddingBottom: theme.spacing(1.5),
    },
  },
  thumbContent: {
    fontWeight: 'bold',
    display: '-webkit-box',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    marginBottom: theme.spacing(0.5),
    flex: 1,
  },
  settingButton: {
    padding: 3,
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
    createdAt,
    activeVideo,
  } = props;

  const onUpdateClick = () => {
    handleVideoSelect(props);
  };

  const onSettingClick = (e) => {
    e.stopPropagation();
    handleVideoSelect({ ...props, isEdit: true });
  };

  return (
    <React.Fragment>
      <Card
        classes={{ root: classes.cardItem }}
        className={activeVideo && id === activeVideo.id ? classes.active : ''}
        onClick={onUpdateClick}
      >
        <CardContent className={classes.cardContent}>
          <Typography className={classes.thumbContent}>{title}</Typography>
          {isOwner || userId === currentUserId ? (
            <Typography align='right'>
              <IconButton
                className={classes.settingButton}
                onClick={onSettingClick}
              >
                <SettingsOutlinedIcon />
              </IconButton>
            </Typography>
          ) : null}
        </CardContent>
      </Card>
      <Typography variant='body2' classes={{ root: classes.videoAuthor }}>
        {getFullName(firstName, lastName, email)} &nbsp;
        {getDateTimeDiff(createdAt)}
      </Typography>
    </React.Fragment>
  );
};

const renderVideos = ({ videosData = [], ...rest }) => {
  const length = videosData.length;

  if (length === 0) {
    return (
      <Typography variant='body2' component='em'>
        No updates found
      </Typography>
    );
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
    <Grid container direction='row' justify='flex-start'>
      <Grid item xs={2} className={classes.updatesWrapper}>
        <Grid container alignItems='center' className='page-title'>
          <Typography variant='h5'>Updates</Typography>
        </Grid>
        <Typography component='div' className={classes.videoList}>
          <Card
            component={'div'}
            classes={{ root: classes.cardItem }}
            className={classes.addVideo}
            onClick={handleAddVideo}
          >
            <AddIcon />
          </Card>
          {!selectedTopic && renderNoUpdates()}
          {selectedTopic &&
            renderVideos({
              videosData: data.videosByTopic,
              handleVideoSelect,
              isOwner,
              currentUserId,
              activeVideo,
            })}
        </Typography>
      </Grid>
      <Grid item xs={6} className={classes.videoContainer}>
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
