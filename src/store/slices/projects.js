import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  data: [],
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, { payload }) => {
      state.data = payload;
    },
  },
});

export const { setProjects } = projectSlice.actions;

export const getProjects = (state) => state.projects.data || [];

export const selectNextOrder = (state) => {
  const projects = getProjects(state);
  if (projects.length) {
    const lastProject = projects[projects.length - 1];
    return parseInt(lastProject.order) + 1;
  }
  return 1;
};

export default projectSlice.reducer;
