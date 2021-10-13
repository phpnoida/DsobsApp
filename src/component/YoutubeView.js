import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import g from '../theme/global';
import Helper from '../helper/Helper';
import YouTube from 'react-native-youtube';
import {YOUTUBE_KEY} from '../../config';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';
import axios from 'axios';
import * as RootNavigation from '../helper/NavigationService';
import Video from 'react-native-video-controls';
import {
  YouTubeStandaloneAndroid,
  YouTubeStandaloneIOS,
} from 'react-native-youtube';

let _youTubeRef = React.createRef();
const YoutubeView = props => {
  const [playVideo, setPlayVideo] = useState(
    props.autoPlay ? props.autoPlay : false,
  );
  const [thumbnail, setThumbnail] = useState('');
  const [youtubeId, setyoutubeId] = useState('');
  const [isApiCall, setIsApiCall] = useState(true);
  const [videoType, setVideoType] = useState('youtube');

  useEffect(() => {
    if (props.link !== '') {
      let videoObj = Helper.checkVideoUrl(props.link);
      if (videoObj.type === 'vimeo') {
        axios
          .get(`https://player.vimeo.com/video/${videoObj.id}/config`)
          .then(data => {
            if (data.status) {
              if (data.data !== null && data.data !== undefined) {
                let postData = data.data;
                let thumbUrl = postData.video.thumbs.base;
                let videoUrl =
                  postData.request.files.hls.cdns[
                    postData.request.files.hls.default_cdn
                  ].url;

                setThumbnail(thumbUrl);
                setyoutubeId(videoUrl);
                setVideoType('vimeo');
              }
            }
          })
          .finally(() => {
            setIsApiCall(false);
          });
      } else {
        let videoId = Helper.GetYoutubeId(props.link);
        setThumbnail(Helper.loadYoutubeThumb(videoId));
        setyoutubeId(videoId);
        setIsApiCall(false);
      }
    }

    return () => {};
  }, [props.link]);

  const playYoutubeVideo = () => {
    if (Helper.checkVideoUrl(props.link).type === 'vimeo') {
      RootNavigation.navigate('VideoPlayer', {
        playerLink: youtubeId,
      });
    } else {
      if (Platform.OS === 'ios') {
        setPlayVideo(true);
        // YouTubeStandaloneIOS.playVideo(youtubeId)
        //   .then((message) => console.log(message))
        //   .catch((errorMessage) => console.error(errorMessage));

        // RootNavigation.navigate('YoutubePlayer', {
        //   youtubeId: youtubeId,
        // });
      } else if (Platform.OS === 'android') {
        YouTubeStandaloneAndroid.playVideo({
          apiKey: YOUTUBE_KEY,
          videoId: youtubeId,
          autoplay: true,
          startTime: 0,
        })
          .then(() => console.log('Standalone Player Exited'))
          .catch(errorMessage => console.error(errorMessage));
      }
    }
  };

  return (
    <View>
      {playVideo && videoType === 'vimeo' ? (
        <Video source={{uri: youtubeId}} />
      ) : playVideo ? (
        <YouTube
          apiKey={YOUTUBE_KEY}
          origin="http://www.youtube.com"
          videoId={youtubeId}
          play={true}
          fullscreen={true}
          onChangeFullscreen={e => {
            setPlayVideo(e.isFullscreen);
          }}
          onError={e => {
            console.log('error', e);
          }}
          style={props.containerStyle ? props.containerStyle : style.container}
        />
      ) : (
        <View>
          {isApiCall ? (
            <View
              style={
                props.containerStyle ? props.containerStyle : style.container
              }>
              <ActivityIndicator
                color={GlobalInclude.Color.ColorPrimary}
                size={'large'}
              />
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (youtubeId !== undefined && youtubeId !== null) {
                  playYoutubeVideo();
                }
              }}
              activeOpacity={1}>
              {thumbnail !== undefined &&
              thumbnail !== null &&
              thumbnail !== '' ? (
                <View
                  style={
                    props.containerStyle
                      ? props.containerStyle
                      : style.container
                  }>
                  <Image
                    style={props.thumbStyle ? props.thumbStyle : style.thumb}
                    resizeMode={'cover'}
                    source={{
                      uri: thumbnail,
                    }}
                  />
                  <View
                    style={
                      props.overlayStyle ? props.overlayStyle : g.videoBlackBg
                    }
                  />
                  {props.showPlay && (
                    <View
                      style={
                        props.playIconstyle
                          ? props.playIconstyle
                          : style.playIcon
                      }>
                      <TouchableOpacity
                        onPress={() => {
                          if (youtubeId !== undefined && youtubeId !== null) {
                            playYoutubeVideo();
                          }
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
                          iconType={
                            props.iconType ? props.iconType : IconType[4]
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ) : (
                <View
                  style={
                    props.containerStyle
                      ? props.containerStyle
                      : style.container
                  }>
                  <WebView source={{uri: props.link}} />
                </View>
              )}
            </TouchableOpacity>
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
