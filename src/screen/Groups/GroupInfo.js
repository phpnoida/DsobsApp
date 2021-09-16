import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import ProgressImage from '../../component/ProgresImage';
import HeaderBar from '../../component/HeaderBar';
import CommonButton from '../../component/CommonButton';
import {
  generateHeader,
  generateMenuOption,
  showUser,
} from '../../component/Common';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {IconType, APP_NAME} from '../../helper/Constants';
import {showProgess, renderNoDataComponent} from '../../component/Common';
import Helpers from '../../helper/Helper';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

import GroupMembers from './GroupMembers';
import PendingRequests from './PendingRequests';

import {
  doAboutGroup,
  doAcceptUserRequest,
  doExitFromGroup,
  doUpdateGroupAdmin,
} from '../../Actions/GroupActions';

const {width, height} = Dimensions.get('window');

let groupId = '';
let responseMessage = '';
let selectedUser = null;
let mode = 1;
let isAdminUser = false;
let isSuccess = false;

const GroupInfo = ({route, navigation}) => {
  const userInfoRef = useRef();

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);

  useEffect(() => {
    if (route.params !== undefined && route.params !== null) {
      groupId = route.params.groupId;
    }
    getGroupData();
    return () => {};
  }, [getGroupData, route.params]);

  const getGroupData = useCallback(() => {
    setIsLoading(true);
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

            if (data.status) {
              let group = data.data;
              if (group && group !== undefined && group !== null) {
                let users = group.users;
                if (
                  users &&
                  users !== undefined &&
                  users !== null &&
                  users.length > 0
                ) {
                  for (let i = 0; i < users.length; i++) {
                    const element = users[i];
                    if (
                      element !== undefined &&
                      element !== null &&
                      element._id === global.userId &&
                      element.isAdmin
                    ) {
                      setIsAdmin(true);
                      break;
                    }
                  }
                }

                setGroupData(group);
              }
            }
          }
        }
        setIsLoading(false);
      },
      (code, error) => {
        setIsLoading(false);
      },
    );
  }, []);

  const updateUserRequest = () => {
    setIsLoading(true);
    doAcceptUserRequest(
      mode,
      groupId,
      selectedUser._id,
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              isSuccess = true;
              responseMessage = 'User information was successfully updated.';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
                getGroupData();
              }, 2500);
            }

            console.log('====================================');
            console.log('data', JSON.stringify(data));
            console.log('====================================');
          }
        }
        setIsLoading(false);
      },
      (code, error) => {
        console.log('====================================');
        console.log(code, error);
        console.log('====================================');
        setIsLoading(false);
      },
    );
  };

  const removeUser = () => {
    setIsLoading(true);
    doExitFromGroup(
      groupId,
      selectedUser._id,
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              isSuccess = true;
              responseMessage = 'Group information was successfully updated.';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
                getGroupData();
              }, 2500);
            }
            console.log('====================================');
            console.log('data', JSON.stringify(data));
            console.log('====================================');
          }
        }
        setIsLoading(false);
      },
      (code, error) => {
        console.log('====================================');
        console.log(code, error);
        console.log('====================================');
        setIsLoading(false);
      },
    );
  };

  const updateAdminRequest = () => {
    setIsLoading(true);
    doUpdateGroupAdmin(
      mode,
      groupId,
      selectedUserInfo._id,
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              isSuccess = true;
              responseMessage =
                'Group admin information was successfully updated.';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
                getGroupData();
              }, 2500);
            }

            console.log('====================================');
            console.log('data', JSON.stringify(data));
            console.log('====================================');
          }
        }
        setIsLoading(false);
      },
      (code, error) => {
        console.log('====================================');
        console.log(code, error);
        console.log('====================================');
        setIsLoading(false);
      },
    );
  };

  const removeIndex = (message, callBack) => {
    Alert.alert(
      message,
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => {
            callBack();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const userInfoSheet = () => {
    return (
      <OptionsSheet
        ref={userInfoRef}
        minClosingHeight={50}
        height={260}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View stylre={[grid.flex1, g.mb10]}>
          <View
            style={[grid.rowdir, grid.alignItems, grid.justifyContentCenter]}>
            <Text style={[g.colordarkGray, g.fs15, g.FHNR, g.txtLeft]}>
              Group Member:
            </Text>
            <Text
              style={[g.colorBlue, g.fs16, g.FHNM, g.txtLeft, grid.col, g.ml2]}>
              {Helpers.capitalize(Helpers.concatName(selectedUserInfo))}
            </Text>
          </View>

          {isAdminUser
            ? generateMenuOption('Remove Admin', 'account-remove', 1, () => {
                userInfoRef.current.close();
                let admins = groupData.admins;

                if (admins) {
                  if (admins.length > 1) {
                    removeIndex(
                      `Are you sure you want to remove ${Helpers.capitalize(
                        Helpers.concatName(selectedUserInfo),
                      )} from admin?`,
                      () => {
                        mode = 2;
                        updateAdminRequest();
                      },
                    );
                  } else {
                    removeIndex(
                      'Pls make some one admin then only u can leave.',
                      () => {},
                    );
                  }
                }
              })
            : generateMenuOption('Make Admin', 'user-plus', 4, () => {
                userInfoRef.current.close();
                removeIndex(
                  `Are you sure you want to make ${Helpers.capitalize(
                    Helpers.concatName(selectedUserInfo),
                  )} as admin?`,
                  () => {
                    mode = 1;
                    updateAdminRequest();
                  },
                );
              })}

          {generateMenuOption('Remove From Group', 'add-to-list', 9, () => {
            userInfoRef.current.close();
            removeIndex(
              `Are you sure you want to remove ${Helpers.capitalize(
                Helpers.concatName(selectedUserInfo),
              )} from group?`,
              () => {
                selectedUser = selectedUserInfo;
                removeUser();
              },
            );
          })}
        </View>
      </OptionsSheet>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      {isAdmin && groupData !== undefined && groupData !== null ? (
        <HeaderBar
          title={
            groupData !== null
              ? `${Helpers.capitalize(groupData.name)}`
              : APP_NAME
          }
          customIcon={{
            containerStyle: {height: scale(24), width: scale(24)},
            iconColor: GlobalInclude.Color.ColorPrimary,
            iconName: 'edit',
            size: scale(24),
            type: IconType[0],
          }}
          customIconPress={() => {
            let data = {
              data: groupData,
              inEditMode: true,
            };
            data.data._id = groupId;
            navigation.navigate('CreateGroup', {data: data});
          }}
          navigation={navigation}
          showBack={true}
        />
      ) : (
        <HeaderBar
          title={
            groupData !== null
              ? `${Helpers.capitalize(groupData.name)}`
              : APP_NAME
          }
          navigation={navigation}
          showBack={true}
        />
      )}
      {showProgess(isLoading)}

      {groupData !== null && groupData !== undefined ? (
        <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={GlobalInclude.AppStyle.contentSpaceHorizonta}>
              <View style={styles.imageStyle}>
                {groupData.profilePicture !== null &&
                  groupData.profilePicture !== undefined &&
                  groupData.profilePicture !== '' && (
                    <ProgressImage
                      source={{
                        uri: groupData.profilePicture,
                      }}
                      containerStyle={styles.imageStyle}
                      imageStyle={styles.imageStyle}
                      mode={'cover'}
                    />
                  )}
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
                ]}>
                <Text
                  style={[
                    g.fs14,
                    g.mt5,
                    g.FHNR,
                    GlobalInclude.AppStyle.transform,
                    g.colorGray,
                  ]}>
                  {groupData?.description}
                </Text>
              </View>
            </View>

            <ScrollableTabView
              underlineColor={'#ffffff'}
              initialPage={0}
              tabBarActiveTextColor={GlobalInclude.Color.ColorPrimary}
              tabBarInactiveTextColor={'#bababa'}
              tabBarTextStyle={{
                fontSize: scale(15),
                fontFamily: 'Lato-Regular',
                margin: -5,
              }}
              tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
              renderTabBar={() => (
                <ScrollableTabBar style={styles.tabBarStyle} />
              )}>
              <GroupMembers
                tabLabel={'People In Group'}
                groupData={groupData}
                onTap={(item, index, adminUser) => {
                  if (groupData.isAdmin) {
                    isAdminUser = adminUser;
                    setSelectedUserInfo(item);
                    if (
                      userInfoRef.current !== undefined &&
                      userInfoRef.current !== null
                    ) {
                      userInfoRef.current.open();
                    }
                  }
                }}
              />

              <PendingRequests
                groupData={groupData}
                tabLabel={
                  groupData.pendingUser && groupData.pendingUser.length > 0
                    ? `(${groupData.pendingUser.length})` +
                      ' Pending Request(s)'
                    : 'Pending Request(s)'
                }
                onTap={(item, selectedMode) => {
                  selectedUser = item;
                  mode = selectedMode;

                  removeIndex(
                    mode === 1
                      ? 'Are you sure you want to accept it?'
                      : 'Are you sure you want to reject it?',
                    () => {
                      updateUserRequest();
                    },
                  );
                }}
              />
            </ScrollableTabView>
          </ScrollView>

          {groupData !== undefined && groupData !== null && !groupData.isAdmin && (
            <View style={[styles.filterButton, {marginBottom: scale(8)}]}>
              <CommonButton
                title={'Exit Group'}
                showLoader={false}
                onPress={() => {
                  removeIndex(
                    'Are you sure you want to exit from group?',
                    () => {
                      let users = groupData.users;
                      for (let i = 0; i < users.length; i++) {
                        const element = users[i];
                        if (element._id === global.userId) {
                          selectedUser = element;
                          break;
                        }
                      }

                      removeUser();
                    },
                  );
                }}
              />
            </View>
          )}
        </SafeAreaView>
      ) : (
        renderNoDataComponent()
      )}

      {showModal && (
        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setShowModal(!showModal);
          }}
          hardwareAccelerated={true}
          visible={showModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.headerText}>{responseMessage}</Text>
            </View>
          </View>
        </Modal>
      )}

      {selectedUserInfo !== undefined &&
        selectedUserInfo !== null &&
        userInfoSheet()}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {borderBottomWidth: 0, margin: 0},
  tabBarUnderlineStyle: {
    borderBottomColor: 'transparent',
    backgroundColor: 'white',
  },
  imageStyle: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: scale(10),
  },
  headerContainer: {
    paddingTop: scale(15),
    paddingBottom: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
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
  bottomLine: {
    borderBottomColor: '#ebebe4',
    borderBottomWidth: 1,
  },
  userNameView: {
    justifyContent: 'flex-start',
    textAlign: 'left',
    fontSize: scale(10),
    color: '#333333',
    fontFamily: 'Lato-Regular',
    marginTop: scale(5),
  },
  removeUserContainer: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    borderRadius: scale(30),
  },
  userProfileContainer: {
    height: scale(65),
    width: '100%',
    borderRadius: scale(8),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  userProfileView: {
    height: scale(75),
    width: '100%',
    borderRadius: scale(8),
  },
  selectedUserContainer: {
    width: scale(60),
    marginEnd: scale(10),
    marginTop: scale(6),
    marginBottom: scale(6),
  },
  userProfiileView: {
    height: '100%',
    width: '100%',
    borderRadius: scale(6),
  },
});

export default GroupInfo;
