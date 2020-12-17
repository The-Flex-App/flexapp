import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AddProject from './AddProject';

import { useQuery } from '@apollo/client';
import { Typography, Grid } from '@material-ui/core';
import { setSelectedProject } from '../../store/slices/projects';
import { PROJECTS } from '../../graphql/queries';
import { selectCurrentWorkspaceId } from '../../store/slices/user';

function Projects() {
  const workspaceId = useSelector(selectCurrentWorkspaceId);
  const { workspaceId: activeWorkspaceId } = useParams();
  const { dispatch } = useDispatch();

  const { loading, error, data } = useQuery(PROJECTS, {
    variables: { workspaceId: activeWorkspaceId || workspaceId },
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [selection, setSelection] = React.useState(null);

  const handleAddProject = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleConfirm = (value) => {
    //addProject({ variables: { input: { title: value } }, refetchQueries: ['GetProjects'] });
    handleClose();
  };

  const handleProjectSelected = (project) => {
    setSelection(project.id);
    dispatch(setSelectedProject(project));
  };

  const renderProject = (project) => {
    const { title, id } = project;

    return (
      <React.Fragment key={id}>
        <ListItem
          button
          onClick={() => handleProjectSelected(project)}
          selected={id === selection}
        >
          <ListItemText primary={title} />
        </ListItem>
        <Divider />
      </React.Fragment>
    );
  };

  const renderProjects = (data = []) => {
    const length = data.length;

    if (length === 0) {
      return <Typography variant='body2'>No projects found</Typography>;
    }

    return <List>{data.map((project) => renderProject(project))}</List>;
  };

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <Grid container alignItems='center'>
        <Grid item className='page-title'>
          <Typography variant='h5'>Projects</Typography>
        </Grid>
        <Grid item>
          <IconButton
            aria-label='add'
            color='primary'
            onClick={handleAddProject}
          >
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>

      {renderProjects(data.projectByWorkspaceId)}
      <AddProject
        open={openModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default Projects;
