import { combineReducers } from 'redux';

import { SET_SELECTED_PROJECT } from './types.js';

function appSettings(state = {}, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_SELECTED_PROJECT:
      return {
        ...state,
        selectedProject: payload,
      };
    default:
      return state;
  }
}

const reducer = combineReducers({
  appSettings,
});

export default reducer;
