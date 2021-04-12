import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import NextPreviousButton from '../../component/NextPreviousButton';
import CommonButton from '../../component/CommonButton';

let selectedIndex = -1;
const TabFive = ({onSaveTab, onPreviousTab}) => {
  const generateHeader = (title, required) => {
    return (
      <View style={[grid.rowdir, grid.alignItemsTop]}>
        <Text style={g.labeltext1}>{title}</Text>
        {required && <Text style={g.colorRed}>*</Text>}
      </View>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15, g.pt20]}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        style={grid.flex1}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={g.pb30}>
          <View style={g.mb15}>
            {generateHeader('Company Contact Person', false)}
            <TextInput
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              maxLength={100}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {}}
            />
          </View>
          <View style={g.mb15}>
            {generateHeader('Designation', false)}
            <TextInput
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              maxLength={100}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {}}
            />
          </View>
          <View style={g.mb15}>
            {generateHeader('Contact Number', false)}
            <TextInput
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              maxLength={100}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {}}
            />
          </View>
          <View style={g.mb15}>
            {generateHeader('Email Address', false)}
            <TextInput
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              maxLength={100}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {}}
            />
          </View>
          <View style={g.mb15}>
            {generateHeader('WhatsApp Number', false)}
            <TextInput
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              maxLength={100}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {}}
            />
          </View>
          <View style={g.mb15}>
            {generateHeader('Company Address', false)}
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={6}
              multiline={true}
              style={[
                g.inputWhite,
                {height: scale(100), textAlignVertical: 'top'},
              ]}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {}}
            />
          </View>
          <View style={g.mb15}>
            {generateHeader('Website Link', false)}
            <TextInput
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              maxLength={100}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Paste Web-Link here'}
              onChangeText={(value) => {}}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: scale(150),
          paddingTop: scale(10),
          paddingBottom: scale(10),
          alignContent: 'center',
          alignSelf: 'center',
        }}>
        <CommonButton
          showLoader={false}
          title={'Save'}
          onPress={() => {
            onSaveTab();
          }}
        />
      </View>
    </View>
  );
};

export default TabFive;
