import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
	loggedInUser: {
		name: '',
		email: '',
		token: ''
	}
};

const usersSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, { payload }) => {
			state.loggedInUser = payload;
		}
	}
});

export const { setUser } = usersSlice.actions;

export const userSelector = (state) => state.users.loggedInUser;

export default usersSlice.reducer;
