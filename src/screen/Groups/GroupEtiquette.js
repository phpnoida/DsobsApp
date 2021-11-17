import React from 'react';
import {View, SafeAreaView, Text, ScrollView} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';

const GroupEtiquette = ({navigation}) => {
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
        title={'About Groups'}
        navigation={navigation}
        showBack={true}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[g.ml10, g.mr10, g.pt15, g.pb15]}>
          {showText(
            'The Groups Module was created to enable Doscos to connect with each other based on their common interests across different age groups. (Eg. The Indian Cricket Group; Dosco Photographers; Arsenal FC Fan Club; Dosco Film Club - Arthouse/Foreign Lang).',
          )}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'We would like to use this as a space for free speech and open conversations.',
          )}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'To create a new group, please send a request from the App and await Admin approval.',
          )}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'New Members can request to join a new group and the Admin allows them in. Admin reserve the right to remove objectionable content and members who behave inappropriately.',
          )}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'We also have batch groups where only users from a particular batch or users approved by the group admin can have access.',
          )}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'Please see that your posts in groups are respectful, helpful, mind the privacy of individuals and don’t appear as spam or unwarranted solicitation.',
          )}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'Any illegal materials, content or conversations uploaded will be prosecutable by laws governing India and your location.',
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default GroupEtiquette;
