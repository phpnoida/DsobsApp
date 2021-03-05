import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducer';

const initialState = {};

const configureStore = () => {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};

const store = configureStore();

export default store;
