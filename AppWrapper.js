import React, {useEffect} from 'react';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/store';
import App from './App';
import NotifService from './src/helper/NotifService';
let notif;
const AppWrapper = ({navigation}) => {
  useEffect(() => {
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
