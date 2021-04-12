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

const {width} = Dimensions.get('window');

const showTaggedUsers = (userTag) => {
  let componentArray = [];

  for (let i = 0; i < userTag; i++) {
    const component = (
      <View
        key={i}
        style={[
          g.ml10,
          g.mb5,
          {
            width: width / 3 - 40,
            marginRight: 10,
            justifyContent: 'center',
            alignSelf: 'center',
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {}}
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
                alignSelf: 'center',
              }}
              mode={'cover'}
            />
          </View>
          <View style={{height: 65, width: 100}}>
            <Text
              style={[g.fs14, g.FHNR, g.txtCenter, g.colorBlack, g.mt10]}
              numberOfLines={2}>
              John Karter
            </Text>
            <Text style={[g.fs14, g.FHNR, g.txtCenter, g.colorGray1]}>CEO</Text>
          </View>
        </TouchableOpacity>
      </View>
    );

    componentArray.push(component);
  }
  return componentArray;
};

const AluminiDetails = ({params}) => (
  <ScrollView
    style={[g.pl10, g.pr10, grid.flex1]}
    contentContainerStyle={g.pb30}
    showsVerticalScrollIndicator={false}>
    <View style={g.p5}>
      <View style={[grid.row, grid.flexwrap]}>{showTaggedUsers(7)}</View>
    </View>
  </ScrollView>
);

export default AluminiDetails;
