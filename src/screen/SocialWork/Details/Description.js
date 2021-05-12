import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';

const Description = ({content}) => (
  <View>
    {content.aboutTheBusiness &&
    content.aboutTheBusiness !== undefined &&
    content.aboutTheBusiness !== null ? (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{padding: scale(10), paddingBottom: scale(70)}}>
          <View style={[g.boxShadow, g.bgWhite, g.br3, g.p5]}>
            <View style={[grid.rowdir, grid.alignItems]}>
              <View style={[grid.col, g.p10]}>
                <Text style={[g.colorLightGray, g.fs16, g.FHNR]}>
                  {content.aboutTheBusiness}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    ) : (
      <View>
        {/* <View style={GlobalInclude.AppStyle.center}>
        <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
          Currently No Data Uploaded!
        </Text>
      </View> */}
        <View
          style={{
            padding: scale(10),
            paddingBottom: scale(70),
          }}>
          <View style={[g.boxShadow, g.bgWhite, g.br3, g.p5]}>
            <View style={[grid.rowdir, grid.alignItems]}>
              <View style={[grid.col, g.p10]}>
                <Text style={[g.colorLightGray, g.fs14, g.FHNR]}>
                  In publishing and graphic design, Lorem ipsum is a placeholder
                  text commonly used to demonstrate the visual form of a
                  document or a typeface without relying on meaningful content
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )}
  </View>
);

export default Description;
