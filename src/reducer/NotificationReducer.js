import {useReducer} from 'react';

export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLEAR_RESULT = 'CLEAR_RESULT';

const initialState = [];

export function refreshScreen() {
  return {
    type: SET_NOTIFICATION,
    payload: '',
  };
}
export function clearState() {
  return {
    type: CLEAR_RESULT,
    payload: '',
  };
}

function notesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATION:
      return {...state, refresh: true};
    case CLEAR_RESULT:
      return {...state, refresh: false};
    default:
      return state;
  }
}

export default notesReducer;

// export function useApiCallReducer() {
//   function reducer(state, action) {
//     console.log('prevState: ', state);
//     console.log('action: ', action);
//     switch (action.type) {
//       case SET_NOTIFICATION:
//         return {
//           ...state,
//           status: true,
//         };
//       case CLEAR_RESULT:
//         return {
//           ...state,
//         };
//       default:
//         return state;
//     }
//   }
//   return useReducer(reducer, initialState);
// }
