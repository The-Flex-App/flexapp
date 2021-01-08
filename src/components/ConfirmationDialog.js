import React from 'react';
import PropTypes from 'prop-types';
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
  },
  dialogTitleRoot: {
    padding: theme.spacing(0, 0, 1),
  },
  dialogActionsRoot: {
    padding: theme.spacing(1, 0, 0),
  },
  dialogContentRoot: {
    padding: theme.spacing(1, 0),
  },
}));

const ConfirmationDialog = (props) => {
  const classes = useStyles();
  const { title, description, onClose, open, ...other } = props;

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
      maxWidth='xs'
      aria-labelledby='confirmation-dialog-title'
      open={open}
      classes={{
        scrollPaper: classes.scrollPaper,
        paperScrollPaper: classes.paperScrollPaper,
      }}
      {...other}
    >
      <DialogTitle
        id='confirmation-dialog-title'
        classes={{ root: classes.dialogTitleRoot }}
      >
        {title}
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogContentRoot }}>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions classes={{ root: classes.dialogActionsRoot }}>
        <Button autoFocus onClick={handleCancel} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleOk} color='primary'>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  description: PropTypes.node,
};

ConfirmationDialog.defaultProps = {
  title: 'Are you sure?',
  description: 'Press "Ok" to continue or press "Cancel" to close.',
};

export default ConfirmationDialog;
