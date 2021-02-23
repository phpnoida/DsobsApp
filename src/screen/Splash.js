import React, {useEffect} from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import * as RootNavigation from '../helper/NavigationService';

import {scale} from '../theme/Scalling';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      RootNavigation.navigate('Login', {});
    }, 1000);
  }, []);

  return <View />;
};

export default Splash;
