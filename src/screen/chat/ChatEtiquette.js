import React from 'react';
import {View, SafeAreaView, Text, ScrollView} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {APP_NAME} from '../../helper/Constants';

const ChatEtiquette = ({navigation}) => {
  const showText = text => {
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
        title={'Chat Etiquette'}
        navigation={navigation}
        showBack={true}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[g.ml10, g.mr10, g.pt15, g.pb15]}>
          {showText('Please use the Chat module for personal conversations.')}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'These conversations are private and cannot be viewed by the App Admin. So please maintain the necessary decorum.',
          )}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'Please see that your conversations with other members of our community are respectful, mind their privacy and should not appear as spam or unwarranted solicitation. ',
          )}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'Any illegal materials, content or conversations uploaded will be prosecutable by law.',
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ChatEtiquette;
