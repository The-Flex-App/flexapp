import { SET_SELECTED_PROJECT } from './types.js';
export const setSelectedProject = (data) => {
  return {
    type: SET_SELECTED_PROJECT,
    payload: data,
  };
};
