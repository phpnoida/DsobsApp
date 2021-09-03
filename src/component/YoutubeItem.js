import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Text,
} from 'react-native';
import {WebView} from 'react-native-webview';
import g from '../theme/global';
import grid from '../theme/grid';
import Helper from '../helper/Helper';
import YouTube from 'react-native-youtube';
import {YOUTUBE_KEY} from '../../config';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';
import axios from 'axios';
import * as RootNavigation from '../helper/NavigationService';
import Video from 'react-native-video-controls';
import {YouTubeStandaloneAndroid} from 'react-native-youtube';

const YoutubeItem = props => {
  const [playVideo, setPlayVideo] = useState(
    props.autoPlay ? props.autoPlay : false,
  );
  const [thumbnail, setThumbnail] = useState('');
  const [youtubeId, setyoutubeId] = useState('');
  const [isApiCall, setIsApiCall] = useState(true);
  const [videoType, setVideoType] = useState('youtube');
  const [metaData] = useState(props.extraObjects);

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
            <View style={{flex: 1}}>
              {thumbnail !== undefined &&
                thumbnail !== null &&
                thumbnail !== '' && (
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
                      <TouchableOpacity
                        style={
                          props.playIconstyle
                            ? props.playIconstyle
                            : style.playIcon
                        }
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
                    )}
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 6,
                        right: 6,
                        zIndex: 99,
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignContent: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                      }}>
                      <GlobalInclude.BaseIcon
                        containerStyle={{height: scale(20), width: scale(20)}}
                        iconColor={'#ffffff'}
                        iconName={'youtube-play'}
                        iconSize={scale(17)}
                        iconType={IconType[4]}
                      />
                      <Text style={[g.fs16, g.FHNB, g.colorWhite, g.ml2]}>
                        YouTube
                      </Text>
                    </View>
                  </View>
                )}
              <View style={{width: props.containerWidth}}>
                {metaData !== undefined && metaData !== null && (
                  <View
                    style={[
                      g.p5,
                      {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: scale(3),
                        marginVertical: scale(5),
                      },
                    ]}>
                    {metaData.title !== undefined &&
                      metaData.title !== null &&
                      metaData.title !== '' && (
                        <Text
                          style={[g.fs14, g.FHNB, g.colorBlack]}
                          numberOfLines={1}>
                          {metaData.title}
                        </Text>
                      )}
                    {metaData.description !== undefined &&
                      metaData.description !== null &&
                      metaData.description !== '' && (
                        <Text
                          style={[g.fs12, g.FHNR, g.colordarkGray, g.mt2]}
                          numberOfLines={2}>
                          {metaData.description}
                        </Text>
                      )}
                  </View>
                )}
                <Text style={[g.fs12, g.FHNM, g.colorSkyBlue]}>
                  {props.link}
                </Text>
              </View>
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

export default YoutubeItem;
