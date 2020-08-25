import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { gql, useMutation } from '@apollo/client';
import VideoRecorder from 'react-video-recorder';
import { v4 as uuidv4 } from 'uuid';

const ADD_VIDEO = gql`
  mutation CreateVideo($input: VideoInput!) {
    createVideo(input: $input) {
      thumbnail
      duration
      video
      projectId
    }
  }
`;

const getSignedUrl = (fileName, mimeType) => {
  const opts = {
    fileName,
    mimeType,
  };

  return fetch('http://localhost:8080/signed-url-put-object', {
    method: 'POST',
    body: JSON.stringify(opts),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    });
};

export default function AddVideo(props) {
  const { open, onClose, projectId } = props;

  const [addVideo] = useMutation(ADD_VIDEO);
  const [recordingData, setRecordingData] = React.useState(null);
  const [saveError, setSaveError] = React.useState(null);

  const handleClose = () => {
    onClose();
  };

  const blobToFile = (theBlob, fileName) => {
    const fileType = theBlob.type;
    const fileExtension = fileType.split('/')[1].split(';')[0];
    const name = fileName || `${uuidv4()}.${fileExtension}`;
    return new File([theBlob], name, { lastModified: new Date().getTime(), type: theBlob.type });
  };

  const uploadFileToS3 = (presignedPostData, file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      Object.keys(presignedPostData.fields).forEach((key) => {
        formData.append(key, presignedPostData.fields[key]);
      });

      // Actual file has to be appended last.
      formData.append('file', file);
      formData.append('key', `uploads/${file.name}`);

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
      const { duration, thumbnailBlob, videoBlob } = recordingData;

      if (!videoBlob) {
        return;
      }

      const thumbnail = blobToFile(thumbnailBlob);
      const video = blobToFile(videoBlob);

      getSignedUrl(video.name, videoBlob.type).then((res) => {
        uploadFileToS3(res.form, video);
      });

      const videoInput = {
        projectId: parseInt(projectId, 10),
        duration,
        thumbnail: thumbnail,
        video: video,
      };

      const { error } = await addVideo({
        variables: {
          input: videoInput,
        },
        refetchQueries: ['GetVideos'],
      });

      if (error) {
        setSaveError(error.message);
      }
      //   handleClose();
    } catch (e) {
      setSaveError(e);
    }
  };

  const handleCameraTurnOn = () => {
    setRecordingData(null);
  };

  const renderErrors = () => {
    if (!saveError) return null;
    console.log(saveError);
    return <p>{saveError.message}</p>;
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">Add an update</DialogTitle>
        <DialogContent>
          {renderErrors()}
          <VideoRecorder
            timeLimit={30000}
            showReplayControls={true}
            replayVideoAutoplayAndLoopOff={true}
            onTurnOnCamera={handleCameraTurnOn}
            onRecordingComplete={(videoBlob, startedAt, thumbnailBlob, duration) => {
              // Do something with the video...
              setRecordingData({ videoBlob, startedAt, duration, thumbnailBlob });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" type="button" variant="contained">
            Add Video
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
