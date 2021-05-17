import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {openLink} from '../../../screen/userProfile/SocialMedia';
import {IconType} from '../../../helper/Constants';

let deviceWidth = Dimensions.get('window').width;

export const generateView = (iconColor, icon, type, clickEvent) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          clickEvent();
        }}
        style={{
          flex: 1,
          borderRadius: scale(10),
          margin: scale(6),
          maxWidth: deviceWidth / 3 - scale(25),
          minWidth: deviceWidth / 3 - scale(25),
          height: scale(90),
          justifyContent: 'center',
          alignItems: 'center',
          padding: scale(6),
          backgroundColor: '#f8f8f8',
        }}
        activeOpacity={1}>
        <GlobalInclude.BaseIcon
          containerStyle={{height: scale(40), width: scale(40)}}
          iconColor={iconColor}
          iconName={icon}
          iconSize={scale(32)}
          iconType={type}
        />
      </TouchableOpacity>
    </View>
  );
};

const Tags = ({content}) => (
  <ScrollView style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15]}>
    <View>
      {(content.facebook !== undefined &&
        content.facebook !== null &&
        content.facebook !== '') ||
      (content.twitter !== undefined &&
        content.twitter !== null &&
        content.twitter !== '') ||
      (content.wiki !== undefined &&
        content.wiki !== null &&
        content.wiki !== '') ? (
        <View
          style={{
            marginVertical: scale(5),
            marginHorizontal: scale(5),
            backgroundColor: '#ffffff',
            borderRadius: scale(10),
            shadowColor: '#333333',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 3,
            padding: scale(6),
            flexDirection: 'row',
          }}>
          {content.facebook !== undefined &&
            content.facebook !== null &&
            content.facebook !== '' &&
            generateView('#3b5998', 'facebook', IconType[4], () => {
              openLink(content.facebook);
            })}
          {content.twitter !== undefined &&
            content.twitter !== null &&
            content.twitter !== '' &&
            generateView('#55acee', 'twitter', IconType[4], () => {
              openLink(content.twitter);
            })}
          {content.wiki !== undefined &&
            content.wiki !== null &&
            content.wiki !== '' &&
            generateView('#222222', 'wikipedia-w', IconType[4], () => {
              openLink(content.wiki);
            })}
        </View>
      ) : null}

      {content.tags &&
      content.tags !== undefined &&
      content.tags !== null &&
      content.tags.length > 0 ? (
        <View style={grid.displayinlineBlock}>
          {content.tags.map((v, i) => {
            return (
              <TouchableOpacity
                key={i.toString()}
                style={{margin: scale(4)}}
                activeOpacity={1}>
                <View style={[g.tagStyle, grid.rowdir]}>
                  <Text style={[g.tagTxtStyle, g.mr10]}>{v}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={GlobalInclude.AppStyle.center}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            Currently No Data Uploaded!
          </Text>
        </View>
      )}
    </View>
  </ScrollView>
);

export default Tags;
