import React, {useLayoutEffect} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {AppCommitteeList} from './Data';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {ScrollView} from 'react-native-gesture-handler';

const AppCommittee = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderBar
          navigation={navigation}
          title={'DSOBS Executive Committee'}
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
          {AppCommitteeList.map((item, i) => {
            return (
              <View key={i} style={[grid.rowrow, g.pb10]}>
                <Text style={[grid.col, g.fs13, g.FHNM, g.colorBlack, g.pr10]}>
                  {item.name}
                </Text>
                <Text style={[g.fs13, g.FHNM, g.colorBlack, g.w60]}>
                  {item.year}
                </Text>
                <Text style={[grid.col, g.fs13, g.FHNM, g.colorBlack, g.pr10]}>
                  {item.post}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AppCommittee;
