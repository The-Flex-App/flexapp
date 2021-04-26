import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  selected: '',
};

const topicSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    setSelectedTopic: (state, { payload }) => {
      state.selected = payload;
    },
  },
});

export const { setSelectedTopic } = topicSlice.actions;

export const selectCurrentTopic = (state) => state.topics.selected || {};

export default topicSlice.reducer;
