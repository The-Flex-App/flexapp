import { createStore } from 'redux';

import reducer from './reducer';
import initialState from './initialState';

const store = createStore(reducer, initialState);

window.store = store;

export default store;
