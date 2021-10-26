import {combineReducers} from 'redux';

import Notification from './NotificationReducer';
import GroupReducer from './GroupReducer';
import SocketReducer from './SocketReducer';

export default combineReducers({
  notification: Notification,
  group: GroupReducer,
  socket: SocketReducer,
});
