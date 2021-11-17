import React from 'react';
import {View, SafeAreaView, Text, ScrollView} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {scale} from '../../theme/Scalling';
import {APP_NAME} from '../../helper/Constants';
import g from '../../theme/global';

const AboutYellowPage = ({navigation}) => {
  const showText = (text, customStyle) => {
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
            ...customStyle,
          },
        ]}>
        {text}
      </Text>
    );
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar
        title={'About Yellow Pages'}
        navigation={navigation}
        showBack={true}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[g.ml10, g.mr10, g.pt15, g.pb15]}>
          {showText('"Knowledge Our Light"', {
            textAlign: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            textAlignVertical: 'center',
          })}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'The idea of the Common Room is to create a space for new thought, stimulation, conversation and engagement.',
            {},
          )}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'To create an intellectual space for creative, constructive and thought provoking posts, comments, articles, videos and perspectives.',
            {},
          )}
          <View style={{marginVertical: scale(12)}} />
          {showText('You can make 10 posts a week.', {})}
          <View style={{marginVertical: scale(12)}} />
          {showText("Please don't post in anger.", {})}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'Please refrain from political posts even though these are very critical times for the country. We plan to have those conversation in private like minded groups.',
            {},
          )}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            `The ${APP_NAME} adminsretain the right to remove objectionable posts.`,
            {},
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AboutYellowPage;
