import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { makeStyles } from '@material-ui/core/styles';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import AddProject from './AddProject';

import { useQuery } from '@apollo/client';
import { Typography, Grid } from '@material-ui/core';
import { PROJECTS } from '../../graphql/queries';
import {
  selectCurrentWorkspaceId,
  selectIsOwner,
} from '../../store/slices/user';
import Topics from '../topics/Topics';
import { getfinishDateToString } from '../../utils/misc';

const useStyles = makeStyles((theme) => ({
  addProject: {
    marginLeft: theme.spacing(1),
  },
  projectCaptionWrapper: {
    display: 'flex',
    padding: theme.spacing(1),
  },
  projectTitleWrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    color: theme.palette.common.black,

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
    verticalAlign: 'middle',
  },
  dragHandle: {
    width: 40,
    textAlign: 'center',
  },
  projectTitle: {
    flex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    padding: theme.spacing(0, 1),
  },
  finishDate: {
    width: 100,
    padding: theme.spacing(0, 1),
    boxSizing: 'border-box',
  },
  rag: {
    width: 50,
    textAlign: 'center',
  },
  ragIcon: {
    width: 30,
    height: 30,
    lineHeight: '30px',
    display: 'inline-block',
    boxSizing: 'border-box',
    textAlign: 'center',
    borderRadius: 20,
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
  edit: {
    width: 50,
    textAlign: 'center',
  },
  root: {
    padding: 0,
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: '0 auto',
    },
  },
  summaryRoot: {
    padding: theme.spacing(0, 1),
    minHeight: 50,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '&$expanded': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      margin: '0 auto',
      minHeight: 50,
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
  accordionDetailsRoot: {
    display: 'block',
    padding: 0,
    paddingLeft: theme.spacing(4),
  },
}));

function Projects() {
  const classes = useStyles();
  const workspaceId = useSelector(selectCurrentWorkspaceId);
  const isOwner = useSelector(selectIsOwner);
  const { workspaceId: activeWorkspaceId } = useParams();

  const { loading, error, data } = useQuery(PROJECTS, {
    variables: { workspaceId: activeWorkspaceId || workspaceId },
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [editProject, setEditProject] = React.useState(null);

  const handleAddProject = () => {
    setEditProject(null);
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
    switch (rag) {
      case 'R':
        return (
          <div className={classes.rag}>
            <span className={`${classes.ragIcon} ${classes.ragRIcon}`}>R</span>
          </div>
        );
      case 'A':
        return (
          <div className={classes.rag}>
            <span className={`${classes.ragIcon} ${classes.ragAIcon}`}>A</span>
          </div>
        );
      case 'G':
        return (
          <div className={classes.rag}>
            <span className={`${classes.ragIcon} ${classes.ragGIcon}`}>G</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderProject = (project) => {
    const { title, finishDate, rag, id } = project;

    return (
      <Accordion
        key={id}
        classes={{ root: classes.root, expanded: classes.expanded }}
      >
        <AccordionSummary
          classes={{
            root: classes.summaryRoot,
            content: classes.content,
            expanded: classes.expanded,
          }}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography component='div' className={classes.projectTitleWrapper}>
            <div className={classes.dragHandle}>
              <DragHandleIcon className={classes.svgIcon} />
            </div>
            <div className={classes.projectTitle}>{title}</div>
            <div className={classes.finishDate}>
              {getfinishDateToString(finishDate)}
            </div>
            {renderRAG(rag)}
            {isOwner && (
              <div className={classes.edit}>
                <IconButton onClick={(e) => handleEditProject(e, project)}>
                  <SettingsOutlinedIcon className={classes.svgIcon} />
                </IconButton>
              </div>
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
          <Topics projectId={id} />
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderProjects = (data = []) => {
    const length = data.length;

    if (length === 0) {
      return <Typography variant='body2'>No projects found</Typography>;
    }

    return (
      <React.Fragment>
        <Typography variant='body2' className={classes.projectCaptionWrapper}>
          <div className={classes.dragHandle}>&nbsp;</div>
          <div className={classes.projectTitle}>priority</div>
          <div className={classes.finishDate}>finish date</div>
          <div className={classes.rag}>RAG</div>
          {isOwner && <div className={classes.edit}>edit</div>}
        </Typography>
        {data.map((project) => renderProject(project))}
      </React.Fragment>
    );
  };

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <Grid container alignItems='center'>
        <Grid item className='page-title'>
          <Typography variant='h5'>Projects</Typography>
        </Grid>
        {isOwner && (
          <Grid item>
            <IconButton
              aria-label='add'
              color='primary'
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
      {renderProjects(data.projectByWorkspaceId)}
    </>
  );
}

export default Projects;
