import React from 'react';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/store';
import App from './AppWrapper';
//import App from './src/screen/Groups/Demo';

const AppContext = ({navigation}) => {
  return (
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  );
};

export default AppContext;
