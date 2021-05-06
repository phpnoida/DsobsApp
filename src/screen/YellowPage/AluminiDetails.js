import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import ProgresImage from '../../component/ProgresImage';
import Helper from '../../helper/Helper';

const {width} = Dimensions.get('window');

const showTaggedUsers = (navigation, users) => {
  let componentArray = [];

  for (let i = 0; i < users.length; i++) {
    let item = users[i];
    const component = (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('UserProfile', {
            userId: item._id,
          });
        }}
        key={i}
        style={[
          g.ml10,
          g.mb5,
          {
            width: width / 3 - 40,
            marginRight: 10,
          },
          users.length > 2
            ? {justifyContent: 'center', alignSelf: 'center'}
            : {},
        ]}>
        <View
          activeOpacity={0.8}
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={[
              g.bglightGray,
              g.oh,
              {
                borderRadius: 100,
                justifyContent: 'center',
                alignSelf: 'center',
              },
            ]}>
            <ProgresImage
              source={
                item.profileImg !== null &&
                item.profileImg !== undefined &&
                item.profileImg !== ''
                  ? {uri: item.profileImg}
                  : GlobalInclude.Assets.DefaultProfile
              }
              containerStyle={{
                aspectRatio: 1 / 1,
                height: scale(70),
                alignSelf: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}
              mode={'cover'}
            />
          </View>
          <View style={{height: 65, width: 100}}>
            <Text
              style={[
                g.fs14,
                g.FHNR,
                g.txtCenter,
                g.colorBlack,
                g.mt10,
                GlobalInclude.AppStyle.transform,
              ]}
              numberOfLines={2}>
              {Helper.concatName(item)}
            </Text>
            <Text
              style={[
                g.fs14,
                g.FHNR,
                g.txtCenter,
                g.colorGray1,
                grid.alignItems,
                g.mt10,
              ]}>
              {item.designation !== null &&
              item.designation !== undefined &&
              item.designation !== ''
                ? item.designation
                : 'N/A'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );

    componentArray.push(component);
  }
  return componentArray;
};

const AluminiDetails = ({content, navigation}) => (
  <ScrollView
    style={[g.pl10, g.pr10, grid.flex1]}
    contentContainerStyle={g.pb30}
    showsVerticalScrollIndicator={false}>
    <View style={g.p5}>
      {content.alumniInBusiness &&
      content.alumniInBusiness !== undefined &&
      content.alumniInBusiness !== null &&
      content.alumniInBusiness.length > 0 ? (
        <View style={grid.displayinlineBlock}>
          {showTaggedUsers(navigation, content.alumniInBusiness)}
        </View>
      ) : (
        <Text style={[g.colorLightGray, g.fs16, g.FHNR]}>N/A</Text>
      )}
    </View>
  </ScrollView>
);

export default AluminiDetails;
