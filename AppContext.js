import React from 'react';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/store';
import App from './AppWrapper';

const AppContext = ({navigation}) => {
  return (
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  );
};

export default AppContext;
