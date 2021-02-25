import React, {useLayoutEffect} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {AppRepresentivesList} from './Data';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {ScrollView} from 'react-native-gesture-handler';

const AppRepresentives = ({navigation}) => {
  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar navigation={navigation} title={'Dsobs Memorandum and Rules'} />
      <SafeAreaView style={GlobalInclude.AppStyle.ViewStyle}>
        <ScrollView
          style={[g.p10, g.bgWhite]}
          showsVerticalScrollIndicator={false}>
          {AppRepresentivesList.map((item, i) => {
            return (
              <View key={i} style={[grid.rowrow, g.pb10]}>
                <Text style={[g.w80, g.fs14, g.colorBlack]}>{item.year}</Text>
                <Text style={[grid.col, g.fs14, g.colorBlack, g.pr5]}>
                  {item.name}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AppRepresentives;
