import React, {Component} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import g from '../theme/global';
import Helper from '../helper/Helper';
import YouTube from 'react-native-youtube';
import {YOUTUBE_KEY} from '../../config';
import grid from '../theme/grid';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';

class VideoWebView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: false,
      imageUrl: '',
      fullscreen: true,
    };
  }
  componentDidMount() {
    this.getThumb(this.props.videoUrl);
    console.log('this.props.videoUrl', this.props.videoUrl);
  }

  getThumb(url) {
    if (!url) {
      return;
    }
    let thumb = Helper.getThumbnail(url);
    this.setState({imageUrl: thumb});
  }

  aa() {
    this.setState({hide: true});
    this.props.videoClick ? this.props.videoClick(true) : '';
  }
  unMountVideo(e) {
    if (e.isFullscreen) {
      this._youTubeRef.props.play = false;
    }
  }
  renderVideo() {
    const {hide, imageUrl} = this.state;
    if (hide) {
      let videoLink;
      var url = this.props.videoUrl;
      if (url.includes('youtube') && url.includes('embed/')) {
        videoLink =
          url.replace('embed/', 'watch?v=') +
          '&rel=0&autoplay=0&showinfo=0&controls=0';
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = videoLink.match(regExp);
        console.log(match[2]);
        return (
          <View style={{aspectRatio: 16 / 9}}>
            <YouTube
              ref={(component) => {
                this._youTubeRef = component;
              }}
              apiKey={YOUTUBE_KEY}
              origin="http://www.youtube.com"
              videoId={match[2]} // The YouTube video ID
              play={true} // control playback of video with true/false
              fullscreen={true} // control whether the video should play in fullscreen or inline
              //loop={true}             // control whether the video should loop when ended
              onChangeFullscreen={(e) => this.setState({hide: e.isFullscreen})}
              //onChangeFullscreen={e => this.unMountVideo(e)}
              onReady={(e) => this.setState({isReady: true})}
              onChangeState={(e) => this.setState({status: e.state})}
              onChangeQuality={(e) => this.setState({quality: e.quality})}
              onError={(e) => this.setState({error: e.error})}
              style={{alignSelf: 'stretch', height: 200}}
            />
          </View>
        );
      } else if (url.includes('youtube') && url.includes('watch?v=')) {
        if (url !== undefined || url !== '') {
          var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
          var match = url.match(regExp);
          if (match && match[2].length === 11) {
            //videoLink = 'https://youtube.com/embed/' + match[2];
            return (
              <View style={{aspectRatio: 16 / 9}}>
                <YouTube
                  ref={(component) => {
                    this._youTubeRef = component;
                  }}
                  apiKey={YOUTUBE_KEY}
                  origin="http://www.youtube.com"
                  videoId={match[2]} // The YouTube video ID
                  play={true} // control playback of video with true/false
                  fullscreen={true} // control whether the video should play in fullscreen or inline
                  //loop={true}             // control whether the video should loop when ended
                  onChangeFullscreen={(e) =>
                    this.setState({hide: e.isFullscreen})
                  }
                  // onChangeFullscreen={e => this.unMountVideo(e)}
                  onReady={(e) => this.setState({isReady: true})}
                  onChangeState={(e) => this.setState({status: e.state})}
                  onChangeQuality={(e) => this.setState({quality: e.quality})}
                  onError={(e) => this.setState({error: e.error})}
                  style={{alignSelf: 'stretch', height: 200}}
                />
              </View>
            );
          } else {
            videoLink = this.props.videoUrl;
            return (
              <View style={{aspectRatio: 16 / 9}}>
                <WebView source={{uri: videoLink}} />
              </View>
            );
          }
        }
      } else {
        videoLink = this.props.videoUrl;
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = videoLink.match(regExp);
        if (url.includes('youtu.be')) {
          return (
            <View style={{aspectRatio: 16 / 9}}>
              <YouTube
                ref={(component) => {
                  this._youTubeRef = component;
                }}
                apiKey={YOUTUBE_KEY}
                origin="http://www.youtube.com"
                videoId={match[2]} // The YouTube video ID
                play={true} // control playback of video with true/false
                fullscreen={true} // control whether the video should play in fullscreen or inline
                //loop={true}             // control whether the video should loop when ended
                onChangeFullscreen={(e) =>
                  this.setState({hide: e.isFullscreen})
                }
                //onChangeFullscreen={e => this.unMountVideo(e)}
                onReady={(e) => this.setState({isReady: true})}
                onChangeState={(e) => this.setState({status: e.state})}
                onChangeQuality={(e) => this.setState({quality: e.quality})}
                onError={(e) => this.setState({error: e.error})}
                style={{alignSelf: 'stretch', height: 200}}
              />
            </View>
          );
        } else {
          return (
            <View style={{aspectRatio: 16 / 9}}>
              <WebView source={{uri: videoLink}} />
            </View>
          );
        }
      }
    } else {
      return (
        <View>
          <View style={[g.videoWrapper, {aspectRatio: 16 / 9}]}>
            <Image
              style={[g.br3, g.oh, {aspectRatio: 16 / 9}]}
              resizeMode="cover"
              source={{
                uri: this.props.imagePath ? this.props.imagePath : imageUrl,
              }}
            />
            <View style={g.videoBlackBg} />
            <View
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 9,
                },
                grid.rowdir,
                grid.alignItems,
                grid.justifyContentCenter,
              ]}>
              <TouchableOpacity
                onPress={() => this.aa()}
                activeOpacity={1}
                style={[
                  this.props.subVideoicon ? g.videoiconPlay1 : g.videoiconPlay2,
                ]}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(30), width: scale(30)}}
                  iconColor={'#fff'}
                  iconName={'play-circle'}
                  iconSize={scale(30)}
                  iconType={IconType[4]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  }

  render() {
    return <View>{this.renderVideo()}</View>;
  }
}
export default VideoWebView;
