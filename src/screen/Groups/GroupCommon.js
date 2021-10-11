import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import g from '../../theme/global';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import ProgressImage from '../../component/ProgresImage';

export const renderGroupItem = (currentTab, item, index, onTap) => {
  return (
    <View key={index}>
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={() => onTap(item, index)}
        onPress={() => onTap(item, index)}
        style={{
          marginBottom: scale(15),
        }}>
        <View style={[g.bgWhite, g.boxShadow, {borderRadius: scale(10)}]}>
          <View style={[g.bggray3, style.backgroundBorder]}>
            <View style={style.imageStyle}>
              <ProgressImage
                source={
                  item.profilePicture
                    ? {
                        uri: item.profilePicture,
                      }
                    : GlobalInclude.Assets.DefaultImage
                }
                containerStyle={style.coverImage}
                imageStyle={style.coverImage}
                mode={'cover'}
              />
              {currentTab === 0 && item.unreadMessageCount > 0 && (
                <View style={style.newPostContainer}>
                  <Text
                    numberOfLines={1}
                    style={[
                      g.FHNB,
                      g.fs20,
                      g.colorWhite,
                      GlobalInclude.AppStyle.transform,
                    ]}>
                    {item.unreadMessageCount.toString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={g.p7}>
            <Text
              numberOfLines={1}
              style={[
                g.FHNB,
                g.fs16,
                g.colorBlue,
                GlobalInclude.AppStyle.transform,
              ]}>
              {item.name !== undefined && item.name !== null
                ? item.name
                : 'N/A'}
            </Text>
            <Text
              style={[
                g.fs13,
                g.mt2,
                g.FHNR,
                GlobalInclude.AppStyle.transform,
                g.colorGray,
              ]}
              numberOfLines={2}>
              {item.description !== undefined && item.description !== null
                ? item.description
                : 'N/A'}
            </Text>
            <Text
              style={[g.fs15, g.mt2, g.FHNM, g.colordarkGray]}
              numberOfLines={1}>
              {item.totalMember} Member(s)
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const style = StyleSheet.create({
  imageStyle: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: scale(10),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: 'center',
    alignContent: 'center',
  },
  coverImage: {height: '100%', width: '100%'},
  grayColorText: {color: '#bababa'},
  backgroundBorder: {
    borderRadius: scale(10),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  newPostContainer: {
    position: 'absolute',
    backgroundColor: GlobalInclude.Color.ColorPrimaryLight,
    height: scale(34),
    width: scale(34),
    borderRadius: scale(68),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    top: scale(15),
    right: 10,
  },
});
