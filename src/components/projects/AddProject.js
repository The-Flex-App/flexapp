import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useMutation } from '@apollo/client';
import { ADD_PROJECT } from '../../graphql/mutations';

export default function AddProject(props) {
  const { open, onClose } = props;
  const [newProject, setNewProject] = React.useState(false);

  const [addProject] = useMutation(ADD_PROJECT);
  const [error, setError] = React.useState();

  const handleInputChange = (e) => {
    setNewProject(e.target.value);
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    try {
      await addProject({
        variables: { input: { title: newProject } },
        refetchQueries: ['GetProjects'],
      });
      handleClose();
    } catch (e) {
      setError(e);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
        fullWidth
      >
        <DialogTitle id='form-dialog-title'>Add new project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Project name'
            fullWidth
            onChange={handleInputChange}
            variant='outlined'
            error={error}
            helperText={error && error.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color='primary'
            type='button'
            variant='contained'
          >
            Add Project
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
