import React, {useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Animated,
} from 'react-native';

import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';
import CommonButton from './CommonButton';

import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const ProgressImage = createImageProgress(AnimatedFastImage);

let opacity = new Animated.Value(0.0);

const ZoomImage = (props) => {
  const [showModal, setShowModal] = useState(true);
  const {imagelink} = props;
  console.log('imagelink', imagelink);
  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <Modal
        transparent={false}
        onRequestClose={() => {
          setShowModal(!showModal);
          props.onClose();
        }}
        animationType={'slide'}
        statusBarTranslucent={true}
        presentationStyle={'overFullScreen'}
        visible={showModal}>
        <View style={styles.modalView}>
          <View style={styles.imageContainer}>
            {imagelink !== '' ? (
              <ProgressImage
                source={{uri: imagelink}}
                style={styles.imageStyle}
                imageStyle={{
                  opacity: opacity,
                  transform: [
                    {
                      scale: opacity.interpolate({
                        inputRange: [0, 1.0],
                        outputRange: [0.85, 1.0],
                      }),
                    },
                  ],
                }}
                indicatorProps={{
                  animated: true,
                  borderColor: 'red',
                  borderWidth: 2,
                  color: '#2b3252',
                  direction: Platform.os === 'android' ? 'clockwise' : 'rtl',
                  indeterminate: true,
                  progress: 100,
                  strokeCap: 'butt',
                  size: scale(20),
                }}
                onLoad={() => {
                  Animated.timing(opacity, {
                    toValue: 1.0,
                    duration: 200,
                    useNativeDriver: true,
                  }).start();
                }}
                resizeMode={FastImage.resizeMode.cover}
                threshold={20}
              />
            ) : (
              <View />
            )}
            <TouchableOpacity
              onPress={() => {
                setShowModal(!showModal);
                props.onClose();
              }}
              style={styles.buttonCircle}
              background={TouchableNativeFeedback.SelectableBackground()}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(30), width: scale(30)}}
                iconColor={'#000'}
                iconName={'close'}
                iconSize={scale(30)}
                iconType={IconType[8]}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <CommonButton
              title={'LEARN MORE'}
              radius={scale(12)}
              onPress={() => {
                setShowModal(!showModal);
                props.onButtonPress();
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'rgba(62,62,62,1)',
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonCircle: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(30),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',

    backgroundColor: 'white',
    position: 'absolute',
    right: 10,
    top: 15,
    alignContent: 'center',
    zIndex: 99,
  },
  imageStyle: {
    height: '100%',
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
  },
  imageContainer: {
    height: '75%',
    width: '95%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: scale(30),
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
  },
});

export default ZoomImage;
