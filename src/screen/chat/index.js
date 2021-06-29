import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import TopHeaderView from '../../component/TopHeaderView';

const ChatUserList = ({navigation}) => {
  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <TopHeaderView
        index={7}
        navigation={navigation}
        label={'Chat'}
        showLabel={false}
        onLabelPress={() => {
          navigation.navigate('ListMyWork');
        }}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.fill}></View>
      </SafeAreaView>
    </View>
  );
};

export default ChatUserList;
