import React from 'react';
import {Platform, Animated} from 'react-native';
import {scale} from '../theme/Scalling';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import Color from '../theme/Colors';
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const ProgressImage = createImageProgress(AnimatedFastImage);
let opacity = new Animated.Value(0.0);

const ProgresImage = ({source, containerStyle, imageStyle, mode}) => (
  <ProgressImage
    source={source}
    style={containerStyle}
    imageStyle={{
      ...imageStyle,
      opacity: opacity,
      transform: [
        {
          scale: opacity.interpolate({
            inputRange: [0, 1.0],
            outputRange: [0.85, 1.0],
          }),
        },
      ],
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
    onLoad={() => {
      Animated.timing(opacity, {
        toValue: 1.0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }}
    resizeMode={mode ? mode : FastImage.resizeMode.cover}
    threshold={20}
  />
);

export default ProgresImage;
