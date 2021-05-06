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
import grid from '../theme/grid';

const HeaderBar = ({
  title,
  navigation,
  showBack,
  label,
  showLabel,
  onLabelPress,
  customIcon,
  customIconPress,
}) => {
  return (
    <View
      style={{
        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1.22,
        elevation: 3,
        backgroundColor: 'white',
      }}>
      <View style={headerStyle.topContainer} />
      <View style={headerStyle.container}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            marginEnd: scale(40),
            marginStart: scale(40),
          }}>
          {title && (
            <Text style={[g.fs16, g.FHNB, g.colordarkGray, g.txtCenter]}>
              {title}
            </Text>
          )}
        </View>
        <View style={[grid.col, grid.rowdir]}>
          {showBack && (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={GlobalInclude.Assets.Back}
                style={headerStyle.back}
              />
            </TouchableOpacity>
          )}
        </View>

        <View>
          {showLabel && (
            <TouchableOpacity
              style={{
                minWidth: scale(50),
                alignSelf: 'flex-end',
              }}
              activeOpacity={1}
              onPress={() => {
                onLabelPress();
              }}>
              <Text style={[g.colorBlue, g.fs14, g.FHNB, g.txtRight]}>
                {label}
              </Text>
            </TouchableOpacity>
          )}
          {customIcon && (
            <TouchableOpacity onPress={() => customIconPress()}>
              <GlobalInclude.BaseIcon
                containerStyle={customIcon.containerStyle}
                iconColor={customIcon.iconColor}
                iconName={customIcon.iconName}
                iconSize={customIcon.size}
                iconType={customIcon.type}
              />
            </TouchableOpacity>
          )}
        </View>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
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
