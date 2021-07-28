import React from 'react';
import {Platform, Animated} from 'react-native';
import {scale} from '../theme/Scalling';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import Color from '../theme/Colors';
const ProgressImage = createImageProgress(FastImage);

const FastImageView = ({source, containerStyle, imageStyle, mode}) => (
  <ProgressImage
    source={source}
    style={containerStyle}
    imageStyle={{
      ...imageStyle,
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
    }}
    indicatorProps={{
      animated: true,
      color: Color.ColorPrimary,
      direction: Platform.os === 'android' ? 'clockwise' : 'rtl',
      indeterminate: true,
      progress: 100,
      strokeCap: 'butt',
      size: scale(24),
    }}
    resizeMode={mode ? mode : FastImage.resizeMode.cover}
    threshold={20}
  />
);

export default FastImageView;
