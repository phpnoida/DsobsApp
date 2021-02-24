import React, {Component} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import g from '../theme/global';
import Helper from '../helper/Helper';
import YouTube from 'react-native-youtube';
import {YOUTUBE_KEY} from '../../config';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';

let height = 0.0;
let width = 0.0;
class PlayVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: false,
      imageUrl: '',
      fullscreen: true,
    };
  }
  componentDidMount() {
    if (this.props.height !== undefined && this.props.height !== null) {
      height = this.props.height;
    } else {
      height = scale(85);
    }

    if (this.props.width !== undefined && this.props.width !== null) {
      width = this.props.width;
    } else {
      width = scale(85);
    }
    this.getThumb(this.props.videoUrl);
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

  playVideo(video) {
    return (
      <View
        style={{
          height: height,
          width: width,
          borderRadius: scale(6),
        }}>
        <YouTube
          ref={(component) => {
            this._youTubeRef = component;
          }}
          apiKey={YOUTUBE_KEY}
          origin="http://www.youtube.com"
          videoId={video}
          play={true}
          fullscreen={true}
          onChangeFullscreen={(e) => this.setState({hide: e.isFullscreen})}
          onReady={(e) => this.setState({isReady: true})}
          onChangeState={(e) => this.setState({status: e.state})}
          onChangeQuality={(e) => this.setState({quality: e.quality})}
          onError={(e) => this.setState({error: e.error})}
          style={{
            height: height,
            width: width,
            borderRadius: scale(6),
          }}
        />
      </View>
    );
  }

  playWebView() {
    return (
      <View
        style={{
          height: height,
          width: height,
          borderRadius: scale(6),
        }}>
        <WebView source={{uri: this.props.videoUrl}} />
      </View>
    );
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

        return this.playVideo(match[2]);
      } else if (url.includes('youtube') && url.includes('watch?v=')) {
        if (url !== undefined || url !== '') {
          var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
          var match = url.match(regExp);
          if (match && match[2].length === 11) {
            return this.playVideo(match[2]);
          } else {
            return this.playWebView();
          }
        }
      } else {
        videoLink = this.props.videoUrl;
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = videoLink.match(regExp);
        if (url.includes('youtu.be')) {
          return this.playVideo(match[2]);
        } else {
          return this.playWebView();
        }
      }
    } else {
      return (
        <View
          style={{
            height: height,
            width: width,
            justifyContent: 'center',
          }}>
          <Image
            style={{height: '100%', width: '100%', borderRadius: scale(6)}}
            resizeMode="cover"
            source={{
              uri: this.props.imagePath ? this.props.imagePath : imageUrl,
            }}
          />
          <View style={g.videoBlackBg} />
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              alignContent: 'center',
              zIndex: 9,
            }}>
            <TouchableOpacity onPress={() => this.aa()} activeOpacity={1}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(36), width: scale(36)}}
                iconColor={'#fff'}
                iconName={'play-circle-o'}
                iconSize={scale(36)}
                iconType={IconType[4]}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  render() {
    return <View>{this.renderVideo()}</View>;
  }
}
export default PlayVideo;
