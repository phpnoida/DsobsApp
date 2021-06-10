import React, {useRef} from 'react';
import {View, Dimensions} from 'react-native';
import ResponsiveImage from './ResponsiveImage';
import YoutubeView from './YoutubeView';
import {scale} from '../theme/Scalling';
import Pdf from 'react-native-pdf';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';

const {width: displayWidth} = Dimensions.get('window');

const SliderImage = ({
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
        flexGrow: 0,
        minHeight: 70,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        width: displayWidth,
      }}>
      {item.type === 1 ? (
        <ResponsiveImage source={{uri: item.file}} />
      ) : item.type === 2 ? (
        <YoutubeView
          link={item.file}
          containerStyle={{
            justifyContent: 'center',
            aspectRatio: 16 / 9,
            width: displayWidth,
            borderRadius: 0,
          }}
          thumbStyle={{borderRadius: 0, height: '100%', width: '100%'}}
          overlayStyle={{borderRadius: 0}}
          playIconstyle={{
            position: 'absolute',
            zIndex: 9,
            bottom: 15,
            left: 15,
          }}
          playIconContainer={{
            height: scale(20),
            width: scale(20),
          }}
          iconSize={scale(20)}
          showPlay={true}
        />
      ) : item.type === 3 ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            alignContent: 'center',
          }}>
          <Pdf
            singlePage={true}
            source={{
              uri: item.file,
            }}
            style={{
              aspectRatio: 1 / 1,
              width: displayWidth,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              alignContent: 'center',
            }}
          />
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
              containerStyle={{height: scale(36), width: scale(36)}}
              iconColor={'#E61A2D'}
              iconName={'file-pdf-o'}
              iconSize={scale(36)}
              iconType={IconType[4]}
            />
          </View>
        </View>
      ) : (
        <View />
      )}
    </View>
  );
};

export default SliderImage;
