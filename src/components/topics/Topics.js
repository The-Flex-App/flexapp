import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircleOutline';
import { makeStyles } from '@material-ui/core/styles';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import Typography from '@material-ui/core/Typography';

import AddTopic from './AddTopic';
import {
  setSelectedTopic,
  selectCurrentTopic,
} from '../../store/slices/topics';
import { selectIsOwner } from '../../store/slices/user';

const useStyles = makeStyles((theme) => ({
  noTopicsFound: {
    padding: theme.spacing(0, 0.5),
    marginLeft: 25,
    height: 30,
    display: 'flex',
    alignItems: 'center',
  },
  addTopicButton: {
    padding: theme.spacing(0.25),
  },
  addTopicWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 25,
    padding: theme.spacing(0, 0.5),
    height: 30,
  },
  addTopicTypo: {
    flex: 1,
    fontSize: 13,
  },
  topicTitleWrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    height: 30,
  },
  topicTitle: {
    flex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  svgIcon: {
    fontSize: 15,
  },
  listItem: {
    padding: '0 4px 0 29px',
  },
  editButton: {
    padding: 4,
    marginLeft: theme.spacing(1),
  },
}));

function Topics(props) {
  const classes = useStyles();
  const isOwner = useSelector(selectIsOwner);
  const selectedTopic = useSelector(selectCurrentTopic);
  const { projectId, topics } = props;
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = React.useState(false);
  const [editTopic, setEditTopic] = React.useState(null);

  const handleAddTopic = () => {
    setOpenModal(true);
  };

  const handleEditTopic = (event, topic) => {
    event.stopPropagation();
    setEditTopic(topic);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setEditTopic(null);
  };

  const handleConfirm = (value) => {
    handleClose();
  };

  const handleTopicSelected = (topic) => {
    dispatch(
      setSelectedTopic({ ...topic, projectId: parseInt(projectId, 10) })
    );
  };

  const renderTopic = (topic) => {
    const { title, id } = topic;

    return (
      <React.Fragment key={id}>
        <ListItem
          button
          onClick={() => handleTopicSelected(topic)}
          selected={id === selectedTopic.id}
          className={classes.listItem}
        >
          <Typography component='div' className={classes.topicTitleWrapper}>
            <div className={classes.topicTitle}>{title}</div>
            {isOwner && (
              <IconButton
                className={classes.editButton}
                onClick={(e) => handleEditTopic(e, topic)}
              >
                <SettingsOutlinedIcon className={classes.svgIcon} />
              </IconButton>
            )}
          </Typography>
        </ListItem>
      </React.Fragment>
    );
  };

  const renderTopics = (data = []) => {
    const length = data.length;

    if (length === 0) {
      return (
        <Typography
          variant='body2'
          component='em'
          className={classes.noTopicsFound}
        >
          No activities found
        </Typography>
      );
    }

    return (
      <List disablePadding>{data.map((topic) => renderTopic(topic))}</List>
    );
  };

  return (
    <>
      {renderTopics(topics || [])}
      {isOwner && (
        <React.Fragment>
          <Typography component='div' className={classes.addTopicWrapper}>
            <Typography component='span' className={classes.addTopicTypo}>
              Add activity
            </Typography>
            <IconButton
              aria-label='add'
              onClick={handleAddTopic}
              className={classes.addTopicButton}
            >
              <AddCircleIcon />
            </IconButton>
          </Typography>
          <AddTopic
            projectId={parseInt(projectId, 10)}
            selectedTopic={editTopic}
            open={openModal}
            onClose={handleClose}
            onConfirm={handleConfirm}
          />
        </React.Fragment>
      )}
    </>
  );
}

export default Topics;
