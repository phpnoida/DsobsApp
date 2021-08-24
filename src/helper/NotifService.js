import PushNotification from 'react-native-push-notification';
import NotificationHandler from './NotificationHandler';
import {APP_NAME} from './Constants';

export default class NotifService {
  constructor(onRegister, onNotification) {
    this.lastId = 0;
    this.lastChannelCounter = 0;

    this.createDefaultChannels();

    NotificationHandler.attachRegister(onRegister);
    NotificationHandler.attachNotification(onNotification);

    // Clear badge number at start
    PushNotification.getApplicationIconBadgeNumber(function (number) {
      if (number > 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });
  }

  // constructor() {
  //   this.createDefaultChannels();
  // }

  createDefaultChannels() {
    PushNotification.createChannel(
      {
        channelId: APP_NAME,
        channelName: APP_NAME,
        channelDescription: 'A default channel for application',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      created => {},
    );
  }

  createOrUpdateChannel() {
    this.lastChannelCounter++;
    PushNotification.createChannel(
      {
        channelId: APP_NAME,
        channelName: APP_NAME,
        channelDescription: `A custom channel to categorise your custom notifications. Updated at: ${Date.now()}`,
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created => {},
    );
  }

  popInitialNotification() {
    PushNotification.popInitialNotification(notification =>
      console.log('InitialNotication:', notification),
    );
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  requestPermissions() {
    return PushNotification.requestPermissions();
  }

  cancelNotif() {
    PushNotification.cancelLocalNotifications({id: '' + this.lastId});
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }

  abandonPermissions() {
    PushNotification.abandonPermissions();
  }

  getScheduledLocalNotifications(callback) {
    PushNotification.getScheduledLocalNotifications(callback);
  }

  getDeliveredNotifications(callback) {
    PushNotification.getDeliveredNotifications(callback);
  }
}
