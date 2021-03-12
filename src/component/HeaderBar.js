import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {scale} from '../theme/Scalling';
import g from '../theme/global';

const HeaderBar = ({title, navigation}) => {
  return (
    <View
      style={{
        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
      }}>
      <View style={headerStyle.topContainer} />
      <View style={headerStyle.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={GlobalInclude.Assets.Back} style={headerStyle.back} />
        </TouchableOpacity>
        {title && (
          <View style={GlobalInclude.AppStyle.fillCenter}>
            <Text style={[g.fs16, g.FHNB, g.colordarkGray, g.txtCenter]}>
              {title}
            </Text>
          </View>
        )}
      </View>
      <View style={headerStyle.shadowView} />
    </View>
  );
};

const headerStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: scale(50),
    backgroundColor: 'white',
    paddingStart: scale(15),
    paddingEnd: scale(15),
    alignContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  shadowView: {
    backgroundColor: 'white',
    elevation: 6,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    height: 0,
    marginTop: Platform.OS === 'android' ? scale(-6) : 2,
  },
  backIcon: {
    height: scale(23),
    width: scale(23),
    justifyContent: 'center',
    marginStart: scale(15),
  },
  titleContainer: {
    flex: 1,
    marginStart: scale(10),
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  back: {
    width: scale(30),
    height: scale(30),
    padding: scale(4),
    alignSelf: 'flex-end',
  },
  topContainer: {
    height: Platform.OS === 'android' ? 0 : getStatusBarHeight(),
    width: '100%',
    backgroundColor: 'white',
  },
});

export default HeaderBar;
