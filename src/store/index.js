import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projects';
import usersReducer from './slices/user';
import topicReducer from './slices/topics';

export default configureStore({
  reducer: {
    projects: projectReducer,
    users: usersReducer,
    topics: topicReducer,
  },
});
