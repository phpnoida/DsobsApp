import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import NextPreviousButton from '../../../component/NextPreviousButton';
import CommonButton from '../../../component/CommonButton';

let selectedIndex = -1;
const TabFive = ({
  onSaveTab,
  onPreviousTab,
  handleInput,
  contactPerson,
  designation,
  phoneContact,
  emailAddress,
  whatsApp,
  address,
  webLink,
  errorMessage,
  loader,
}) => {
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
              value={contactPerson}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {
                handleInput('contactPerson', value);
              }}
            />
            {errorMessage.contactPerson &&
              errorMessage.contactPerson.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.contactPerson}
                </Text>
              )}
          </View>
          <View style={g.mb15}>
            {generateHeader('Designation', false)}
            <TextInput
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              value={designation}
              maxLength={100}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {
                handleInput('designation', value);
              }}
            />
            {errorMessage.designation &&
              errorMessage.designation.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.designation}
                </Text>
              )}
          </View>
          <View style={g.mb15}>
            {generateHeader('Contact Number', false)}
            <TextInput
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              maxLength={12}
              value={phoneContact}
              keyboardType={'phone-pad'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {
                handleInput('phoneContact', value);
              }}
            />
            {errorMessage.phoneContact &&
              errorMessage.phoneContact.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.phoneContact}
                </Text>
              )}
          </View>
          <View style={g.mb15}>
            {generateHeader('Email Address', false)}
            <TextInput
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              maxLength={264}
              value={emailAddress}
              keyboardType={'email-address'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {
                handleInput('emailAddress', value);
              }}
            />
            {errorMessage.emailAddress &&
              errorMessage.emailAddress.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.emailAddress}
                </Text>
              )}
          </View>
          <View style={g.mb15}>
            {generateHeader('WhatsApp Number', false)}
            <TextInput
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              maxLength={12}
              value={whatsApp}
              keyboardType={'phone-pad'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {
                handleInput('whatsApp', value);
              }}
            />
            {errorMessage.whatsApp && errorMessage.whatsApp.length > 0 && (
              <Text style={[g.errorMsg, g.pt5]}>{errorMessage.whatsApp}</Text>
            )}
          </View>
          <View style={g.mb15}>
            {generateHeader('Company Address', false)}
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={6}
              multiline={true}
              value={address}
              style={[
                g.inputWhite,
                {height: scale(100), textAlignVertical: 'top'},
              ]}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {
                handleInput('address', value);
              }}
            />
            {errorMessage.address && errorMessage.address.length > 0 && (
              <Text style={[g.errorMsg, g.pt5]}>{errorMessage.address}</Text>
            )}
          </View>
          <View style={g.mb15}>
            {generateHeader('Website Link', false)}
            <TextInput
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              maxLength={100}
              value={webLink}
              keyboardType={'default'}
              returnKeyType={'done'}
              placeholder={'Paste Web-Link here'}
              onChangeText={(value) => {
                handleInput('webLink', value);
              }}
            />
            {errorMessage.webLink && errorMessage.webLink.length > 0 && (
              <Text style={[g.errorMsg, g.pt5]}>{errorMessage.webLink}</Text>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
      <NextPreviousButton
        isLoading={loader}
        prviousTitle={'Previous'}
        onPreviuosTab={() => {
          onPreviousTab();
        }}
        nextTitle={'Save'}
        onSaveTab={() => {
          onSaveTab();
        }}
      />
    </View>
  );
};

export default TabFive;
