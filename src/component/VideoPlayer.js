import React, {useEffect, useCallback} from 'react';
import {View, BackHandler} from 'react-native';
import Video from 'react-native-video-controls';
import Orientation, {
  OrientationLocker,
  PORTRAIT,
  LANDSCAPE,
} from 'react-native-orientation-locker';

let currentOriantation;
const VideoPlayer = ({route, navigation}) => {
  useEffect(() => {
    //Orientation.lockToLandscape();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    currentOriantation = Orientation.getInitialOrientation();
    Orientation.addOrientationListener(_orientationDidChange);
    return () => {
      Orientation.removeOrientationListener(_orientationDidChange);
      backHandler.remove();
    };
  }, [navigation, backAction]);

  const backAction = useCallback(() => {
    if (currentOriantation !== 'PORTRAIT') {
      Orientation.lockToPortrait();
      setTimeout(() => {
        navigation.goBack();
      }, 200);
    } else {
      navigation.goBack();
    }

    return true;
  }, [navigation]);

  const _orientationDidChange = (orientation) => {
    currentOriantation = orientation;
  };

  return (
    <Video
      source={{uri: route.params.playerLink}}
      isFullScreen={false}
      disableBack={false}
      toggleResizeModeOnFullscreen={false}
      onEnterFullscreen={() => {
        console.log('Enter');
        Orientation.lockToLandscape();
      }}
      onExitFullscreen={() => {
        Orientation.lockToPortrait();
      }}
      onBack={() => {
        backAction();
      }}
    />
  );
};

export default VideoPlayer;
