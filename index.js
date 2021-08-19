/**
 * @format
 */

import React from 'react';
import {AppRegistry, LogBox, Platform} from 'react-native';
import AppWrapper from './AppWrapper';
//import AppWrapper from './src/ImageDemo';
import messaging from '@react-native-firebase/messaging';
import {name as appName} from './app.json';
import Helper from './src/helper/Helper';
LogBox.ignoreAllLogs();

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (remoteMessage) {
    global.notification = remoteMessage;
    global.isNotificationTap = true;
    if (remoteMessage !== undefined && remoteMessage !== null) {
      let eventType = remoteMessage.data.eventType.toString();
      if (eventType && eventType !== null && eventType !== '') {
        if (parseInt(eventType, 10) === 1002) {
          global.notification = null;
          global.isNotificationTap = false;
        }
      }
    }

    if (Platform.OS === 'android') {
      let duplicateClone = remoteMessage;
      delete duplicateClone.notification;
      Helper.presentNotification('background-16-android', duplicateClone);
    } else {
      Helper.presentNotification('background-16', remoteMessage);
    }
  }
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <AppWrapper />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
