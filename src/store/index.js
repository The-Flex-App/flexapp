import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/app';
import projectReducer from './slices/projects';
import usersReducer from './slices/user';
import topicReducer from './slices/topics';

export default configureStore({
  reducer: {
    app: appReducer,
    projects: projectReducer,
    users: usersReducer,
    topics: topicReducer,
  },
});
