import {combineReducers} from 'redux';

import Notification from './NotificationReducer';
import GroupReducer from './GroupReducer';

export default combineReducers({
  notification: Notification,
  group: GroupReducer,
});
