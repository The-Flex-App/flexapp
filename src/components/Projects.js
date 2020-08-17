import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AddProject from './AddProject';

import { useQuery, gql, useMutation } from '@apollo/client';
import { Typography, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import { setSelectedProject } from '../store/actions.js';

const PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
      description
    }
  }
`;

const ADD_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      id
      title
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Projects({ setSelectedProject }) {
  const classes = useStyles();
  const { loading, error, data: projectsData } = useQuery(PROJECTS);
  const [addProject, { data }] = useMutation(ADD_PROJECT);

  const [openModal, setOpenModal] = React.useState(false);
  const [selection, setSelection] = React.useState(null);

  const handleAddProject = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleConfirm = (value) => {
    addProject({ variables: { input: { title: value } }, refetchQueries: ['GetProjects'] });
    handleClose();
  };

  const handleProjectSelected = (id) => {
    setSelection(id);
    setSelectedProject(id);
  };

  const renderProject = (project) => {
    const { title, id } = project;

    return (
      <>
        <ListItem button onClick={() => handleProjectSelected(id)} selected={id === selection}>
          <ListItemText primary={title} />
        </ListItem>
        <Divider />
      </>
    );
  };

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h5" className={classes.title}>
            Projects
          </Typography>
        </Grid>
        <Grid item>
          <IconButton aria-label="add" color="primary" onClick={handleAddProject}>
            <AddIcon on />
          </IconButton>
        </Grid>
      </Grid>

      <List>{projectsData.projects.map((project) => renderProject(project))}</List>
      <AddProject open={openModal} onClose={handleClose} onConfirm={handleConfirm} />
    </>
  );
}

const mapStateToProps = (state) => {
  return null;
};
export default connect(mapStateToProps, {
  setSelectedProject: setSelectedProject,
})(Projects);
