import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import ProgresImage from './ProgresImage';
import {scale} from '../theme/Scalling';
import g from '../theme/global';
import grid from '../theme/grid';
import Assets from '../theme/Assets';
const {height, width} = Dimensions.get('window');

class GalleryImage extends Component {
  constructor(props) {
    super(props);
  }

  renderImages = (data, expanded) => {
    let loopTill = expanded ? 6 : 0;

    let calloutSection = data.map((item, index) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.props.onImagePress(data, index + loopTill);
          }}
          onLongPress={() => {
            this.props.onLongPress(item, index + loopTill);
          }}
          key={index}
          style={{
            width: width / 3 - 27,
            marginTop: 10,
            marginRight: 5,
            marginLeft: 5,
          }}>
          <View style={[g.br3, g.oh, g.bggray]}>
            <ProgresImage
              source={
                item.imagesLink !== undefined &&
                item.imagesLink !== null &&
                item.imagesLink !== ''
                  ? {
                      uri: item.imagesLink,
                    }
                  : Assets.DefaultImage
              }
              containerStyle={{aspectRatio: 1 / 1}}
              imageStyle={{
                aspectRatio: 1 / 1,
              }}
            />
          </View>
        </TouchableOpacity>
      );
    });
    return calloutSection;
  };

  loadFirstSixImages = (imageArray) => {
    let data = imageArray.slice(0, 6);
    return this.renderImages(data, false);
  };

  loadRemainImages = (imageArray) => {
    let data = imageArray.slice(6);
    return this.renderImages(data, true);
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   const {isExpanded} = nextProps;
  //   const {isExpanded: oldLiked} = this.props;
  //   return isExpanded !== oldLiked;
  // }

  render() {
    return (
      <View
        style={[
          {
            marginRight: 15,
            marginLeft: 15,
            padding: 10,
            borderRadius: 10,
            shadowOffset: {width: 2},
          },
          g.mb5,
          g.mt10,
          g.pb15,
          g.bgWhite,
          g.boxShadow,
        ]}>
        <View
          style={[
            grid.rowdir,
            grid.alignItemsBottom,
            grid.justifyContent,
            g.pl5,
          ]}>
          <View style={[grid.col, g.pr15]}>
            <Text style={[g.colorBlack, g.fs14, g.FHNM]}>
              {this.props.title}
            </Text>
          </View>
          <View style={[{width: scale(60)}, grid.alignItems]}>
            <TouchableOpacity
              onPress={() => {
                this.props.expandSelectedPanel();
              }}>
              <Text style={[g.colorBlue, g.fs13]}>
                +
                {this.props.imageCount &&
                parseInt(this.props.imageCount, 10) > 5
                  ? this.props.imageCount
                  : 0}{' '}
                More
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Pictures */}
        <View style={[g.oh]}>
          <View style={[grid.rowdir, grid.flexwrap]}>
            {this.loadFirstSixImages(this.props.images)}
            {this.props.isExpanded && this.loadRemainImages(this.props.images)}
          </View>
        </View>
      </View>
    );
  }
}

export default GalleryImage;
