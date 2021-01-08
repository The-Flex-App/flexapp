import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ConfirmationDialog from '../ConfirmationDialog';
import { ADD_TOPIC, EDIT_TOPIC, DELETE_TOPIC } from '../../graphql/mutations';
import { setAppLoading } from '../../store/slices/app';

const useStyles = makeStyles((theme) => ({
  actionsRoot: {
    padding: theme.spacing(1, 3),
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export default function AddTopic(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { open, onClose, selectedTopic, projectId } = props;
  const [isDirty, setDirty] = React.useState(false);
  const [isEditMode, setEditMode] = React.useState(!!selectedTopic);
  const [newTopic, setNewTopic] = React.useState(
    selectedTopic && selectedTopic.title,
  );
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [error, setError] = React.useState();
  const [addTopic] = useMutation(ADD_TOPIC);
  const [editTopic] = useMutation(EDIT_TOPIC);
  const [deleteTopic] = useMutation(DELETE_TOPIC);

  useEffect(() => {
    if (open) {
      if (selectedTopic) {
        setEditMode(true);
        setNewTopic(selectedTopic.title);
      } else {
        setEditMode(false);
        setNewTopic(undefined);
      }
      setDirty(false);
    }
  }, [selectedTopic, open]);

  const isSaveDisabled = () => {
    if (isEditMode) return !isDirty;
    return !newTopic;
  };

  const handleInputChange = (e) => {
    setNewTopic(e.target.value);
    setDirty(true);
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    try {
      dispatch(setAppLoading(true));
      if (isEditMode) {
        await editTopic({
          variables: {
            id: selectedTopic.id,
            input: {
              title: newTopic,
              projectId,
            },
          },
          refetchQueries: ['GetProjects'],
        });
      } else {
        await addTopic({
          variables: {
            input: {
              title: newTopic,
              projectId,
            },
          },
          refetchQueries: ['GetProjects'],
        });
      }
      handleClose();
      dispatch(setAppLoading(false));
    } catch (e) {
      setError(e);
      dispatch(setAppLoading(false));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(setAppLoading(true));
      await deleteTopic({
        variables: {
          id: parseInt(selectedTopic.id, 10),
        },
        refetchQueries: ['GetProjects'],
      });
      handleClose();
      dispatch(setAppLoading(false));
    } catch (e) {
      setError(e);
      dispatch(setAppLoading(false));
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
        style={{ zIndex: 2 }}
      >
        <DialogTitle
          id='form-dialog-title'
          disableTypography
          classes={{ root: classes.dialogTitle }}
        >
          <Typography variant='h6' component='h2'>
            {isEditMode ? 'Edit topic' : 'Add new topic'}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Topic name'
            fullWidth
            onChange={handleInputChange}
            value={newTopic}
            variant='outlined'
            error={!!error}
            helperText={error && error.message}
          />
        </DialogContent>
        <DialogActions classes={{ root: classes.actionsRoot }}>
          {isEditMode && (
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
            disabled={isSaveDisabled()}
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
