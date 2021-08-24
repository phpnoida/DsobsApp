import React, {useLayoutEffect} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {AppCommitteeList} from './Data';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {ScrollView} from 'react-native-gesture-handler';
import {APP_NAME} from '../../helper/Constants';
const AppCommittee = ({navigation}) => {
  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar
        navigation={navigation}
        title={`${APP_NAME} Executive Committee`}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.ViewStyle}>
        <ScrollView
          style={[g.p10, g.bgWhite]}
          showsVerticalScrollIndicator={false}>
          {AppCommitteeList.map((item, i) => {
            return (
              <View key={i} style={[grid.rowrow, g.pb10]}>
                <Text style={[grid.col, g.fs13, g.FHNM, g.colorBlack, g.pr10]}>
                  {item.name}
                </Text>
                {/* {item.year !== undefined && (
                  <Text style={[g.fs13, g.FHNM, g.colorBlack, g.w60]}>
                    {item.year}
                  </Text>
                )} */}
                <Text style={[grid.col, g.fs13, g.FHNM, g.colorBlack, g.pr10]}>
                  {item.post}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AppCommittee;
