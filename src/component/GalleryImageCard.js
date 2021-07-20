import React, {PureComponent} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';
import g from '../theme/global';
import grid from '../theme/grid';
import {IconType} from '../helper/Constants';
import ProgressImage from '../component/ProgresImage';

class GalleryImageCard extends PureComponent {
  render() {
    const {
      item: {imagesLink, ih, iw},
      showTaggedUser,
      showAboutPhoto,
      onTouchImage,
    } = this.props;
    return (
      <View style={{marginVertical: scale(5)}}>
        <View
          style={[
            grid.rowrow,
            grid.flex1,
            g.p10,
            grid.justifyContentCenter,
            grid.alignItems,
          ]}>
          <View
            style={[
              grid.flex1,
              grid.alignItems,
              grid.justifyContentLeft,
              grid.rowrow,
            ]}>
            <TouchableOpacity
              style={[grid.rowrow, grid.alignItems, grid.justifyContentLeft]}
              onPress={showTaggedUser}>
              <Text style={[g.fs14, g.FHNB, g.colorBlue]}>
                People In This Image
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[grid.flex1, grid.justifyContentRight]}>
            <TouchableOpacity
              style={[grid.rowrow, grid.alignItems, grid.justifyContentRight]}
              onPress={showAboutPhoto}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(15), width: scale(15)}}
                iconColor={GlobalInclude.Color.ColorPrimary}
                iconName={'dots-three-horizontal'}
                iconSize={scale(15)}
                iconType={IconType[9]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={onTouchImage}
          activeOpacity={0.9}
          style={[g.bgBlack06, grid.alignItems]}>
          {imagesLink !== undefined &&
          imagesLink !== null &&
          imagesLink !== '' ? (
            <ProgressImage
              source={{uri: imagesLink}}
              containerStyle={{width: iw, height: ih}}
              mode={'cover'}
            />
          ) : (
            <ProgressImage
              source={GlobalInclude.Assets.DefaultImage}
              containerStyle={{
                aspectRatio: 16 / 9,
              }}
              imageStyle={{
                aspectRatio: 16 / 9,
              }}
              mode={'contain'}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}
export default GalleryImageCard;
