import {useReducer} from 'react';

export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLEAR_RESULT = 'CLEAR_RESULT';
export const UPDATE_IMAGES = 'UPDATE_IMAGES';
export const CLEAR_IMAGE_UPDATE = 'CLEAR_IMAGE_UPDATE';

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

export function updateImage(requestData) {
  return {
    type: UPDATE_IMAGES,
    payload: requestData,
  };
}
export function clearUpdateImage() {
  return {
    type: CLEAR_IMAGE_UPDATE,
    payload: '',
  };
}

function notesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATION:
      return {...state, refresh: true};
    case CLEAR_RESULT:
      return {...state, refresh: false};
    case UPDATE_IMAGES:
      return {...state, update: true, eventData: action.payload};
    case CLEAR_IMAGE_UPDATE:
      return {...state, update: false};
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
