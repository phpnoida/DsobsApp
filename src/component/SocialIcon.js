import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  FlatList,
} from 'react-native';
import g from '../theme/global';
import grid from '../theme/grid';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';

export const showSocialIcon = (title, color) => {
  return (
    <View style={grid.rowrow}>
      <GlobalInclude.BaseIcon
        containerStyle={{
          height: scale(28),
          width: scale(28),
          justifyContent: 'center',
        }}
        iconColor={color}
        iconName={title}
        iconSize={scale(22)}
        iconType={IconType[4]}
      />
      <View
        style={{
          width: 1,
          height: 26,
          backgroundColor: '#ced4da',
          marginStart: scale(5),
        }}
      />
    </View>
  );
};
