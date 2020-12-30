import React from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import VideoRecorder from 'react-video-recorder';
import TextField from '@material-ui/core/TextField';
import { v4 as uuidv4 } from 'uuid';
import { ADD_VIDEO } from '../../graphql/mutations';
import { Typography } from '@material-ui/core';
import { selectCurrentUserId } from '../../store/slices/user';

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
    {},
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
  const userId = useSelector(selectCurrentUserId);
  const { open, onClose, projectId, topicId } = props;
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
    const fileType = theBlob.type;
    const fileExtension = fileType.split('/')[1].split(';')[0];
    const name = fileName || `${uuidv4()}.${fileExtension}`;
    return new File([theBlob], name, {
      lastModified: new Date().getTime(),
      type: theBlob.type,
    });
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
          refetchQueries: ['GetVideosByTopic'],
        });

        if (error) {
          setSaveError(error.message);
        } else {
          handleClose();
        }
      };

      getSignedUrl(video.name, 'video').then((res) => {
        const videoKey = res.form.fields.key;

        uploadFileToS3(res.form, video).then(() => {
          const videoInput = {
            projectId: parseInt(projectId, 10),
            userId,
            topicId: parseInt(topicId, 10),
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

  if (!open) {
    return null;
  }

  return (
    <div>
      <Typography component='div'>
        {renderErrors()}
        <VideoRecorder
          timeLimit={120000}
          showReplayControls={true}
          replayVideoAutoplayAndLoopOff={true}
          onTurnOnCamera={handleCameraTurnOn}
          onRecordingComplete={(
            videoBlob,
            startedAt,
            thumbnailBlob,
            duration,
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
