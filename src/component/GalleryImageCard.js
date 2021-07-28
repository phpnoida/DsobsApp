import React, {PureComponent} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';
import g from '../theme/global';
import grid from '../theme/grid';
import {IconType} from '../helper/Constants';
import ProgressImage from '../component/ProgresImage';
import FastImageView from '../component/FastImageView';

class GalleryImageCard extends PureComponent {
  render() {
    const {
      item: {imagesLink, ih, iw, userTag},
      showTaggedUser,
      showAboutPhoto,
      onTouchImage,
    } = this.props;
    return (
      <View>
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
              style={[grid.rowrow, grid.alignItems, grid.justifyContentCenter]}
              onPress={showTaggedUser}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(18), width: scale(18)}}
                iconColor={GlobalInclude.Color.ColorPrimary}
                iconName={'account-group'}
                iconSize={scale(18)}
                iconType={IconType[1]}
              />
              {userTag.length > 0 && (
                <Text
                  style={[
                    g.fs16,
                    g.FHNB,
                    g.colorBlue,
                    grid.alignItems,
                    grid.justifyContentCenter,
                    g.ml5,
                  ]}>
                  {userTag.length}
                </Text>
              )}
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
            <FastImageView
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
