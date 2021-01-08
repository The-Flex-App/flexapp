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

export default projectSlice.reducer;
