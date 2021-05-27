import React, {useLayoutEffect} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {
  RegionalChapterOne,
  RegionalChapterTwo,
  RegionalChapterThree,
} from './Data';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {ScrollView} from 'react-native-gesture-handler';
import {APP_NAME} from '../../helper/Constants';
const AppChapters = ({navigation}) => {
  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar
        navigation={navigation}
        title={`${APP_NAME} Regional Chapter Reps`}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.ViewStyle}>
        <ScrollView
          style={[g.p10, g.bgWhite]}
          showsVerticalScrollIndicator={false}>
          {RegionalChapterOne.map((item, i) => {
            return (
              <View key={i} style={[grid.rowrow, g.pb10]}>
                <Text style={[grid.col, g.fs12, g.FHNB, g.colorBlack, g.pr10]}>
                  {item.name}
                </Text>
                <Text style={[g.w60, g.fs13, g.colorBlack]}>{item.year}</Text>
                <Text
                  style={[grid.col, g.fs13, g.colorBlack, grid.flex, g.pl5]}>
                  {item.post}
                </Text>
              </View>
            );
          })}

          {RegionalChapterTwo.map((item, i) => {
            return (
              <View key={i} style={[grid.rowrow, g.pb10]}>
                <Text style={[grid.col, g.fs12, g.FHNB, g.colorBlack, g.pr10]}>
                  {item.name}
                </Text>
                <Text style={[g.w60, g.fs13, g.colorBlack]}>{item.year}</Text>
                <Text
                  style={[grid.col, g.fs13, g.colorBlack, grid.flex, g.pl5]}>
                  {item.post}
                </Text>
              </View>
            );
          })}

          {/* {RegionalChapterThree.map((item, i) => {
            return (
              <View key={i} style={[grid.rowrow, g.pb10]}>
                <Text style={[grid.col, g.fs13, g.FHNB, g.colorBlack, g.pr10]}>
                  {item.name}
                </Text>
                <Text style={[g.w60, g.fs13, g.colorBlack]}>{item.year}</Text>
                <Text
                  style={[grid.col, g.fs13, g.colorBlack, grid.flex, g.pl5]}>
                  {item.post}
                </Text>
              </View>
            );
          })} */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AppChapters;
