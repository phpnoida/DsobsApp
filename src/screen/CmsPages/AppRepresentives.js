import React, {useLayoutEffect} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {AppRepresentivesList} from './Data';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {ScrollView} from 'react-native-gesture-handler';

const AppRepresentives = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderBar
          navigation={navigation}
          title={'Dsobs Memorandum and Rules'}
        />
      ),
    });
    return () => {};
  }, [navigation]);

  return (
    <SafeAreaView style={GlobalInclude.AppStyle.fill}>
      <View style={GlobalInclude.AppStyle.parentStyle}>
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
      </View>
    </SafeAreaView>
  );
};

export default AppRepresentives;
