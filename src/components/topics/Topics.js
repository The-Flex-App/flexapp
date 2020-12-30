import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import AddTopic from './AddTopic';

import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import { setSelectedTopic } from '../../store/slices/topics';
import { TOPICS } from '../../graphql/queries';
import { selectIsOwner } from '../../store/slices/user';

const useStyles = makeStyles((theme) => ({
  noTopicsFound: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  addTopicButton: {
    width: 50,
    textAlign: 'center',
    marginRight: theme.spacing(1),
  },
  addTopicTypo: {
    color: theme.palette.common.black,
    marginRight: theme.spacing(1),
  },
  topicTitleWrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    color: theme.palette.common.black,
  },
  topicTitle: {
    flex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  svgIcon: {
    verticalAlign: 'middle',
  },
  dragHandle: {
    width: 40,
    textAlign: 'center',
  },
  listItem: {
    height: 50,
    padding: theme.spacing(0, 1),
  },
  editTopic: {
    width: 50,
    textAlign: 'center',
  },
}));

function Topics(props) {
  const classes = useStyles();
  const isOwner = useSelector(selectIsOwner);
  const { projectId } = props;
  const dispatch = useDispatch();

  const { loading, error, data } = useQuery(TOPICS, {
    variables: { projectId: parseInt(projectId, 10) },
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [selection, setSelection] = React.useState(null);
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
    setSelection(topic.id);
    dispatch(
      setSelectedTopic({ ...topic, projectId: parseInt(projectId, 10) }),
    );
  };

  const renderTopic = (topic) => {
    const { title, id } = topic;

    return (
      <React.Fragment key={id}>
        <ListItem
          button
          onClick={() => handleTopicSelected(topic)}
          selected={id === selection}
          className={classes.listItem}
        >
          <Typography component='div' className={classes.topicTitleWrapper}>
            <div className={classes.dragHandle}>
              <DragHandleIcon className={classes.svgIcon} />
            </div>
            <div className={classes.topicTitle}>{title}</div>
            {isOwner && (
              <div className={classes.editTopic}>
                <IconButton onClick={(e) => handleEditTopic(e, topic)}>
                  <SettingsOutlinedIcon className={classes.svgIcon} />
                </IconButton>
              </div>
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
        <Typography variant='body2' className={classes.noTopicsFound}>
          No topics found
        </Typography>
      );
    }

    return (
      <List disablePadding>{data.map((topic) => renderTopic(topic))}</List>
    );
  };

  if (loading) return 'Loading...';

  return (
    <>
      {error ? (
        <Typography color={'secondary'}>Error! {error.message}</Typography>
      ) : (
        renderTopics(data.topicsByProjectId)
      )}
      {isOwner && (
        <React.Fragment>
          <Typography component='div' align={'right'}>
            <Typography component='span' className={classes.addTopicTypo}>
              Add topic
            </Typography>
            <IconButton
              aria-label='add'
              color='primary'
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
