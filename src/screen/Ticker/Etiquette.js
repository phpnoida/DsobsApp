import React from 'react';
import {View, StyleSheet, SafeAreaView, Text, ScrollView} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';

const Etiquette = ({navigation}) => {
  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar title={'Etiquette'} navigation={navigation} showBack={true} />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[g.ml10, g.mr10, g.pt15, g.pb15]}>
          <Text
            style={[
              g.fs15,
              g.colorBlack,
              {
                textAlign: 'justify',
                justifyContent: 'center',
                alignContent: 'center',
                textAlignVertical: 'center',
                letterSpacing: 1,
                lineHeight: 25,
              },
            ]}>
            In publishing and graphic design, Lorem ipsum is a placeholder text
            commonly used to demonstrate the visual form of a document or a
            typeface without relying on meaningful content. Lorem ipsum may be
            used as a placeholder before final copy is available.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  tabBarStyle: {borderBottomWidth: 0, margin: 0},
  tabBarUnderlineStyle: {
    borderBottomColor: 'transparent',
    backgroundColor: 'white',
  },
  tabTextStyle: {
    fontSize: scale(15),
    fontFamily: 'Lato-Regular',
    margin: -5,
  },
});

export default Etiquette;
