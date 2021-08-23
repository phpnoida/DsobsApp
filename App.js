import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  AppState,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';

import grid from './src/theme/grid';
import g from './src/theme/global';
import GlobalInclude from './src/globalInclude/Globalinclude';
import Helper from './src/helper/Helper';
import LogoutAlert from './src/component/LogoutAlert';

import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

import {navigationRef, isReadyRef} from './src/helper/NavigationService';
import {RootNavigators} from './src/route/Route';
import {NavigationContainer} from '@react-navigation/native';

import {sendPresenceStatus} from './src/Actions/CommonActions';
import Offline from './src/component/Offline';

let baseRoute = 'AppTour';
const deviceWidth = Dimensions.get('window').width;
const appVersion = DeviceInfo.getVersion();
let appStateValue = '';

const App = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    SplashScreen.hide();
    global.commentDraft = [];
    global.isLoggedIn = false;
    const unsubscribe = NetInfo.addEventListener(state => {
      global.isConnected = state.isConnected;
      setIsConnected(state.isConnected);
    });
    AppState.addEventListener('change', _handleAppStateChange);

    validateUser(() => {
      NetInfo.fetch()
        .then(state => {
          global.isConnected = state.isConnected;
          setIsConnected(state.isConnected);
        })
        .then(() => {
          setTimeout(() => {
            console.log('appStateValue', appStateValue);
            if (appStateValue === 'active' && global.isLoggedIn) {
              _sendPresenceStatus();
            } else {
              completeLogin();
            }
          }, 300);
        });
    });

    /**
     *
     * Notification start
     *
     */
    if (Platform.OS === 'ios') {
      requestUserPermission();
      PushNotificationIOS.addEventListener('notification', notification => {
        console.log('PushNotificationIOS', notification.getData());
        if (
          notification.getData() !== undefined &&
          notification.getData() !== null
        ) {
          let data = notification.getData();
          let notificationObj = {};
          notificationObj.data = data;
          handleNotification('PushNotificationIOS', notificationObj);
        }
      });
    } else {
      PushNotification.popInitialNotification(notification => {
        console.log('Initial Notification', notification);
        global.notification = notification;
      });
    }
    /**
     *
     * Notification end
     *
     */

    return () => {
      unsubscribe();
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [_handleAppStateChange, _sendPresenceStatus]);

  const _handleAppStateChange = useCallback(nextState => {
    appStateValue = nextState;
    global.nextAppState = nextState;
  }, []);

  const validateUser = callback => {
    AsyncStorage.getItem('loggedIn')
      .then(value => {
        if (value && value !== null && value !== '') {
          if (value === '1') {
            global.isLoggedIn = true;
            baseRoute = 'Dashboard';
          }
        } else {
          global.isLoggedIn = false;
        }
      })
      .then(() => {
        AsyncStorage.getItem('userDetails')
          .then(details => {
            if (details && details !== null && details !== '') {
              var userDetails = JSON.parse(details);
              global.userDetails = userDetails;
              global.userId = userDetails._id;
              global.firstName = userDetails.firstName;
              global.lastName = userDetails.lastName;
            }
          })
          .then(() => {
            AsyncStorage.getItem('tokens').then(details => {
              if (details && details !== null && details !== '') {
                let tokens = JSON.parse(details);
                global.accessToken = tokens.accessToken;
              }
            });
          })
          .then(() => {
            callback();
          });
      });
  };

  const _sendPresenceStatus = useCallback(() => {
    sendPresenceStatus(
      response => {
        completeLogin();
      },
      (statusCode, error) => {
        if (statusCode === 401) {
          let fcmTopic = global.userDetails.fcmTopic;
          AsyncStorage.clear().then(() => {
            global.userDetails = null;
            global.accessToken = null;
            global.userId = null;
            global.firstName = null;
            global.lastName = null;

            PushNotification.unsubscribeFromTopic(fcmTopic).then(() => {
              validateUser(() => {
                completeLogin();
              });
            });
          });
        } else {
          completeLogin();
        }
      },
    );
  }, []);

  const completeLogin = () => {
    setTimeout(() => {
      setLoadingComplete(true);
    }, 1000);
  };

  async function requestUserPermission() {
    PushNotificationIOS.checkPermissions(status => {
      console.log('====================================');
      console.log(status.authorizationStatus);
      console.log('====================================');
    });
  }

  const handleNotification = (from, data) => {
    global.notification = data;
    if (data !== undefined && data !== null) {
      let eventType = data.data.eventType.toString();
      if (eventType && eventType !== null && eventType !== '') {
        if (parseInt(eventType, 10) === 1002) {
          global.notification = null;
        }
      }
    }
    Helper.presentNotification(from, data);
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      {isConnected ? (
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            isReadyRef.current = true;
            global.navigationRef = navigationRef;
          }}>
          {loadingComplete ? (
            RootNavigators(baseRoute)
          ) : (
            <SafeAreaView style={[{flex: 1, backgroundColor: '#eeeeee'}]}>
              <View style={[grid.col]}>
                <View
                  style={[
                    grid.col,
                    grid.justifyContentCenter,
                    grid.alignItems,
                  ]}>
                  <Image
                    source={GlobalInclude.Assets.AppLogo}
                    style={{width: deviceWidth - 170}}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <View style={[]}>
                <View style={[grid.rowrow, grid.justifyContentCenter]}>
                  <Image
                    source={GlobalInclude.Assets.Alumbus}
                    style={{width: 35, height: 35, marginBottom: 5}}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[g.fs11, g.colordarkGray, g.txtCenter]}>
                  Powered by: Alumbus
                </Text>
                <Text style={[g.fs10, g.colorBlack, g.txtCenter, g.pb20]}>
                  Version:{appVersion}
                </Text>
              </View>
            </SafeAreaView>
          )}
        </NavigationContainer>
      ) : (
        <Offline />
      )}

      <LogoutAlert
        ref={ref => (global.logoutAlert = ref)}
        navigation={navigationRef}
      />

      <GlobalInclude.Loader ref={ref => (global.loader_ref = ref)} />
    </View>
  );
};

export default App;
