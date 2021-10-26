export const JOIN_SOCKET = 'JOIN_SOCKET';
export const CLEAR_JOIN_SOCKET = 'CLEAR_JOIN_SOCKET';
export const DISCONNECT_SOCKET = 'DISCONNECT_SOCKET';
export const CLEAR_DISCONNECT_SOCKET = 'CLEAR_DISCONNECT_SOCKET';
const initialState = [];

export function joinSocket() {
  return {
    type: JOIN_SOCKET,
    payload: '',
  };
}

export function clearJoinSocket() {
  return {
    type: CLEAR_JOIN_SOCKET,
    payload: '',
  };
}
export function disconnectSocket() {
  return {
    type: DISCONNECT_SOCKET,
    payload: '',
  };
}

export function clearDisconnectSocket() {
  return {
    type: CLEAR_DISCONNECT_SOCKET,
    payload: '',
  };
}

function socketReducer(state = initialState, action) {
  switch (action.type) {
    case JOIN_SOCKET:
      return {...state, joinSocket: true};
    case CLEAR_JOIN_SOCKET:
      return {...state, joinSocket: false};
    case DISCONNECT_SOCKET:
      return {...state, disconnectSocket: true};
    case CLEAR_DISCONNECT_SOCKET:
      return {...state, disconnectSocket: false};
    default:
      return state;
  }
}

export default socketReducer;
