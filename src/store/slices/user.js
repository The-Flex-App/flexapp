import { createSlice } from '@reduxjs/toolkit';

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
      const { attributes, username } = payload;
      const { name, given_name, family_name, email } = attributes;
      state.loggedInUser = { username, name, given_name, family_name, email };
    },
  },
});

export const { setUser } = usersSlice.actions;

export const userSelector = (state) => state.users.loggedInUser;

export default usersSlice.reducer;
