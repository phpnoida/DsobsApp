import React, {useState, useEffect} from 'react';
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';
import YouTube from 'react-native-youtube';
import {YOUTUBE_KEY} from '../../config';
import Orientation from 'react-native-orientation-locker';

const YoutubePlayer = ({route, navigation}) => {
  const [containerMounted, setContainerMounted] = useState(false);
  const [containerWidth, setContainerWidth] = useState(null);

  useEffect(() => {
    Orientation.lockToLandscape();
    return () => {};
  }, []);

  return (
    <YouTube
      apiKey={YOUTUBE_KEY}
      origin="http://www.youtube.com"
      videoId={route.params.youtubeId}
      play={true}
      fullscreen={true}
      onChangeFullscreen={(e) => {
        //setPlayVideo(e.isFullscreen);
        console.log(e);
        if (!e.isFullscreen) {
          Orientation.lockToPortrait();
          setTimeout(() => {
            navigation.goBack();
          }, 200);
        }
      }}
      onError={(e) => {
        console.log('error', e);
      }}
      controls={1}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
  },

  player: {
    alignSelf: 'stretch',
  },
});
export default YoutubePlayer;
