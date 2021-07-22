import React, {useEffect} from 'react';
import {StyleSheet, BackHandler} from 'react-native';
import Video from 'react-native-video-controls';
import Orientation from 'react-native-orientation-locker';

const VideoPlayer = ({route, navigation}) => {
  useEffect(() => {
    Orientation.lockToLandscape();
    const backAction = () => {
      Orientation.lockToPortrait();
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <Video
      source={{uri: route.params.playerLink}}
      isFullScreen={true}
      disableBack={true}
      toggleResizeModeOnFullscreen={true}
      onEnterFullscreen={() => {
        Orientation.lockToLandscape();
      }}
      onExitFullscreen={() => {
        Orientation.lockToPortrait();
      }}
    />
  );
};

export default VideoPlayer;
