import React from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import g from '../theme/global';
import {scale} from '../theme/Scalling';
import Color from '../theme/Colors';

const CommonButton = props => {
  return (
    <TouchableOpacity
      disabled={props.isDisabled ?? false}
      activeOpacity={1}
      style={{
        backgroundColor: Color.ColorPrimary,
        textAlign: 'center',
        fontSize: scale(16),
        borderRadius: props.radius ? props.radius : scale(8),
        width: '100%',
        height: scale(38),
        justifyContent: 'center',
        ...props.customStyle,
      }}
      onPress={e => {
        props.onPress(e);
      }}>
      {props.showLoader ? (
        <ActivityIndicator size={'small'} color={'white'} />
      ) : (
        <Text
          style={{
            fontSize: scale(18),
            color: '#ffffff',
            fontFamily: 'Lato-Regular',
            textAlign: 'center',
          }}>
          {props.title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CommonButton;
