export const REFRESH_GROUPS = 'REFRESH_GROUPS';
export const CLEAR_REFRESH_GROUPS = 'CLEAR_REFRESH_GROUPS';
export const REFRESH_SCREEN = 'REFRESH_SCREEN';
export const CLEAR_REFRESH_SCREEN = 'CLEAR_REFRESH_SCREEN';
const initialState = [];

export function refreshGroups() {
  return {
    type: REFRESH_GROUPS,
    payload: '',
  };
}

export function clearRefreshGroups() {
  return {
    type: CLEAR_REFRESH_GROUPS,
    payload: '',
  };
}
export function refreshScreen() {
  return {
    type: REFRESH_SCREEN,
    payload: '',
  };
}

export function clearRefreshScreen() {
  return {
    type: CLEAR_REFRESH_SCREEN,
    payload: '',
  };
}

function notesReducer(state = initialState, action) {
  switch (action.type) {
    case REFRESH_GROUPS:
      return {...state, refreshGroup: true};
    case CLEAR_REFRESH_GROUPS:
      return {...state, refreshGroup: false};
    case REFRESH_SCREEN:
      return {...state, refreshScreen: true};
    case CLEAR_REFRESH_SCREEN:
      return {...state, refreshScreen: false};
    default:
      return state;
  }
}

export default notesReducer;
