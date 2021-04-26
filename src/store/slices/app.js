import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  loading: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

export const { setAppLoading } = appSlice.actions;

export const isAppLoading = (state) => state.app.loading;

export default appSlice.reducer;
