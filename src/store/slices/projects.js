import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  selected: '',
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSelectedProject: (state, { payload }) => {
      state.selected = payload;
    },
  },
});

export const { setSelectedProject } = projectSlice.actions;

export const selectCurrentProject = (state) => state.projects.selected || {};

export default projectSlice.reducer;
