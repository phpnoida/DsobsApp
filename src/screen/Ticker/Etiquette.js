import React from 'react';
import {View, StyleSheet, SafeAreaView, Text, ScrollView} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {APP_NAME} from '../../helper/Constants';

const Etiquette = ({navigation}) => {
  const showText = (text) => {
    return (
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
        {text}
      </Text>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar
        title={'TCR Etiquette'}
        navigation={navigation}
        showBack={true}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[g.ml10, g.mr10, g.pt15, g.pb15]}>
          <View style={[grid.justifyContentCenter, grid.alignItems]}>
            <Text
              style={[
                g.fs15,
                g.FHNB,
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
              "Knowledge Our Light"
            </Text>
          </View>

          {showText(
            'The idea of the Common Room is to create a space for new thought, stimulation, conversation and engagement.',
          )}
          <View style={{marginVertical: scale(3)}} />
          {showText(
            'To create an intellectual space for creative, constructive and thought provoking  posts, comments, articles, videos and perspectives. ',
          )}
          <View style={{marginVertical: scale(3)}} />
          {showText('You can make 10 posts a week.')}
          <View style={{marginVertical: scale(3)}} />
          {showText("Please don't post in anger.")}
          <View style={{marginVertical: scale(3)}} />
          {showText(
            'Please refrain from political posts even though these are very critical times for the country. We plan to have those conversations in private like minded groups. ',
          )}
          <View style={{marginVertical: scale(3)}} />
          {showText(
            `The ${APP_NAME} admins retain the right to remove objectionable posts.`,
          )}
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
