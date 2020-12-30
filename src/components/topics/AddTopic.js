import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useMutation } from '@apollo/client';
import { ADD_TOPIC, EDIT_TOPIC, DELETE_TOPIC } from '../../graphql/mutations';
import { TOPICS } from '../../graphql/queries';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import ConfirmationDialog from '../ConfirmationDialog';

const useStyles = makeStyles((theme) => ({
  actionsRoot: {
    padding: theme.spacing(1, 3),
  },
}));

export default function AddTopic(props) {
  const classes = useStyles();
  const { open, onClose, selectedTopic, projectId } = props;
  const [newTopic, setNewTopic] = React.useState(false);
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [addTopic] = useMutation(ADD_TOPIC);
  const [editTopic] = useMutation(EDIT_TOPIC);
  const [deleteTopic] = useMutation(DELETE_TOPIC);
  const [error, setError] = React.useState();

  const handleInputChange = (e) => {
    setNewTopic(e.target.value);
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    try {
      if (selectedTopic) {
        await editTopic({
          variables: {
            id: selectedTopic.id,
            input: {
              title: newTopic,
              projectId,
            },
          },
          refetchQueries: [{ query: TOPICS, variables: { projectId } }],
        });
      } else {
        await addTopic({
          variables: {
            input: {
              title: newTopic,
              projectId,
            },
          },
          refetchQueries: ['GetTopics'],
        });
      }
      handleClose();
    } catch (e) {
      setError(e);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTopic({
        variables: {
          id: parseInt(selectedTopic.id, 10),
        },
        refetchQueries: ['GetTopics'],
      });
      handleClose();
    } catch (e) {
      setError(e);
    }
  };

  const onConfirmationOpen = (result) => {
    setOpenConfirmation(true);
  };

  const onConfirmationClose = (result) => {
    if (result) {
      handleDelete();
    }
    setOpenConfirmation(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
        fullWidth
      >
        <DialogTitle id='form-dialog-title'>
          {selectedTopic ? 'Edit topic' : 'Add new topic'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Topic name'
            fullWidth
            onChange={handleInputChange}
            defaultValue={selectedTopic ? selectedTopic.title : ''}
            variant='outlined'
            error={error}
            helperText={error && error.message}
          />
        </DialogContent>
        <DialogActions classes={{ root: classes.actionsRoot }}>
          {selectedTopic && (
            <Button
              variant='contained'
              color='secondary'
              startIcon={<DeleteIcon />}
              onClick={onConfirmationOpen}
            >
              Delete
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            color='primary'
            type='button'
            variant='contained'
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationDialog
        onClose={onConfirmationClose}
        open={openConfirmation}
        description={
          'Press "OK" to delete selected topic or press "CANCEL" to discard delete operation.'
        }
      />
    </div>
  );
}
