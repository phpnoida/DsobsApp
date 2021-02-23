/**
 * @format
 */

import {AppRegistry, YellowBox, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// YellowBox.ignoreWarnings([
//   'Non-serializable values were found in the navigation state',
// ]);
LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => App);
