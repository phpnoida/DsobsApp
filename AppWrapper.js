import React from 'react';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/store';
import App from './App';

const AppWrapper = ({navigation}) => {
  return (
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  );
};

export default AppWrapper;
