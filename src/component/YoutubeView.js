import React, {useState} from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import g from '../theme/global';
import Helper from '../helper/Helper';
import YouTube from 'react-native-youtube';
import {YOUTUBE_KEY} from '../../config';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';

let youtubeId = '';
let _youTubeRef = React.createRef();
const YoutubeView = (props) => {
  if (props.link !== '') {
    youtubeId = Helper.GetYoutubeId(props.link);
  }
  const [playVideo, setPlayVideo] = useState(false);
  const [thumbnail] = useState(Helper.loadYoutubeThumb(youtubeId));

  // const [thumbnail] = useState(
  //   youtubeId !== undefined ? Helper.loadYoutubeThumb(youtubeId) : null,
  // );

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
          {thumbnail !== undefined && thumbnail !== null ? (
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
