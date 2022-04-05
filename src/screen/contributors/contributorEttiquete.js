import React from 'react';
import {View, SafeAreaView, Text, ScrollView} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {APP_NAME} from '../../helper/Constants';

const ContributorEttiquete = ({navigation}) => {
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
        title={'Contributions'}
        navigation={navigation}
        showBack={true}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[g.ml10, g.mr10, g.pt15, g.pb15]}>
          {showText(
            'The Contributions and Endowments module of the application was created to allow members of our community to donate/contribute funds to various projects. Be they directly to our school, society or social initiatives undertaken by individuals within the community.',
          )}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'You can contribute funds as an Indian citizen or as a foreign citizen, not as both. An Indian citizen can request an ATG certificate for their income tax returns.',
          )}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'You can contribute funds in multiple tranches, the sum total of your contributions will be displayed. You can also contribute anonymously. The last chosen privacy settings will be assumed to be applicable to your contributions.',
          )}
          <View style={{marginVertical: scale(12)}} />
          {showText(
            'We hope this can be a powerful tool in mobilizing funds towards different worthy projects for our community and the greater good.',
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ContributorEttiquete;
