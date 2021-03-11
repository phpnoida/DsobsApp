import React, {useState, useEffect} from 'react';
import {
  View,
  AppState,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import {RootNavigators} from './src/route/Route';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import {navigationRef, isReadyRef} from './src/helper/NavigationService';
import AsyncStorage from '@react-native-community/async-storage';
import {sendPresenceStatus} from './src/Actions/CommonActions';
import Offline from './src/component/Offline';
import DeviceInfo from 'react-native-device-info';
import grid from './src/theme/grid';
import g from './src/theme/global';
import GlobalInclude from './src/globalInclude/Globalinclude';
import messaging from '@react-native-firebase/messaging';
import Helper from './src/helper/Helper';
import {useDispatch} from 'react-redux';
import {refreshScreen} from './src/reducer/NotificationReducer';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

let baseRoute = 'AppTour';
const deviceWidth = Dimensions.get('window').width;
const appVersion = DeviceInfo.getVersion();
let appStateValue = '';

const App = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currentState, setCurrentState] = useState(AppState.currentState);
  const [isConnected, setIsConnected] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    SplashScreen.hide();
    global.isLoggedIn = false;
    const unsubscribe = NetInfo.addEventListener((state) => {
      global.isConnected = state.isConnected;
      setIsConnected(state.isConnected);
    });
    AppState.addEventListener('change', _handleAppStateChange);

    validateUser(() => {
      NetInfo.fetch()
        .then((state) => {
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
    }); // we check this as first priority

    /**
     *
     * Notification start
     *
     */

    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener('notification', (notification) => {
        console.log('PushNotificationIOS', notification.getData());
        if (
          notification.getData() !== undefined &&
          notification.getData() !== null
        ) {
          let data = notification.getData();
          let notificationObj = {};
          notificationObj.data = data;
          global.isNotificationTap = false;
          handleNotification('PushNotificationIOS', notificationObj);
        }
      });
    }

    const onMessage = messaging().onMessage(async (remoteMessage) => {
      //global.isNotificationTap = true;
      console.log('83');
      handleNotification('onMessage', remoteMessage);
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('app to open from background state:', remoteMessage);
      global.isNotificationTap = true;
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'app to open from quit state:',
            remoteMessage.notification,
          );
        }
        global.isNotificationTap = true;
      });

    requestUserPermission();

    /**
     *
     * Notification end
     *
     */

    return () => {
      unsubscribe();
      onMessage;
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const completeLogin = () => {
    setTimeout(() => {
      setLoadingComplete(true);
    }, 1000);
  };

  const validateUser = (callback) => {
    AsyncStorage.getItem('loggedIn')
      .then((value) => {
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
          .then((details) => {
            if (details && details !== null && details !== '') {
              var userDetails = JSON.parse(details);
              let tokens = userDetails.tokens;
              global.userDetails = userDetails;
              global.accessToken = tokens.accessToken;
              global.userId = userDetails._id;
              global.firstName = userDetails.firstName;
              global.lastName = userDetails.lastName;
            }
          })
          .then(() => {
            callback();
          });
      });
  };

  const _handleAppStateChange = (nextState) => {
    console.log('170', nextState);
    appStateValue = nextState;
    global.nextAppState = nextState;
    if (global.isLoggedIn) {
      if (Platform.OS === 'android') {
        if (nextState === 'active' && currentState === 'active') {
          if (
            global.notification !== undefined &&
            global.notification !== null
          ) {
            dispatch(refreshScreen());
          }
        }
      } else {
        if (nextState === 'active') {
          if (
            global.notification !== undefined &&
            global.notification !== null
          ) {
            dispatch(refreshScreen());
          }
        }
      }
    }

    setCurrentState(nextState);
  };

  const _sendPresenceStatus = () => {
    sendPresenceStatus(
      (response) => {
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
            messaging()
              .unsubscribeFromTopic(fcmTopic)
              .then(() => {
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
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
    }
  }

  const handleNotification = (from, data) => {
    console.log('currentState', currentState);
    global.notification = data;
    Helper.presentNotification(from, data);
  };

  return (
    <View style={{flex: 1}}>
      {isConnected ? (
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            isReadyRef.current = true;
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
    </View>
  );
};

export default App;
