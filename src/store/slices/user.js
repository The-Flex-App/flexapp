import { createSlice, createSelector } from '@reduxjs/toolkit';

export const initialState = {
  loggedInUser: {
    name: '',
    email: '',
    token: '',
  },
};

const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.loggedInUser = payload;
    },
    setWorkspaceMemberList: (state, { payload }) => {
      state.loggedInUser = { ...state.loggedInUser, ...payload };
    },
  },
});

export const { setUser, setWorkspaceMemberList } = usersSlice.actions;

export const userSelector = (state) => state.users.loggedInUser;

export const selectCurrentUserId = createSelector(
  (state) => state.users.loggedInUser,
  ({ id }) => id
);

export const selectCurrentWorkspaceId = createSelector(
  (state) => state.users.loggedInUser,
  ({ workspaceId }) => workspaceId
);

export default usersSlice.reducer;
