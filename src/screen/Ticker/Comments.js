import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import ProgressImage from '../../component/ProgresImage';

const Comments = ({comments}) => {
  return (
    <View>
      {comments.map((item, index) => {
        return (
          <View style={[g.mb10]}>
            <View style={[grid.rowdir]}>
              <View
                style={[
                  g.mr10,
                  g.bggray,
                  g.oh,
                  {
                    width: scale(40),
                    height: scale(40),
                    borderRadius: scale(50),
                  },
                ]}>
                <ProgressImage
                  source={GlobalInclude.Assets.DefaultProfile}
                  containerStyle={{
                    aspectRatio: 1 / 1,
                    alignSelf: 'center',
                    width: scale(40),
                    justifyContent: 'center',
                  }}
                  mode={'cover'}
                />
              </View>
              <View style={grid.flex1}>
                <View style={[grid.alignItemsTop]}>
                  <Text style={[g.fs15, g.FHNM, g.colorBlue]}>
                    John Karter - 1994
                  </Text>
                </View>
                <Text
                  numberOfLines={3}
                  style={[
                    g.fs12,
                    g.FHNR,
                    g.colorBlack,
                    g.txtCenterVertical,
                    g.mt5,
                    {textAlign: 'justify'},
                  ]}>
                  In publishing and graphic design, Lorem ipsum is a placeholder
                  text commonly used to demonstrate the visual form of a
                  document or a typeface without relying on meaningful content.
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default Comments;
