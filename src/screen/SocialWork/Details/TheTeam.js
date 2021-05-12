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
import ProgresImage from '../../../component/ProgresImage';

const {width} = Dimensions.get('window');

const showTaggedUsers = (navigation, users) => {
  let componentArray = [];

  for (let i = 0; i < 4; i++) {
    //let item = users[i];
    const component = (
      <TouchableOpacity
        onPress={() => {
          //   navigation.navigate('UserProfile', {
          //     userId: item._id,
          //   });
        }}
        key={i}
        style={[
          g.ml10,
          g.mb5,
          {
            width: width / 3 - 40,
            marginRight: 10,
          },
          users > 2 ? {justifyContent: 'center', alignSelf: 'center'} : {},
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
              source={GlobalInclude.Assets.DefaultProfile}
              containerStyle={{
                aspectRatio: 1 / 1,
                height: scale(70),
                alignSelf: 'center',
                justifyContent: 'center',
              }}
              mode={'cover'}
            />
          </View>
          <View style={{flex: 1}}>
            <Text
              style={[
                g.fs12,
                g.FHNR,
                g.txtCenter,
                g.colorBlack,
                g.mt10,
                GlobalInclude.AppStyle.transform,
              ]}>
              {`Participant ${i + 1}`}
            </Text>
            <Text
              style={[
                g.fs14,
                g.FHNR,
                g.txtCenter,
                g.colorGray1,
                g.mt5,
                GlobalInclude.AppStyle.transform,
              ]}
              numberOfLines={2}>
              Rahul Kumar
            </Text>
            <Text
              style={[
                g.fs14,
                g.FHNR,
                g.txtCenter,
                g.colorGray1,
                grid.alignItems,
                g.mt5,
              ]}>
              {'2021'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );

    componentArray.push(component);
  }
  return componentArray;
};

const TheTeam = ({content, navigation}) => (
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
        <View>
          <View style={grid.displayinlineBlock}>
            {showTaggedUsers(navigation, 2)}
          </View>
          {/* <View style={GlobalInclude.AppStyle.center}>
            <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
              Currently No Data Uploaded!
            </Text>
          </View> */}
        </View>
      )}
    </View>
  </ScrollView>
);

export default TheTeam;
