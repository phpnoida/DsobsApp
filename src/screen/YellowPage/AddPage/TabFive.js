import React from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import NextPreviousButton from '../../../component/NextPreviousButton';

const TabFive = ({
  onSaveTab,
  onPreviousTab,
  handleInput,
  contactPerson,
  designation,
  phoneContact,
  emailAddress,
  whatsApp,
  whatsappCountryCode,
  phoneCountryCode,
  address,
  webLink,
  errorMessage,
  loader,
  inEditMode,
  openCounryCodePicker,
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
            {generateHeader('Company Contact Person', true)}
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
            {generateHeader('Contact Number', true)}
            <View
              style={[grid.rowdir, g.bglightGray, {borderRadius: scale(6)}]}>
              <TouchableOpacity
                activeOpacity={1}
                style={[g.countryCode]}
                onPress={() => {
                  openCounryCodePicker(1);
                }}>
                <Text style={[g.colordarkGray, g.FHNR, g.txtCenter]}>
                  {phoneCountryCode}
                </Text>
              </TouchableOpacity>
              <View style={[grid.col]}>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={[
                    g.inputGrayLogin,
                    g.mb0,
                    g.pt5,
                    g.pb5,
                    {borderTopLeftRadius: 0, borderBottomLeftRadius: 0},
                  ]}
                  maxLength={12}
                  keyboardType={'phone-pad'}
                  returnKeyType={'done'}
                  value={phoneContact}
                  placeholder="Phone Number"
                  onChangeText={(value) => handleInput('phoneContact', value)}
                  placeholderTextColor={'#ddd'}
                />
              </View>
            </View>

            {errorMessage.phoneContact &&
              errorMessage.phoneContact.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.phoneContact}
                </Text>
              )}
          </View>
          <View style={g.mb15}>
            {generateHeader('Email Address', true)}
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
            <View
              style={[grid.rowdir, g.bglightGray, {borderRadius: scale(6)}]}>
              <TouchableOpacity
                activeOpacity={1}
                style={[g.countryCode]}
                onPress={() => {
                  openCounryCodePicker(2);
                }}>
                <Text style={[g.colordarkGray, g.FHNR, g.txtCenter]}>
                  {whatsappCountryCode}
                </Text>
              </TouchableOpacity>
              <View style={[grid.col]}>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={[
                    g.inputGrayLogin,
                    g.mb0,
                    g.pt5,
                    g.pb5,
                    {borderTopLeftRadius: 0, borderBottomLeftRadius: 0},
                  ]}
                  maxLength={12}
                  keyboardType={'phone-pad'}
                  returnKeyType={'done'}
                  value={whatsApp}
                  placeholder="Phone Number"
                  onChangeText={(value) => handleInput('whatsApp', value)}
                  placeholderTextColor={'#ddd'}
                />
              </View>
            </View>
            {errorMessage.whatsApp && errorMessage.whatsApp.length > 0 && (
              <Text style={[g.errorMsg, g.pt5]}>{errorMessage.whatsApp}</Text>
            )}
          </View>
          <View style={g.mb15}>
            {generateHeader('Company Address', true)}
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
        nextTitle={inEditMode ? 'Update Now' : 'Save'}
        onSaveTab={() => {
          onSaveTab();
        }}
      />
    </View>
  );
};

export default TabFive;
