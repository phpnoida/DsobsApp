import React, {useState, useEffect} from 'react';
import {
  View,
  AppState,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
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

let baseRoute = 'AppTour';
const deviceWidth = Dimensions.get('window').width;
const appVersion = DeviceInfo.getVersion();

const App = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currentState, setCurrentState] = useState(AppState.currentState);
  const [isConnected, setIsConnected] = useState(true);

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
          if (currentState === 'active' && global.isLoggedIn) {
            _sendPresenceStatus();
          } else {
            completeLogin();
          }
        });
    }); // we check this as first priority

    return () => {
      unsubscribe();
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [loadingComplete, currentState]);

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
            //baseRoute = 'UserProfile';
            //baseRoute = 'Profile';
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
    console.log('nextState', nextState);
    setCurrentState(nextState);
  };

  const _sendPresenceStatus = () => {
    sendPresenceStatus(
      (response) => {
        completeLogin();
      },
      (statusCode, error) => {
        if (statusCode === 401) {
          AsyncStorage.clear().then(() => {
            validateUser(() => {
              completeLogin();
            });
          });
        } else {
          completeLogin();
        }
      },
    );
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
