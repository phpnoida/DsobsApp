import React, {Component} from 'react';
import {View, Image, Dimensions, ActivityIndicator} from 'react-native';
import ProgressImage from './ProgresImage';
import GlobalInclude from '../globalInclude/Globalinclude';
import g from '../theme/global';

let {height, width} = Dimensions.get('window');

export default class ResponsiveImage extends Component {
  constructor(props) {
    super(props);
    this.state = {imgHeight: 0, imgWidth: 0};

    height = Dimensions.get('window').height;
    width = Dimensions.get('window').width;
    height = parseInt(height, 10);
    width = parseInt(width, 10);
  }

  componentDidMount() {
    this.mounted = true;
    this.fetchOriginalSizeFromRemoteImage();
  }

  fetchOriginalSizeFromRemoteImage() {
    let uri;
    if (this.props.source instanceof Array) {
      uri = this.props.source[0].uri;
    } else {
      uri = this.props.source.uri;
    }

    if (!uri) {
      return;
    }

    Image.getSize(
      uri,
      (iw, ih) => {
        if (!this.mounted) {
          return;
        }
        this.setOriginalSize(iw, ih);
      },
      () => null,
    );
  }

  setupDefault() {
    height = Dimensions.get('window').height;
    width = Dimensions.get('window').width;
    height = parseInt(height, 10);
    width = parseInt(width, 10);
  }

  setOriginalSize(iw, ih) {
    if (ih > iw) {
      //portrait
      if (this.props.showEdges) {
        width = width - this.props.edges;
        height = height - this.props.edges;
      }
    } else {
      this.setupDefault();
    }

    console.log('width', width);
    console.log('height', height);

    let ratio = Math.min(width / iw, height / ih);

    let iWidth = Math.ceil(iw * ratio);
    let iHeight = Math.ceil(ih * ratio);

    this.setState({
      imgHeight: iHeight,
      imgWidth: iWidth,
    });
  }

  render() {
    const {imgHeight, imgWidth} = this.state;
    return (
      <View style={{backgroundColor: 'white'}}>
        {imgHeight <= 0 && imgWidth <= 0 ? (
          <View style={{width: width, aspectRatio: 1 / 1}}>
            <ActivityIndicator
              size={'large'}
              color={GlobalInclude.Color.ColorPrimary}
            />
          </View>
        ) : (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {imgHeight > imgWidth ? (
              <View>
                <ProgressImage
                  source={this.props.source}
                  containerStyle={{
                    height: imgHeight,
                    width: imgWidth,
                  }}
                  imageStyle={{
                    height: imgHeight,
                    width: imgWidth,
                  }}
                  mode={'cover'}
                />
              </View>
            ) : (
              <ProgressImage
                source={this.props.source}
                containerStyle={{height: imgHeight, width: imgWidth}}
                imageStyle={{
                  height: imgHeight,
                  width: imgWidth,
                }}
                mode={'cover'}
              />
            )}
          </View>
        )}
      </View>
    );
  }
}
