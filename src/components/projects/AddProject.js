import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
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
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/client';
import {
  ADD_PROJECT,
  EDIT_PROJECT,
  DELETE_PROJECT,
} from '../../graphql/mutations';
import {
  selectCurrentWorkspaceId,
  selectCurrentUserId,
} from '../../store/slices/user';
import { selectNextOrder } from '../../store/slices/projects';
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
      fontSize: 25,
    },
  },
  formControl: {},
  yellowRadioButton: {
    color: '#fac710',
    '& svg': {
      fontSize: 25,
    },
  },
  greenRadioButton: {
    color: '#0ca789',
    '& svg': {
      fontSize: 25,
    },
  },
}));

export default function AddProject(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { open, onClose, selectedProject } = props;
  const workspaceId = useSelector(selectCurrentWorkspaceId);
  const userId = useSelector(selectCurrentUserId);
  const nextOrder = useSelector(selectNextOrder);
  const { projectId: activeProjectId } = useSelector(selectCurrentTopic);
  const { workspaceId: activeWorkspaceId } = useParams();
  const [isEditMode, setEditMode] = React.useState(!!selectedProject);
  const [isDirty, setDirty] = React.useState(false);
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [projectTitle, setProjectTitle] = React.useState(
    selectedProject && selectedProject.title
  );
  const [projectPeriod, setProjectPeriod] = React.useState(
    selectedProject && selectedProject.period
  );
  const [projectRag, setProjectRAG] = React.useState(
    selectedProject && selectedProject.rag
  );

  useEffect(() => {
    if (open) {
      if (selectedProject) {
        setEditMode(true);
        setProjectTitle(selectedProject.title);
        setProjectPeriod(selectedProject.period);
        setProjectRAG(selectedProject.rag);
      } else {
        setEditMode(false);
        setProjectTitle(undefined);
        setProjectPeriod(undefined);
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
    return !(projectTitle && projectPeriod && projectRag);
  };

  const handleNameChange = (e) => {
    setProjectTitle(e.target.value);
    setDirty(true);
  };

  const handlePeriodChange = (e) => {
    setProjectPeriod(e.target.value);
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
              period: projectPeriod,
              title: projectTitle,
              order: selectedProject.order,
              workspaceId: activeWorkspaceId || workspaceId,
              userId: selectedProject.userId,
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
              period: projectPeriod,
              workspaceId: activeWorkspaceId || workspaceId,
              userId,
              order: nextOrder,
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
        maxWidth='xs'
      >
        <DialogTitle
          id='form-dialog-title'
          disableTypography
          classes={{ root: classes.dialogTitle }}
        >
          <Typography variant='h6' component='h2'>
            {isEditMode ? 'Edit goal' : 'Add new goal'}
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
            label='Goal name'
            fullWidth
            value={projectTitle || ''}
            onChange={handleNameChange}
            variant='outlined'
          />
          <FormControl fullWidth margin='dense' className={classes.formControl}>
            <InputLabel htmlFor='period' variant='outlined'>
              Period
            </InputLabel>
            <Select
              id='period'
              value={projectPeriod}
              onChange={handlePeriodChange}
              label='Period'
              fullWidth
              variant='outlined'
              margin='dense'
            >
              <MenuItem value={'Q1'}>Q1</MenuItem>
              <MenuItem value={'Q2'}>Q2</MenuItem>
              <MenuItem value={'Q3'}>Q3</MenuItem>
              <MenuItem value={'Q4'}>Q4</MenuItem>
            </Select>
          </FormControl>
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
          {error && (
            <FormControl error={!!error}>
              <FormHelperText>{error && error.message}</FormHelperText>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
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
          'Press "OK" to delete selected goal or press "CANCEL" to discard delete operation.'
        }
      />
    </div>
  );
}
