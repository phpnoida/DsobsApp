/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  Clipboard,
  Alert,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import {IconType} from '../../helper/Constants';
import {generateView} from '../../component/Common';

const Contact = props => {
  const openEmail = email => {
    Linking.openURL('mailto:' + `${email}` + '?subject= ');
  };

  const openDialler = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number.trim()}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };

  const setContent1 = (code, visivility) => {
    Clipboard.setString(code);
    Alert.alert(
      '',
      global.I18n.t('ref').copied,
      [
        {
          text: global.I18n.t('do_my_contract').ok,
          onPress: () => console.log('OK Pressed'),
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={{paddingStart: scale(15), paddingEnd: scale(15), flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{padding: scale(5)}}>
          {props.phone
            ? generateView(
                IconType[2],
                'phone',
                'Primary Phone No.',
                props.phoneScope === 0
                  ? 'Set to Private'
                  : (props.countryCode ? props.countryCode + ' ' : ' ') +
                      props.phone,
                () => {
                  openDialler(
                    (props.countryCode ? props.countryCode + ' ' : ' ') +
                      props.phone,
                  );
                },
              )
            : null}

          {props.email
            ? generateView(
                IconType[2],
                'envelope',
                'Primary Email',
                props.emailScope === 0 ? 'Set to Private' : props.email,
                () => {
                  openEmail(props.email);
                },
              )
            : null}

          {generateView(
            IconType[4],
            'birthday-cake',
            'Date Of Birth',
            props.dob,
            () => {},
          )}

          {generateView(
            IconType[4],
            'user-o',
            'Nickname',
            props.petName ? props.petName : 'N/A',
            () => {},
          )}
          {props.secondaryPhone.length > 0 && (
            <View>
              {generateView(
                IconType[2],
                'phone',
                'Secondary Phone No.',
                props.secondaryPhoneScope === 0
                  ? 'Set to Private'
                  : (props.secondaryCountryCode
                      ? props.secondaryCountryCode + ' '
                      : ' ') + props.secondaryPhone,
                () => {
                  openDialler(
                    (props.secondaryCountryCode
                      ? props.secondaryCountryCode + ' '
                      : ' ') + props.secondaryPhone,
                  );
                },
              )}
            </View>
          )}

          {props.secondaryEmail.length > 0 && (
            <View>
              {generateView(
                IconType[2],
                'envelope',
                'Secondary Email',
                props.secondaryEmailScope === 0
                  ? 'Set to Private'
                  : props.secondaryEmail,
                () => {
                  openEmail(props.email);
                },
              )}
            </View>
          )}

          {generateView(
            '',
            '',
            'Permanent Address',
            props.permanentAddress
              ? props.permanentAddress.replace(/\\n/g, ' ')
              : 'N/A',
            () => {},
          )}
          {props.correspondenceAddress.length > 0 && (
            <View>
              {generateView(
                '',
                '',
                'Current Address',
                props.correspondenceAddress.replace(/\\n/g, ' '),
                () => {},
              )}
            </View>
          )}

          {generateView(
            '',
            '',
            'Other Information',
            `Blood Group: ${
              props.bloodGroup ? props.bloodGroup : "I Don't Know"
            }`,
            () => {},
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Contact;
