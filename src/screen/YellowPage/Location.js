import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import ProgresImage from '../../component/ProgresImage';
import {IconType} from '../../helper/Constants';

const Location = ({params}) => (
  <ScrollView
    style={[g.pl10, g.pr10, grid.flex1]}
    contentContainerStyle={g.pb30}
    showsVerticalScrollIndicator={false}>
    <View style={{padding: scale(5), paddingBottom: scale(70)}}>
      <View style={[g.bggray3, {borderRadius: scale(10)}]}>
        <ProgresImage
          source={GlobalInclude.Assets.DummyMap}
          containerStyle={{height: scale(110), borderRadius: scale(10)}}
          imageStyle={{
            height: scale(110),
            borderRadius: scale(10),
          }}
          mode={'cover'}
        />

        <View
          style={{
            position: 'absolute',
            right: 0,
            zIndex: 2,
            height: '100%',
            width: scale(64),
            backgroundColor: 'rgba(62,62,62,0.5)',
            borderRadius: scale(10),
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <ProgresImage
            source={GlobalInclude.Assets.MapLocation}
            containerStyle={{height: scale(36), width: scale(36)}}
            imageStyle={{
              height: scale(36),
              width: scale(36),
            }}
            mode={'cover'}
          />
        </View>
      </View>
      <View style={[g.boxShadow, g.bgWhite, g.br3, g.p5, g.mt20]}>
        <View style={[grid.rowdir, grid.alignItems]}>
          <View style={[grid.col, g.pl15]}>
            <Text style={[g.colordarkGray, g.fs16, g.FHNB, g.mb5]}>
              Business Location
            </Text>
            <Text style={[g.colorLightGray, g.fs14, g.FHNR]}>
              Incred Applications Pvt. Ltd.
            </Text>
            <Text style={[g.colorLightGray, g.fs14, g.FHNR]}>
              F - 43, Sector 8
            </Text>
            <Text style={[g.colorLightGray, g.fs14, g.FHNR]}>
              Noida - 201301
            </Text>
            <Text style={[g.colorLightGray, g.fs14, g.FHNR]}>India</Text>
          </View>
        </View>
      </View>
    </View>
  </ScrollView>
);

export default Location;
