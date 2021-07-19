import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import g from '../theme/global';
import grid from '../theme/grid';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';
import YoutubeView from './YoutubeView';
import ProgresImage from './ProgresImage';

export const loadMedia = (item, index, removeMedia) => {
  return (
    <View
      key={index}
      style={[
        grid.c2,
        {
          marginBottom: scale(5),
        },
      ]}>
      {item.type === 1 && (
        <View style={[g.b1, g.br3, g.oh]}>
          <View
            style={[
              grid.rowdir,
              grid.justifyContentRight,
              {position: 'absolute', right: 10, top: 10, zIndex: 1},
            ]}>
            <TouchableOpacity
              onPress={(e) => {
                removeMedia(index);
              }}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(18), width: scale(18)}}
                iconColor={'#fff'}
                iconName={'remove'}
                iconSize={scale(18)}
                iconType={IconType[4]}
              />
            </TouchableOpacity>
          </View>
          <View style={[g.bggray]}>
            <ProgresImage
              source={{uri: item.thumbnail}}
              containerStyle={{aspectRatio: 16 / 9}}
              imageStyle={{
                aspectRatio: 16 / 9,
              }}
            />
          </View>
        </View>
      )}

      {item.type === 2 && (
        <View style={[g.b1, g.br3, g.oh]}>
          <View
            style={[
              grid.rowdir,
              grid.justifyContentRight,
              {position: 'absolute', right: 10, top: 10, zIndex: 1},
            ]}>
            <TouchableOpacity
              onPress={(e) => {
                removeMedia(index);
              }}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(18), width: scale(18)}}
                iconColor={'#fff'}
                iconName={'remove'}
                iconSize={scale(18)}
                iconType={IconType[4]}
              />
            </TouchableOpacity>
          </View>
          <YoutubeView
            link={item.thumbnail}
            containerStyle={{
              borderRadius: scale(6),
              justifyContent: 'center',
              aspectRatio: 16 / 9,
            }}
            iconName={'play-circle-o'}
            iconType={'font-awesome'}
            showPlay={true}
          />
        </View>
      )}

      {item.type === 3 && (
        <View style={[g.b1, g.br3, g.oh, g.p10, {aspectRatio: 16 / 9}]}>
          <View
            style={[
              grid.rowdir,
              grid.justifyContentRight,
              g.colorGray,
              {position: 'absolute', right: 10, top: 10, zIndex: 1},
            ]}>
            <TouchableOpacity
              onPress={(e) => {
                removeMedia(index);
              }}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(18), width: scale(18)}}
                iconColor={'#333333'}
                iconName={'remove'}
                iconSize={scale(18)}
                iconType={IconType[4]}
              />
            </TouchableOpacity>
          </View>
          <View style={[grid.rowrow, grid.justifyContentCenter, g.mt5]}>
            {item.thumbnail.includes('.pdf') && (
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(48), width: scale(48)}}
                iconColor={'#E61A2D'}
                iconName={'file-pdf-o'}
                iconSize={scale(48)}
                iconType={IconType[4]}
              />
            )}
          </View>
          <Text
            style={[g.fs14, g.colordarkGray, g.FHNM, g.mt15]}
            numberOfLines={2}>
            {item.fieldName}
          </Text>
        </View>
      )}

      {item.type === 4 && (
        <View style={[g.b1, g.br3, g.oh, g.p10, {aspectRatio: 16 / 9}]}>
          <View
            style={[
              grid.rowdir,
              grid.justifyContentRight,
              g.colorGray,
              {position: 'absolute', right: 10, top: 10, zIndex: 1},
            ]}>
            <TouchableOpacity
              onPress={(e) => {
                removeMedia(index);
              }}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(18), width: scale(18)}}
                iconColor={'#333333'}
                iconName={'remove'}
                iconSize={scale(18)}
                iconType={IconType[4]}
              />
            </TouchableOpacity>
          </View>
          <View style={[grid.rowrow, grid.justifyContentCenter, g.mt5]}>
            <GlobalInclude.BaseIcon
              containerStyle={{height: scale(48), width: scale(48)}}
              iconColor={'#E61A2D'}
              iconName={'file-audio-o'}
              iconSize={scale(48)}
              iconType={IconType[4]}
            />
          </View>
          <Text
            style={[g.fs14, g.colordarkGray, g.FHNM, g.mt15]}
            numberOfLines={2}>
            {item.fieldName}
          </Text>
        </View>
      )}
    </View>
  );
};
