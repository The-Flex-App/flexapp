import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import VideoRecorder from 'react-video-recorder';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useMutation } from '@apollo/client';
import { ADD_VIDEO } from '../../graphql/mutations';
import { selectCurrentUserId } from '../../store/slices/user';
import { setAppLoading } from '../../store/slices/app';
import { VIDEOS_TOPIC } from '../../graphql/queries';

const useStyles = makeStyles((theme) => ({
  addVideobutton: {
    marginLeft: theme.spacing(1),
  },
  quickSummaryTextarea: {
    margin: theme.spacing(2, 0),
  },
}));

const getSignedUrl = (fileName, fileType = 'video') => {
  const opts = {
    fileName,
    fileType,
  };

  return fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/signed-url?` +
      new URLSearchParams(opts),
    {}
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    });
};

export default function AddVideo(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userId = useSelector(selectCurrentUserId);
  const { onClose, projectId, topicId } = props;
  const [addVideo] = useMutation(ADD_VIDEO);
  const [recordingData, setRecordingData] = React.useState({});
  const [saveError, setSaveError] = React.useState(null);
  const [videoTitle, setVideoTitle] = React.useState(null);

  const handleClose = () => {
    onClose();
  };

  const handleInputChange = (e) => {
    setVideoTitle(e.target.value);
  };

  const blobToFile = (theBlob, fileName) => {
    const fileExtension = 'mp4';
    const name = fileName || `${uuidv4()}.${fileExtension}`;
    const file = new File([theBlob], name, {
      lastModified: new Date().getTime(),
      type: 'video/mp4',
    });
    return file;
  };

  const uploadFileToS3 = (presignedPostData, file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      Object.keys(presignedPostData.fields).forEach((key) => {
        formData.append(key, presignedPostData.fields[key]);
      });

      // Actual file has to be appended last.
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', presignedPostData.url, true);
      xhr.send(formData);
      xhr.onload = function () {
        this.status === 204 ? resolve() : reject(this.responseText);
      };
    });
  };

  const handleConfirm = async () => {
    try {
      dispatch(setAppLoading(true));
      const { duration, videoBlob } = recordingData;

      if (!videoBlob) {
        return;
      }

      const video = blobToFile(videoBlob);

      const saveVideo = async (videoInput) => {
        const { error } = await addVideo({
          variables: {
            input: videoInput,
          },
          refetchQueries: [
            {
              query: VIDEOS_TOPIC,
              variables: { projectId, topicId },
            },
          ],
        });

        if (error) {
          setSaveError(error.message);
        } else {
          handleClose();
        }
        dispatch(setAppLoading(false));
      };

      getSignedUrl(video.name, 'video').then((res) => {
        const videoKey = res.form.fields.key;

        uploadFileToS3(res.form, video).then(() => {
          const videoInput = {
            projectId,
            userId,
            topicId,
            duration,
            title: videoTitle,
            video: videoKey,
          };

          saveVideo(videoInput);
        });
      });
    } catch (e) {
      setSaveError(e);
    }
  };

  const handleCameraTurnOn = () => {
    setRecordingData({});
  };

  const renderErrors = () => {
    if (!saveError) return null;
    console.log(saveError);
    return <p>{saveError.message}</p>;
  };

  const { videoBlob = null } = recordingData;

  return (
    <div>
      <Typography component='div'>
        {renderErrors()}
        <VideoRecorder
          timeLimit={120000}
          showReplayControls={true}
          replayVideoAutoplayAndLoopOff={true}
          onTurnOnCamera={handleCameraTurnOn}
          renderDisconnectedView={() => {}}
          onRecordingComplete={(
            videoBlob,
            startedAt,
            thumbnailBlob,
            duration
          ) => {
            // Do something with the video...
            setRecordingData({
              videoBlob,
              startedAt,
              duration,
              thumbnailBlob,
            });
          }}
        />
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
          classes={{ root: classes.quickSummaryTextarea }}
          autoComplete='off'
        />
      </Typography>
      <Typography component='div' align={'right'}>
        <Button onClick={handleClose} color='primary'>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color='primary'
          type='button'
          variant='contained'
          disabled={!videoBlob}
          classes={{ root: classes.addVideobutton }}
        >
          Add Video
        </Button>
      </Typography>
    </div>
  );
}
