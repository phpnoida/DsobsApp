import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import ProgressImage from '../../../component/ProgresImage';
import HeaderBar from '../../../component/HeaderBar';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {APP_NAME, IconType} from '../../../helper/Constants';
import {showProgess, generateView} from '../../../component/Common';
import Helpers from '../../../helper/Helper';
import moment from 'moment';
import {doAboutGroup, doUpdateGroup} from '../../../Actions/SocketChatActions';
const {width} = Dimensions.get('window');

let groupId = '';

const UserProfileInfo = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [opponentInfo, setOpponentInfo] = useState(null);

  useEffect(() => {
    if (route.params !== undefined && route.params !== null) {
      groupId = route.params.groupId;
    }
    getGroupData();
    return () => {};
  }, [getGroupData, route.params]);

  const getGroupData = useCallback(() => {
    doAboutGroup(
      groupId,
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            console.log('GroupInfo', JSON.stringify(data));
            if (data.status) {
              let group = data.data;
              if (group && group !== undefined && group !== null) {
                let users = group.users;

                var index = users.findIndex(x => x.id._id !== global.userId);
                if (index > -1) {
                  setOpponentInfo(users[index].id);
                }
                setProfileData(group);
              }
            }
          }
        }
        setIsLoading(false);
      },
      (code, error) => {
        console.log('code,error', error, code);
        setIsLoading(false);
      },
    );
  }, []);

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar
        title={
          opponentInfo !== null
            ? `${Helpers.capitalize(Helpers.concatName(opponentInfo))} - ${
                opponentInfo?.batch
              }`
            : APP_NAME
        }
        navigation={navigation}
        showBack={true}
      />
      {showProgess(isLoading)}
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        {opponentInfo !== null ? (
          <View style={[grid.flex1, g.pl10, g.pr10]}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.headerContainer}
              onPress={() => {
                navigation.navigate('UserProfile', {
                  userId: opponentInfo?._id,
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
                {opponentInfo?.profileImg !== null &&
                opponentInfo?.profileImg !== undefined &&
                opponentInfo?.profileImg !== '' ? (
                  <ProgressImage
                    source={{uri: opponentInfo?.profileImg}}
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
                    {opponentInfo?.firstName.charAt(0)}
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
                      {Helpers.concatName(opponentInfo)}
                    </Text>
                    {opponentInfo?.batch ? (
                      <Text
                        style={[
                          g.colorLightGray,
                          g.fs14,
                          g.FHNR,
                          g.mt5,
                          GlobalInclude.AppStyle.transform,
                        ]}>{`${opponentInfo?.schoolNumber} ${opponentInfo?.house} ${opponentInfo?.section} ${opponentInfo?.batch}`}</Text>
                    ) : null}
                  </View>
                </View>
                <Text style={[g.colorLightGray, g.fs14, g.FHNR, g.mt5]}>
                  {opponentInfo?.profession}
                </Text>
                <Text
                  style={[
                    g.colorLightGray,
                    g.fs14,
                    g.FHNR,
                    g.mt5,
                    GlobalInclude.AppStyle.transform,
                  ]}>
                  {opponentInfo?.city}
                </Text>
                <Text style={[g.colorLightGray, g.fs14, g.FHNR, g.mt5]}>
                  Last Seen:{' '}
                  {opponentInfo?.chatOnline
                    ? 'Online'
                    : opponentInfo?.chatLastseen > 0
                    ? moment(opponentInfo?.chatLastseen * 1000).fromNow()
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
                  {Helpers.capitalize(Helpers.concatName(opponentInfo))}{' '}
                  <Text style={[g.colordarkGray, g.fs15, g.FHNR, g.txtLeft]}>
                    has blocked
                  </Text>
                  <Text style={[g.colordarkGray, g.fs15, g.FHNR]}>
                    {' '}
                    {opponentInfo?.blockedUser}{' '}
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
                  {Helpers.capitalize(Helpers.concatName(opponentInfo))}{' '}
                  <Text style={[g.colordarkGray, g.fs15, g.FHNR, g.txtLeft]}>
                    has been blocked by
                  </Text>
                  <Text style={[g.colordarkGray, g.fs15, g.FHNR]}>
                    {' '}
                    {opponentInfo?.blockedBy}{' '}
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
                opponentInfo?.emailScope === 0
                  ? 'Set to Private'
                  : opponentInfo?.email,
                () => {
                  if (opponentInfo?.emailScope !== 0) {
                    Helpers.openEmail(opponentInfo?.email);
                  }
                },
              )}

              {generateView(
                IconType[2],
                'phone',
                'Primary Phone No.',
                opponentInfo?.phoneScope === 0
                  ? 'Set to Private'
                  : (opponentInfo?.countryCode
                      ? opponentInfo?.countryCode + ' '
                      : ' ') + opponentInfo?.phone,
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

export default UserProfileInfo;
