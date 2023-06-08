import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import ProgressImage from '../../component/ProgresImage';
import HeaderBar from '../../component/HeaderBar';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {APP_NAME, IconType} from '../../helper/Constants';
import {showProgess, generateView} from '../../component/Common';
import Helpers from '../../helper/Helper';
import moment from 'moment';
import {useCollection} from 'react-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';

const {width} = Dimensions.get('window');
const usersCollection = firestore().collection('Users');

const ChatUserProfile = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [snapshot] = useCollection(
    usersCollection.where('_id', '==', route.params.userId),
  );

  useEffect(() => {
    if (snapshot !== undefined && snapshot !== null) {
      if (
        snapshot.docs !== undefined &&
        snapshot.docs !== null &&
        snapshot.docs.length > 0
      ) {
        let data = snapshot.docs[0].data();
        if (data && data !== null && data !== undefined) {
          setIsLoading(false);
          setProfileData(data);
        }
      }
    }
    return () => {};
  }, [snapshot]);

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar
        title={
          profileData !== null
            ? `${Helpers.capitalize(Helpers.concatName(profileData))} - ${
                profileData.batch
              }`
            : APP_NAME
        }
        navigation={navigation}
        showBack={true}
      />
      {showProgess(isLoading)}
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        {profileData !== null ? (
          <View style={[grid.flex1, g.pl10, g.pr10]}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.headerContainer}
              onPress={() => {
                navigation.navigate('UserProfile', {
                  userId: profileData._id,
                });
              }}>
              <View
                style={[
                  {
                    height: scale(90),
                    width: scale(90),
                    borderRadius: scale(90),
                  },
                  g.bggray,
                  g.oh,
                  grid.alignItems,
                  grid.justifyContentCenter,
                ]}>
                {profileData.profileImg !== null &&
                profileData.profileImg !== undefined &&
                profileData.profileImg !== '' ? (
                  <ProgressImage
                    source={{uri: profileData.profileImg}}
                    containerStyle={{
                      aspectRatio: 1 / 1,
                      height: scale(90),
                      width: scale(90),
                      borderRadius: scale(90),
                    }}
                    imageStyle={{
                      aspectRatio: 1 / 1,
                      height: scale(90),
                      width: scale(90),
                      borderRadius: scale(90),
                    }}
                    mode={'cover'}
                  />
                ) : (
                  <Text
                    style={[
                      g.fs36,
                      g.FHNM,
                      g.colorWhite,
                      GlobalInclude.AppStyle.transform,
                    ]}>
                    {profileData.firstName.charAt(0)}
                  </Text>
                )}
              </View>

              <View style={[g.ml15, grid.col]}>
                <View style={[grid.rowrow, grid.justifyContent]}>
                  <View style={[g.pr10, grid.col]}>
                    <Text
                      style={[
                        g.colordarkGray,
                        g.fs18,
                        g.FHNB,
                        GlobalInclude.AppStyle.transform,
                      ]}
                      onPress={() => {}}>
                      {Helpers.concatName(profileData)}
                    </Text>
                    {profileData.batch ? (
                      <Text
                        style={[
                          g.colorLightGray,
                          g.fs14,
                          g.FHNR,
                          g.mt5,
                          GlobalInclude.AppStyle.transform,
                        ]}>{`${profileData.schoolNo} ${profileData.house} ${profileData.section} ${profileData.batch}`}</Text>
                    ) : null}
                  </View>
                </View>
                <Text style={[g.colorLightGray, g.fs14, g.FHNR, g.mt5]}>
                  {profileData.profession}
                </Text>
                <Text
                  style={[
                    g.colorLightGray,
                    g.fs14,
                    g.FHNR,
                    g.mt5,
                    GlobalInclude.AppStyle.transform,
                  ]}>
                  {profileData.city}
                </Text>
                <Text style={[g.colorLightGray, g.fs14, g.FHNR, g.mt5]}>
                  Last Seen:{' '}
                  {profileData.isOnline
                    ? 'Online'
                    : profileData.lastseen > 0
                    ? moment(profileData.lastseen).fromNow()
                    : 'Not yet'}
                </Text>
              </View>
            </TouchableOpacity>
            {/* section two */}
            <View>
              <View
                style={[
                  g.boxShadow,
                  g.bgWhite,
                  g.br3,
                  g.mt10,
                  g.p5,
                  g.pl15,
                  grid.justifyContentCenter,
                  {minHeight: scale(65)},
                ]}>
                <Text style={[g.colordarkGray, g.fs15, g.FHNR, g.txtLeft]}>
                  {Helpers.capitalize(Helpers.concatName(profileData))}{' '}
                  <Text style={[g.colordarkGray, g.fs15, g.FHNR, g.txtLeft]}>
                    has blocked
                  </Text>
                  <Text style={[g.colordarkGray, g.fs15, g.FHNR]}>
                    {' '}
                    {profileData.blockedUser.length}{' '}
                  </Text>
                  <Text style={[g.colordarkGray, g.fs15, g.FHNR]}>
                    users on chat.
                  </Text>
                </Text>
              </View>
              <View
                style={[
                  g.boxShadow,
                  g.bgWhite,
                  g.br3,
                  g.mt10,
                  g.p5,
                  g.pl15,
                  grid.justifyContentCenter,
                  {minHeight: scale(65)},
                ]}>
                <Text style={[g.colordarkGray, g.fs15, g.FHNR, g.txtLeft]}>
                  {Helpers.capitalize(Helpers.concatName(profileData))}{' '}
                  <Text style={[g.colordarkGray, g.fs15, g.FHNR, g.txtLeft]}>
                    has been blocked by
                  </Text>
                  <Text style={[g.colordarkGray, g.fs15, g.FHNR]}>
                    {' '}
                    {profileData.blockedBy.length}{' '}
                  </Text>
                  <Text style={[g.colordarkGray, g.fs15, g.FHNR]}>
                    users on chat.
                  </Text>
                </Text>
              </View>
            </View>
            {/* section two */}

            <Text style={[g.colordarkGray, g.fs16, g.FHNR, g.mt10, g.p5]}>
              Primary Information
            </Text>
            {/* section three */}
            <View style={[g.mt10]}>
              {generateView(
                IconType[2],
                'envelope',
                'Primary Email',
                profileData.emailScope === 0
                  ? 'Set to Private'
                  : profileData.email,
                () => {
                  if (profileData.emailScope !== 0) {
                    Helpers.openEmail(profileData.email);
                  }
                },
              )}

              {generateView(
                IconType[2],
                'phone',
                'Primary Phone No.',
                profileData.phoneScope === 0
                  ? 'Set to Private'
                  : (profileData.countryCode
                      ? profileData.countryCode + ' '
                      : ' ') + profileData.phone,
                () => {
                  if (profileData.phoneScope !== 0) {
                    Helpers.openDialler(
                      (profileData.countryCode
                        ? profileData.countryCode + ' '
                        : ' ') + profileData.phone,
                    );
                  }
                },
              )}
            </View>
            {/* section three */}
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: scale(15),
    paddingBottom: scale(10),
    flexDirection: 'row',
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: width - 50,
    backgroundColor: 'white',
    borderRadius: scale(6),
    padding: scale(7),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: scale(60),
    alignContent: 'center',
  },
  headerText: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: scale(16),
    textAlign: 'center',
    ...g.FHNR,
    ...g.colorBlue,
  },
});

export default ChatUserProfile;
