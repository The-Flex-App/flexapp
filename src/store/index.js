import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projects';
import usersReducer from './slices/user';

export default configureStore({
  reducer: {
    projects: projectReducer,
    users: usersReducer,
  },
});
