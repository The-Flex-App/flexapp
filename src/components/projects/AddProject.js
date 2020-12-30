import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import {
  ADD_PROJECT,
  EDIT_PROJECT,
  DELETE_PROJECT,
} from '../../graphql/mutations';
import { selectCurrentWorkspaceId } from '../../store/slices/user';
import ConfirmationDialog from '../ConfirmationDialog';

const useStyles = makeStyles((theme) => ({
  actionsRoot: {
    padding: theme.spacing(1, 3),
  },
  finishDateLabel: {
    background: theme.palette.common.white,
    width: 200,
  },
  finishDateLabelShrink: {
    width: 'auto',
  },
}));

export default function AddProject(props) {
  const classes = useStyles();
  const { open, onClose, selectedProject } = props;
  const workspaceId = useSelector(selectCurrentWorkspaceId);
  const { workspaceId: activeWorkspaceId } = useParams();
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [projectTitle, setProjectTitle] = React.useState(
    selectedProject && selectedProject.title,
  );
  const [projectFinishDate, setProjectFinishDate] = React.useState(
    selectedProject && dayjs(selectedProject.finishDate).format('YYYY-MM'),
  );
  const [projectRag, setProjectRAG] = React.useState(
    selectedProject && selectedProject.rag,
  );

  useEffect(() => {
    if (selectedProject) {
      setProjectTitle(selectedProject.title);
      setProjectFinishDate(dayjs(selectedProject.finishDate).format('YYYY-MM'));
      setProjectRAG(selectedProject.rag);
    } else {
      setProjectTitle(null);
      setProjectFinishDate(null);
      setProjectRAG(null);
    }
  }, [selectedProject]);

  const [addProject] = useMutation(ADD_PROJECT);
  const [editProject] = useMutation(EDIT_PROJECT);
  const [deleteProject] = useMutation(DELETE_PROJECT);
  const [error, setError] = React.useState();

  const handleNameChange = (e) => {
    setProjectTitle(e.target.value);
  };

  const handleFinishDateChange = (e) => {
    setProjectFinishDate(e.target.value);
  };

  const handleRAGChange = (e) => {
    setProjectRAG(e.target.value);
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleDelete = async () => {
    try {
      await deleteProject({
        variables: {
          id: parseInt(selectedProject.id, 10),
        },
        refetchQueries: ['GetProjects'],
      });
      handleClose();
    } catch (e) {
      setError(e);
    }
  };

  const handleConfirm = async () => {
    try {
      if (selectedProject) {
        await editProject({
          variables: {
            id: selectedProject.id,
            input: {
              rag: projectRag,
              finishDate: projectFinishDate,
              title: projectTitle,
            },
          },
          refetchQueries: ['GetProjects'],
        });
      } else {
        await addProject({
          variables: {
            input: {
              title: projectTitle,
              rag: projectRag,
              finishDate: projectFinishDate,
              workspaceId: activeWorkspaceId || workspaceId,
            },
          },
          refetchQueries: ['GetProjects'],
        });
      }
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
          {selectedProject ? 'Edit project' : 'Add new project'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Project name'
            fullWidth
            value={projectTitle || ''}
            onChange={handleNameChange}
            variant='outlined'
          />
          <TextField
            InputLabelProps={{
              classes: {
                root: classes.finishDateLabel,
                shrink: classes.finishDateLabelShrink,
              },
            }}
            type='month'
            margin='dense'
            id='finish-name'
            label='Finish date'
            fullWidth
            onChange={handleFinishDateChange}
            value={projectFinishDate || ''}
            variant='outlined'
          />
          <RadioGroup
            row
            aria-label='rag'
            name='rag'
            value={projectRag || ''}
            onChange={handleRAGChange}
          >
            <FormControlLabel value='R' control={<Radio />} label='R' />
            <FormControlLabel value='A' control={<Radio />} label='A' />
            <FormControlLabel value='G' control={<Radio />} label='G' />
          </RadioGroup>
          <FormControl error={error}>
            <FormHelperText>{error && error.message}</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions classes={{ root: classes.actionsRoot }}>
          {selectedProject && (
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
          'Press "OK" to delete selected project or press "CANCEL" to discard delete operation.'
        }
      />
    </div>
  );
}
