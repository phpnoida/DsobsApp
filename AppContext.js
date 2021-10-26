import React from 'react';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/store';
import App from './AppWrapper';
import {SocketProvider} from './src/helper/contextProvider/SocketProvider';

const AppContext = ({navigation}) => {
  return (
    <StoreProvider store={store}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </StoreProvider>
  );
};

export default AppContext;
