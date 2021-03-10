import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircleOutline';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { makeStyles } from '@material-ui/core/styles';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useQuery, useMutation } from '@apollo/client';
import AddProject from './AddProject';
import { REARRANGE_PROJECT } from '../../graphql/mutations';
import { PROJECTS } from '../../graphql/queries';
import {
  selectCurrentWorkspaceId,
  selectIsOwner,
} from '../../store/slices/user';
import { getProjects } from '../../store/slices/projects';
import Topics from '../topics/Topics';
import { setProjects } from '../../store/slices/projects';
import {
  selectCurrentTopic,
  setSelectedTopic,
} from '../../store/slices/topics';
import { setAppLoading } from '../../store/slices/app';

const useStyles = makeStyles((theme) => ({
  projectsWrapper: {
    borderRight: `1px solid rgba(0, 0, 0, 0.12)`,
    overflow: 'auto',
    minHeight: `calc(100vh - 135px)`,
    padding: theme.spacing(3, 1, 3, 2),
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    minWidth: 300,
  },
  noGoalFound: {
    padding: theme.spacing(0, 0.5),
    height: 25,
    display: 'flex',
    alignItems: 'center',
  },
  projectHeadingWrap: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
    padding: 0,
  },
  projectHeading: {
    marginLeft: 25,
  },
  addProject: {
    color: theme.palette.common.white,
    padding: theme.spacing(0.25),
  },
  projectCaptionWrapper: {
    display: 'flex',
    padding: 0,
  },
  projectTitleWrapper: {
    display: 'flex',
    width: '100%',
    height: 28,
    alignItems: 'center',
    padding: 0,

    '& $ragIcon': {
      fontSize: '80%',
    },

    '& $finishDate': {
      fontWeight: 'bold',
    },

    '& $projectTitle': {
      fontWeight: 'bold',
    },
  },
  svgIcon: {
    fontSize: 15,
  },
  dragHandle: {
    width: 25,
  },
  projectTitle: {
    flex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  ragIcon: {
    width: 15,
    height: 15,
    lineHeight: 28,
    borderRadius: 10,
    '&+button': {
      marginLeft: 6,
    },
  },
  ragRIcon: {
    backgroundColor: 'red',
  },
  ragAIcon: {
    backgroundColor: '#fac710',
  },
  ragGIcon: {
    backgroundColor: '#0ca789',
    color: theme.palette.common.white,
  },

  root: {
    padding: 0,
    boxShadow: 'none',
    background: 'transparent',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: '0 auto',
    },
  },
  summaryRoot: {
    minHeight: 25,
    '&$expanded': {
      margin: '0 auto',
      minHeight: 25,
    },
  },
  content: {
    margin: '0 auto',
    width: '100%',
    '&$expanded': {
      margin: '0 auto',
    },
  },
  expanded: {
    margin: '0 auto',
  },
  settingsIcon: {
    padding: 0,
  },
  accordionDetailsRoot: {
    display: 'block',
    padding: 0,
  },
  droppableArea: {
    minHeight: `calc(100% - 40px)`,
  },
}));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function Projects() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const workspaceId = useSelector(selectCurrentWorkspaceId);
  const isOwner = useSelector(selectIsOwner);
  const { projectId: activeProjectId } = useSelector(selectCurrentTopic);
  const projectsData = useSelector(getProjects);
  const { workspaceId: activeWorkspaceId } = useParams();
  const [reArrangeProjects] = useMutation(REARRANGE_PROJECT);
  const { loading, error, data } = useQuery(PROJECTS, {
    variables: { workspaceId: activeWorkspaceId || workspaceId },
  });

  useEffect(() => {
    data && dispatch(setProjects(data.projectByWorkspaceId));
  }, [data, dispatch]);

  const [openModal, setOpenModal] = React.useState(false);
  const [editProject, setEditProject] = React.useState(null);

  const handleAddProject = () => {
    setOpenModal(true);
  };

  const handleEditProject = (event, project) => {
    event.stopPropagation();
    setEditProject(project);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setEditProject(null);
  };

  const handleConfirm = (value) => {
    handleClose();
  };

  const renderRAG = (rag) => {
    const ragClassName =
      rag === 'R'
        ? classes.ragRIcon
        : rag === 'A'
        ? classes.ragAIcon
        : rag === 'G'
        ? classes.ragGIcon
        : null;

    return <div className={`${classes.ragIcon} ${ragClassName} rag-icon`} />;
  };

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    dispatch(setAppLoading(true));

    const orderedProjects = reorder(
      projectsData,
      result.source.index,
      result.destination.index
    );

    dispatch(setProjects(orderedProjects));

    const projectIds = orderedProjects.map((p) => parseInt(p.id));
    await reArrangeProjects({
      variables: {
        input: {
          projects: projectIds,
          workspaceId: activeWorkspaceId || workspaceId,
        },
      },
      refetchQueries: ['GetProjects'],
    });
    dispatch(setAppLoading(false));
  };

  const renderProject = (project, index) => {
    const { title, rag, id, topics, period } = project;

    const handleAccordionChange = (e, expanded) => {
      if (
        expanded &&
        activeProjectId !== parseInt(id, 10) &&
        topics &&
        topics[0]
      ) {
        dispatch(
          setSelectedTopic({ ...topics[0], projectId: parseInt(id, 10) })
        );
      }
    };

    return (
      <Draggable draggableId={id} index={index} key={id}>
        {(provided) => (
          <Accordion
            key={id}
            classes={{ root: classes.root, expanded: classes.expanded }}
            ref={provided.innerRef}
            {...provided.draggableProps}
            onChange={handleAccordionChange}
          >
            <AccordionSummary
              classes={{
                root: classes.summaryRoot,
                content: classes.content,
                expanded: classes.expanded,
              }}
              className={
                activeProjectId === parseInt(id, 10) ? classes.expanded : ''
              }
              aria-controls='panel1a-content'
              id='panel1a-header'
              {...provided.dragHandleProps}
            >
              <Typography
                component='div'
                className={classes.projectTitleWrapper}
              >
                <div className={classes.dragHandle}>{period}</div>
                <div className={classes.projectTitle}>{title}</div>
                {renderRAG(rag)}
                {isOwner && (
                  <IconButton
                    className={classes.settingsIcon}
                    onClick={(e) => handleEditProject(e, project)}
                  >
                    <SettingsOutlinedIcon className={classes.svgIcon} />
                  </IconButton>
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
              <Topics projectId={id} topics={topics} />
            </AccordionDetails>
          </Accordion>
        )}
      </Draggable>
    );
  };

  const renderProjects = (data = []) => {
    const length = data.length;

    if (length === 0) {
      return (
        <Typography
          variant='body2'
          className={classes.noGoalFound}
          component='em'
        >
          No goals found
        </Typography>
      );
    }

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='list'>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classes.droppableArea}
            >
              {data.map((project, index) => renderProject(project, index))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <Grid container className={classes.projectHeadingWrap}>
        <Grid item className='page-title'>
          <Typography className={classes.projectHeading} variant='subtitle1'>
            Goals
          </Typography>
        </Grid>
        {isOwner && (
          <Grid item>
            <IconButton
              aria-label='add'
              onClick={handleAddProject}
              className={classes.addProject}
            >
              <AddCircleIcon />
            </IconButton>
            <AddProject
              selectedProject={editProject}
              open={openModal}
              onClose={handleClose}
              onConfirm={handleConfirm}
            />
          </Grid>
        )}
      </Grid>
      {renderProjects(projectsData)}
    </>
  );
}

export default Projects;
