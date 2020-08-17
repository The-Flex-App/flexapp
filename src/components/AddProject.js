import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AddProject(props) {
  const { open, onClose, onConfirm } = props;
  const [newProject, setNewProject] = React.useState(false);

  const handleInputChange = (e) => {
    setNewProject(e.target.value);
  };

  const handleConfirm = () => {
    onConfirm(newProject);
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add new project</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the project name</DialogContentText>
          <TextField autoFocus margin="dense" id="name" label="Project name" fullWidth onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" type="button">
            Add Project
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
