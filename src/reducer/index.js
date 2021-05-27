import {combineReducers} from 'redux';

import Notification from './NotificationReducer';

export default combineReducers({
  notification: Notification,
});
