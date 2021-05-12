/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import g from '../../theme/global';
import Globalinclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import {IconType} from '../../helper/Constants';

let deviceWidth = Dimensions.get('window').width;

export const generateView = (iconColor, icon, type, clickEvent) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          clickEvent();
        }}
        style={styles.mediaButtonContainer}
        activeOpacity={1}>
        <Globalinclude.BaseIcon
          containerStyle={{height: scale(40), width: scale(40)}}
          iconColor={iconColor}
          iconName={icon}
          iconSize={scale(32)}
          iconType={type}
        />
      </TouchableOpacity>
    </View>
  );
};

const SocialMedia = (props) => {
  const {profileData} = props;
  const {
    fb,
    insta,
    gplus,
    wiki,
    youtube,
    twitter,
    whatsapp,
    linkedinUrl,
  } = profileData;

  const openLink = (link) => {
    Linking.canOpenURL(link).then((status) => {
      if (status) {
        Linking.openURL(link).catch(() => {
          Alert.alert('Unable to open link!');
        });
      } else {
        Alert.alert('Invalid link!');
      }
    });
  };

  return (
    <View style={{paddingStart: scale(15), paddingEnd: scale(15), flex: 1}}>
      <View style={Globalinclude.AppStyle.fill}>
        {fb.trim() === '' &&
        twitter.trim() === '' &&
        insta.trim() === '' &&
        wiki.trim() === '' &&
        youtube.trim() === '' &&
        whatsapp.trim() === '' &&
        linkedinUrl.trim() === '' ? (
          <View style={Globalinclude.AppStyle.fillCenter}>
            <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
              Currently No Data Uploaded!
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.socialMediaContainer}>
              {fb.trim() !== '' &&
                generateView('#3b5998', 'facebook', IconType[4], () => {
                  if (fb !== '') {
                    openLink(fb);
                  }
                })}
              {twitter.trim() !== '' &&
                generateView('#55acee', 'twitter', IconType[4], () => {
                  if (twitter !== '') {
                    openLink(twitter);
                  }
                })}
              {insta.trim() !== '' &&
                generateView('#3f729b', 'instagram', IconType[4], () => {
                  if (insta !== '') {
                    openLink(insta);
                  }
                })}
              {wiki.trim() !== '' &&
                generateView('#222222', 'wikipedia-w', IconType[4], () => {
                  if (wiki !== '') {
                    openLink(wiki);
                  }
                })}
              {youtube.trim() !== '' &&
                generateView('#c62d1d', 'youtube-play', IconType[4], () => {
                  if (youtube !== '') {
                    openLink(youtube);
                  }
                })}
              {whatsapp.trim() !== '' &&
                generateView('#25d366', 'whatsapp', IconType[4], () => {
                  if (whatsapp !== '') {
                    var phoneNumber = '91' + whatsapp;
                    let url = `whatsapp://send?text=Hi&phone=${phoneNumber}`;
                    openLink(url);
                  }
                })}
              {linkedinUrl.trim() !== '' &&
                generateView('#0e76a8', 'linkedin', IconType[4], () => {
                  if (linkedinUrl !== '') {
                    openLink(linkedinUrl);
                  }
                })}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  socialMediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: scale(6),
    alignContent: 'center',
  },
  mediaButtonContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: scale(10),
    margin: scale(6),
    maxWidth: deviceWidth / 3 - scale(25),
    minWidth: deviceWidth / 3 - scale(25),
    height: scale(90),
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(6),
  },
});

export default SocialMedia;
