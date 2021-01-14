import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { DatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/client';
import { format } from 'date-fns';
import {
  ADD_PROJECT,
  EDIT_PROJECT,
  DELETE_PROJECT,
} from '../../graphql/mutations';
import { selectCurrentWorkspaceId } from '../../store/slices/user';
import ConfirmationDialog from '../ConfirmationDialog';
import { setAppLoading } from '../../store/slices/app';
import {
  selectCurrentTopic,
  setSelectedTopic,
} from '../../store/slices/topics';

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsRoot: {
    padding: theme.spacing(1, 3),
  },
  checked: {
    '&$redRadioButton': {
      color: '#ff0000',
    },
    '&$yellowRadioButton': {
      color: '#fac710',
    },
    '&$greenRadioButton': {
      color: '#0ca789',
    },
  },
  redRadioButton: {
    color: '#ff0000',
    '& svg': {
      fontSize: 30,
    },
  },
  yellowRadioButton: {
    color: '#fac710',
    '& svg': {
      fontSize: 30,
    },
  },
  greenRadioButton: {
    color: '#0ca789',
    '& svg': {
      fontSize: 30,
    },
  },
}));

export default function AddProject(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { open, onClose, selectedProject } = props;
  const workspaceId = useSelector(selectCurrentWorkspaceId);
  const { projectId: activeProjectId } = useSelector(selectCurrentTopic);
  const { workspaceId: activeWorkspaceId } = useParams();
  const [isEditMode, setEditMode] = React.useState(!!selectedProject);
  const [isDirty, setDirty] = React.useState(false);
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [projectTitle, setProjectTitle] = React.useState(
    selectedProject && selectedProject.title,
  );
  const [projectFinishDate, setProjectFinishDate] = React.useState(
    format(new Date(selectedProject && selectedProject.finishDate), 'y-MM'),
  );
  const [projectRag, setProjectRAG] = React.useState(
    selectedProject && selectedProject.rag,
  );

  useEffect(() => {
    if (open) {
      if (selectedProject) {
        setEditMode(true);
        setProjectTitle(selectedProject.title);
        setProjectFinishDate(
          format(new Date(selectedProject.finishDate), 'y-MM'),
        );
        setProjectRAG(selectedProject.rag);
      } else {
        setEditMode(false);
        setProjectTitle(undefined);
        setProjectFinishDate(format(new Date(), 'y-MM'));
        setProjectRAG(undefined);
      }
      setDirty(false);
    }
  }, [selectedProject, open]);

  const [addProject] = useMutation(ADD_PROJECT);
  const [editProject] = useMutation(EDIT_PROJECT);
  const [deleteProject] = useMutation(DELETE_PROJECT);
  const [error, setError] = React.useState();

  const isSaveDisabled = () => {
    if (isEditMode) return !isDirty;
    return !(projectTitle && projectFinishDate && projectRag);
  };

  const handleNameChange = (e) => {
    setProjectTitle(e.target.value);
    setDirty(true);
  };

  const handleFinishDateChange = (x) => {
    setProjectFinishDate(x);
    setDirty(true);
  };

  const handleRAGChange = (e) => {
    setProjectRAG(e.target.value);
    setDirty(true);
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleDelete = async () => {
    try {
      dispatch(setAppLoading(true));
      await deleteProject({
        variables: {
          id: parseInt(selectedProject.id, 10),
        },
        refetchQueries: ['GetProjects'],
      });
      handleClose();
      dispatch(setAppLoading(false));
      if (parseInt(selectedProject.id, 10) === activeProjectId) {
        dispatch(setSelectedTopic(null));
      }
    } catch (e) {
      setError(e);
      dispatch(setAppLoading(false));
    }
  };

  const handleConfirm = async () => {
    try {
      dispatch(setAppLoading(true));
      if (isEditMode) {
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
            {isEditMode ? 'Edit project' : 'Add new project'}
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
            label='Project name'
            fullWidth
            value={projectTitle || ''}
            onChange={handleNameChange}
            variant='outlined'
          />
          <DatePicker
            fullWidth
            variant='inline'
            openTo='year'
            views={['year', 'month']}
            label='Finish date'
            inputVariant='outlined'
            value={projectFinishDate}
            onChange={handleFinishDateChange}
            margin='dense'
          />
          <RadioGroup
            row
            aria-label='rag'
            name='rag'
            value={projectRag || ''}
            onChange={handleRAGChange}
          >
            <FormControlLabel
              value='R'
              control={
                <Radio
                  classes={{
                    root: classes.redRadioButton,
                    checked: classes.checked,
                  }}
                />
              }
              label='R'
            />
            <FormControlLabel
              value='A'
              control={
                <Radio
                  classes={{
                    root: classes.yellowRadioButton,
                    checked: classes.checked,
                  }}
                />
              }
              label='A'
            />
            <FormControlLabel
              value='G'
              control={
                <Radio
                  classes={{
                    root: classes.greenRadioButton,
                    checked: classes.checked,
                  }}
                />
              }
              label='G'
            />
          </RadioGroup>
          <FormControl error={!!error}>
            <FormHelperText>{error && error.message}</FormHelperText>
          </FormControl>
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
          'Press "OK" to delete selected project or press "CANCEL" to discard delete operation.'
        }
      />
    </div>
  );
}
