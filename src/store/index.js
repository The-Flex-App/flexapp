import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projects';

export default configureStore({
  reducer: {
    projects: projectReducer,
  },
});
