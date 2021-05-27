import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import ProgresImage from './ProgresImage';
import {scale} from '../theme/Scalling';

const ImageDetail = ({
  style,
  item,
  imageKey,
  onPress,
  index,
  active,
  local,
  ViewStyle,
  containerStyle,
  imageStyle,
}) => {
  return (
    <View
      style={{
        borderRadius: scale(10),
        height: scale(160),
        width: style.width,
        overflow: 'hidden',
      }}>
      <ProgresImage
        source={{uri: item}}
        containerStyle={{
          borderRadius: scale(10),
          height: scale(160),
          width: style.width,
        }}
        imageStyle={{
          borderRadius: scale(10),
          height: scale(160),
          width: style.width,
        }}
        mode={'cover'}
      />
    </View>
  );
};

export default ImageDetail;
