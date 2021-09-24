import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import AppWrapper from './AppContext';
//import AppWrapper from './src/screen/Groups/Demo';
import {name as appName} from './app.json';
LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => AppWrapper);
