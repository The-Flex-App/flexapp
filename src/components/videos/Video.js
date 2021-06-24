import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player';
import { useMutation } from '@apollo/client';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { DELETE_VIDEO, EDIT_VIDEO } from '../../graphql/mutations';
import { selectCurrentUserId } from '../../store/slices/user';
import ConfirmationDialog from '../ConfirmationDialog';
import { setAppLoading } from '../../store/slices/app';
import { VIDEOS_TOPIC } from '../../graphql/queries';
import { Fragment } from 'react';

const useStyles = makeStyles((theme) => ({
  addVideobutton: {
    marginLeft: theme.spacing(1),
  },
  closeVideoButton: {
    marginLeft: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
  },
  quickSummaryTextarea: {
    margin: theme.spacing(2, 0),
  },
  quickSummaryTitle: {
    margin: theme.spacing(2, 0, 0.5),
    fontSize: 16,
    fontWeight: 'bold',
  },
}));

export default function Video(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userId = useSelector(selectCurrentUserId);
  const { projectId, topicId, activeVideo, clearActiveVideo } = props;
  const { video, isEdit, id } = activeVideo;
  const [editVideo] = useMutation(EDIT_VIDEO);
  const [deleteVideo] = useMutation(DELETE_VIDEO);
  const [isDirty, setDirty] = React.useState(false);
  const [saveError, setSaveError] = React.useState(null);
  const [videoTitle, setVideoTitle] = React.useState(activeVideo.title);
  const [openConfirmation, setOpenConfirmation] = React.useState(false);

  const activeVideoURL = `${process.env.REACT_APP_MEDIA_URL}/${video}`;

  useEffect(() => {
    setVideoTitle(activeVideo.title);
    setDirty(false);
  }, [activeVideo]);

  const handleInputChange = (e) => {
    setVideoTitle(e.target.value);
    setDirty(true);
  };

  const handleDelete = async () => {
    try {
      dispatch(setAppLoading(true));
      await deleteVideo({
        variables: {
          id,
        },
        refetchQueries: [
          {
            query: VIDEOS_TOPIC,
            variables: { projectId, topicId },
          },
        ],
      });
      clearActiveVideo();
      dispatch(setAppLoading(false));
    } catch (e) {
      setSaveError(e);
      dispatch(setAppLoading(false));
    }
  };

  const handleConfirm = async () => {
    try {
      dispatch(setAppLoading(true));
      await editVideo({
        variables: {
          id,
          input: {
            title: videoTitle,
            video,
            projectId,
            topicId,
            userId,
          },
        },
        refetchQueries: [
          {
            query: VIDEOS_TOPIC,
            variables: { projectId, topicId },
          },
        ],
      });
      dispatch(setAppLoading(false));
    } catch (e) {
      setSaveError(e);
      dispatch(setAppLoading(false));
    }
  };

  const renderErrors = () => {
    if (!saveError) return null;
    return <p>{saveError.message}</p>;
  };

  const onConfirmationOpen = () => {
    setOpenConfirmation(true);
  };

  const onConfirmationClose = (result) => {
    result && handleDelete();
    setOpenConfirmation(false);
  };

  return (
    <div>
      <Typography component='div'>
        {renderErrors()}
        <ReactPlayer
          url={activeVideoURL}
          controls
          width='100%'
          height='100%'
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                style: {
                  width: '100%',
                  objectFit: 'cover',
                },
              },
            },
          }}
        />
        {isEdit ? (
          <TextField
            autoFocus
            margin='dense'
            multiline
            rows={5}
            id='quick-summary'
            label='Quick summary'
            onChange={handleInputChange}
            variant='outlined'
            fullWidth
            value={videoTitle}
            classes={{ root: classes.quickSummaryTextarea }}
            autoComplete='off'
          />
        ) : (
          <Fragment>
            <Typography variant='h5' className={classes.quickSummaryTitle}>
              Quick summary
            </Typography>
            <Typography>{videoTitle}</Typography>
          </Fragment>
        )}
      </Typography>
      {isEdit && (
        <Typography component='div' align={'right'}>
          <Button
            variant='contained'
            color='secondary'
            startIcon={<DeleteIcon />}
            onClick={onConfirmationOpen}
          >
            Delete
          </Button>
          <Button
            onClick={handleConfirm}
            color='primary'
            type='button'
            variant='contained'
            classes={{ root: classes.addVideobutton }}
            startIcon={<SaveIcon />}
            disabled={!isDirty}
          >
            Save
          </Button>
          <IconButton
            onClick={clearActiveVideo}
            className={classes.closeVideoButton}
          >
            <CloseIcon />
          </IconButton>
        </Typography>
      )}
      <ConfirmationDialog
        onClose={onConfirmationClose}
        open={openConfirmation}
        description={
          'Press "OK" to delete current video or press "CANCEL" to discard.'
        }
      />
    </div>
  );
}
