import React from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import g from '../theme/global';
import {scale} from '../theme/Scalling';

const CommonButtonGray = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        backgroundColor: '#f8f8f8',
        textAlign: 'center',
        fontSize: scale(16),
        borderRadius: scale(8),
        width: '100%',
        height: scale(38),
        justifyContent: 'center',
      }}
      onPress={() => {
        props.onPress();
      }}>
      {props.showLoader ? (
        <ActivityIndicator size={'small'} color={'white'} />
      ) : (
        <Text
          style={{
            fontSize: scale(18),
            color: '#000',
            fontFamily: 'Lato-Regular',
            textAlign: 'center',
          }}>
          {props.title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CommonButtonGray;
