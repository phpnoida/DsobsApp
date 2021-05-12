import React, {useState, useEffect} from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import g from '../theme/global';
import Helper from '../helper/Helper';
import YouTube from 'react-native-youtube';
import {YOUTUBE_KEY} from '../../config';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';

let _youTubeRef = React.createRef();
const YoutubeView = (props) => {
  const [playVideo, setPlayVideo] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [youtubeId, setyoutubeId] = useState('');

  useEffect(() => {
    if (props.link !== '') {
      //console.log('link', props.link);
      let videoId = Helper.GetYoutubeId(props.link);
      setThumbnail(Helper.loadYoutubeThumb(videoId));
      setyoutubeId(Helper.GetYoutubeId(props.link));

      console.log('props.link', props.link);
    }

    return () => {};
  }, [props.link]);

  return (
    <View>
      {playVideo ? (
        <YouTube
          ref={_youTubeRef}
          apiKey={YOUTUBE_KEY}
          origin="http://www.youtube.com"
          videoId={youtubeId}
          play={true}
          fullscreen={true}
          onChangeFullscreen={(e) => {
            setPlayVideo(e.isFullscreen);
          }}
          style={props.containerStyle ? props.containerStyle : style.container}
        />
      ) : (
        <View>
          {thumbnail !== undefined && thumbnail !== null && thumbnail !== '' ? (
            <View
              style={
                props.containerStyle ? props.containerStyle : style.container
              }>
              <Image
                style={props.thumbStyle ? props.thumbStyle : style.thumb}
                resizeMode={'cover'}
                source={{
                  uri: thumbnail,
                }}
              />
              <View
                style={props.overlayStyle ? props.overlayStyle : g.videoBlackBg}
              />
              <View
                style={
                  props.playIconstyle ? props.playIconstyle : style.playIcon
                }>
                <TouchableOpacity
                  onPress={() => {
                    setPlayVideo(true);
                  }}
                  activeOpacity={1}>
                  <GlobalInclude.BaseIcon
                    containerStyle={
                      props.playIconContainer
                        ? props.playIconContainer
                        : style.playContainer
                    }
                    iconColor={'#fff'}
                    iconName={props.iconName ? props.iconName : 'play'}
                    iconSize={props.iconSize ? props.iconSize : scale(36)}
                    iconType={props.iconType ? props.iconType : IconType[4]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={
                props.containerStyle ? props.containerStyle : style.container
              }>
              <WebView source={{uri: props.link}} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    height: scale(90),
    width: scale(90),
    alignContent: 'center',
    justifyContent: 'center',
  },
  thumb: {height: '100%', width: '100%', borderRadius: scale(6)},
  playIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    zIndex: 9,
  },
  playContainer: {height: scale(36), width: scale(36)},
});

export default YoutubeView;
