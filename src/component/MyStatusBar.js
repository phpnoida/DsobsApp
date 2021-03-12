import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

//hidden={Platform.OS === 'ios' ? true : false}
const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: Platform.OS === 'android' ? 0 : 0,
    backgroundColor: '#fff',
  },
});

export default MyStatusBar;
