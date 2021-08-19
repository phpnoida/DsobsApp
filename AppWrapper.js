import React, {useEffect} from 'react';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/store';
import App from './App';
import NotifService from './src/helper/NotifService';
import firestore from '@react-native-firebase/firestore';
let notif;
const AppWrapper = ({navigation}) => {
  useEffect(() => {
    async function bootstrap() {
      await firestore().settings({
        persistence: false, // disable offline persistence
      });
    }
    // firestore()
    //   .clearPersistence()
    //   .catch((error) => {
    //     console.error('Could not enable persistence:', error.code);
    //   });
    bootstrap();
    notif = new NotifService();
    return () => {};
  }, []);
  return (
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  );
};

export default AppWrapper;
