import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';

const AboutCompany = ({content}) => (
  <ScrollView style={grid.flex1} showsVerticalScrollIndicator={false}>
    <View style={{padding: scale(10), paddingBottom: scale(70)}}>
      {content.aboutTheBusiness &&
      content.aboutTheBusiness !== undefined &&
      content.aboutTheBusiness !== null ? (
        <View style={[g.boxShadow, g.bgWhite, g.br3, g.p5]}>
          <View style={[grid.rowdir, grid.alignItems]}>
            <View style={[grid.col, g.p10]}>
              <Text style={[g.colorLightGray, g.fs16, g.FHNR]}>
                {content.aboutTheBusiness}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={GlobalInclude.AppStyle.fillCenter}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            Currently No Data Uploaded!
          </Text>
        </View>
      )}
    </View>
  </ScrollView>
);

export default AboutCompany;
