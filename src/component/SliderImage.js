import React, {useRef} from 'react';
import {View, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import ResponsiveImage from './ResponsiveImage';
import ProgressImage from './ProgresImage';
import g from '../theme/global';
import {scale} from '../theme/Scalling';
import Pdf from 'react-native-pdf';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';

const {width: displayWidth} = Dimensions.get('window');

const SliderImage = ({item, index, itemWidth, onItemCallBack}) => {
  return (
    <TouchableOpacity
      onPress={() => onItemCallBack(item, index)}
      activeOpacity={1}
      style={{
        flexGrow: 0,
        minHeight: 70,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        width: itemWidth ? itemWidth : displayWidth,
      }}>
      {item.type === 1 ? (
        <ProgressImage
          source={{uri: item.file}}
          containerStyle={{
            width: itemWidth ? itemWidth : displayWidth,
            aspectRatio: 1 / 1,
          }}
          mode={'cover'}
        />
      ) : item.type === 3 ? (
        <View
          style={[
            {
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              alignContent: 'center',
              width: itemWidth ? itemWidth : displayWidth,
              aspectRatio: 1 / 1,
            },
            g.bglightGray,
          ]}>
          <View
            style={{
              position: 'absolute',
              zIndex: 2,
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <GlobalInclude.BaseIcon
              containerStyle={{height: scale(64), width: scale(64)}}
              iconColor={'#E61A2D'}
              iconName={'file-pdf-o'}
              iconSize={scale(64)}
              iconType={IconType[4]}
            />
          </View>
        </View>
      ) : (
        <View />
      )}
    </TouchableOpacity>
  );
};

export default SliderImage;
