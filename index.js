import React from 'react';
import {AppRegistry, LogBox, Platform} from 'react-native';
import AppWrapper from './AppContext';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import Helper from './src/helper/Helper';
LogBox.ignoreAllLogs();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (remoteMessage) {
    global.notification = remoteMessage;
    // global.isNotificationTap = true;
    if (Platform.OS === 'ios') {
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
