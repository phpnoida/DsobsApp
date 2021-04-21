import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import ProgresImage from './ProgresImage';
import GlobalInclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';

const Preview = ({style, item, imageKey, onPress, index, active, local}) => {
  console.log('====================================');
  console.log(item);
  console.log('====================================');
  return (
    <View
      style={{
        borderRadius: scale(10),
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        height: scale(160),
        width: style.width,
        overflow: 'hidden',
      }}>
      <ProgresImage
        source={{uri: item.image}}
        containerStyle={{
          borderRadius: scale(10),
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          height: scale(160),
          width: style.width,
        }}
        imageStyle={{
          borderRadius: scale(10),
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          height: scale(160),
          width: style.width,
        }}
        mode={'cover'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: 275,
    paddingVertical: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  videoPreview: {
    width: 275,
    height: 155,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  desc: {
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 24,
    marginTop: 18,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default Preview;
