import React, {useEffect, useCallback} from 'react';
import App from './App';
import NotifService from './src/helper/NotifService';
import firestore from '@react-native-firebase/firestore';
import {authentication} from './src/helper/ChatHelper';
import {useDispatch} from 'react-redux';
import {refreshScreen} from './src/reducer/NotificationReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
let notif;
const AppWrapper = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // async function bootstrap() {
    //   await firestore().settings({
    //     persistence: false, // disable offline persistence
    //   });
    // }

    AsyncStorage.getItem('userDetails').then(details => {
      if (details && details !== null && details !== '') {
        var userDetails = JSON.parse(details);
        global.userDetails = userDetails;
        if (global.userDetails !== undefined && global.userDetails !== null) {
          authentication(() => {
            //bootstrap();
          });
        }
      }
    });
    return () => {};
  }, []);

  useEffect(() => {
    notif = new NotifService(onRegister, onNotif);
    return () => {
      notif;
    };
  }, [onNotif]);

  const onRegister = token => {
    console.log('token.token', token.token);
  };

  const onNotif = useCallback(
    notification => {
      console.log('====================================');
      console.log('onNotif-AppWrapper-48', notification);
      console.log('====================================');
      if (notification && notification !== undefined && notification !== null) {
        if (notification.userInteraction) {
          global.notification = notification;
          setTimeout(() => {
            dispatch(refreshScreen());
          }, 100);
        }
      }
    },
    [dispatch],
  );

  return <App />;
};

export default AppWrapper;
