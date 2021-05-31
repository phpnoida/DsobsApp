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

  setOriginalSize(iw, ih) {
    let ratio = Math.min(width / iw, height / ih);
    this.setState({
      imgHeight: Math.ceil(ih * ratio),
      imgWidth: Math.ceil(iw * ratio),
    });
  }

  render() {
    const {imgHeight, imgWidth} = this.state;
    return (
      <View style={g.bgBlack06}>
        {imgHeight <= 0 && imgWidth <= 0 ? (
          <View style={{width: width, aspectRatio: 1 / 1}}>
            <ActivityIndicator
              size={'large'}
              color={GlobalInclude.Color.ColorPrimary}
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
    );
  }
}
