import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  scrollPaper: {
    alignItems: 'flex-start',
  },
  paperScrollPaper: {
    width: '100%',
    margin: 0,
    maxWidth: 450,
  },
  dialogTitleRoot: {
    marginBottom: theme.spacing(1),
  },
  dialogActionsRoot: {
    marginTop: theme.spacing(1),
  },
}));

const ConfirmationDialog = (props) => {
  const classes = useStyles();
  const {
    title = 'Are you sure?',
    description = 'Press "Ok" to continue or press "Cancel" to close.',
    onClose,
    open,
    ...other
  } = props;

  const handleCancel = () => {
    onClose(false);
  };

  const handleOk = () => {
    onClose(true);
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      classes={{
        scrollPaper: classes.scrollPaper,
        paperScrollPaper: classes.paperScrollPaper,
      }}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title" classes={{ root: classes.dialogTitleRoot }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions classes={{ root: classes.dialogActionsRoot }}>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
