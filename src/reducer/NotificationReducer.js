export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';
export const CLEAR_RESULT = 'CLEAR_RESULT';
export const UPDATE_IMAGES = 'UPDATE_IMAGES';
export const CLEAR_IMAGE_UPDATE = 'CLEAR_IMAGE_UPDATE';
export const INCREASE_COMMENT = 'INCREASE_COMMENT';
export const CLEAR_INCREASE_COMMENT = 'CLEAR_INCREASE_COMMENT';
export const REFRESH_PREVIOUS_SCREEN = 'REFRESH_PREVIOUS_SCREEN';
export const CLEAR_REFRESH_PREVIOUS = 'CLEAR_REFRESH_PREVIOUS';
const initialState = [];

export function refreshScreen() {
  return {
    type: SET_NOTIFICATION,
    payload: '',
  };
}
export function clearNotifications() {
  return {
    type: CLEAR_NOTIFICATION,
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

export function increaseComment(requestData) {
  return {
    type: INCREASE_COMMENT,
    payload: requestData,
  };
}

export function clearIncreaseComment() {
  return {
    type: CLEAR_INCREASE_COMMENT,
    payload: '',
  };
}

export function refreshPreviousScreen() {
  return {
    type: REFRESH_PREVIOUS_SCREEN,
    payload: '',
  };
}

export function clearRefreshPrevious() {
  return {
    type: CLEAR_REFRESH_PREVIOUS,
    payload: '',
  };
}

function notesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATION:
      return {...state, refresh: true};
    case CLEAR_NOTIFICATION:
      return {...state, refresh: false};
    case CLEAR_RESULT:
      return {...state};
    case UPDATE_IMAGES:
      return {...state, update: true, eventData: action.payload};
    case CLEAR_IMAGE_UPDATE:
      return {...state, update: false};
    case INCREASE_COMMENT:
      return {...state, commentUpdate: true, commentData: action.payload};
    case CLEAR_INCREASE_COMMENT:
      return {...state, commentUpdate: false};
    case REFRESH_PREVIOUS_SCREEN:
      return {...state, refreshPrevious: true};
    case CLEAR_REFRESH_PREVIOUS:
      return {...state};
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
