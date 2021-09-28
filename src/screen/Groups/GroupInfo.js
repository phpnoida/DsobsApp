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
  Keyboard,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import ProgressImage from '../../component/ProgresImage';
import HeaderBar from '../../component/HeaderBar';
import CommonButton from '../../component/CommonButton';
import UploadMedia from '../../component/UploadMedia';
import {
  generateHeader,
  generateMenuOption,
  showProgess,
  renderNoDataComponent,
} from '../../component/Common';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {IconType, APP_NAME} from '../../helper/Constants';
import Helpers from '../../helper/Helper';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CommonActions} from '@react-navigation/native';

import GroupMembers from './GroupMembers';
import PendingRequests from './PendingRequests';

import {
  doAboutGroup,
  doAcceptUserRequest,
  doExitFromGroup,
  doUpdateGroupAdmin,
  doUpdateGroup,
} from '../../Actions/GroupActions';

import io from 'socket.io-client';

const {width, height} = Dimensions.get('window');

let groupId = '';
let responseMessage = '';
let selectedUser = null;
let mode = 1;
let isSuccess = false;
let isUserConnected = false;

const GroupInfo = ({route, navigation}) => {
  const userInfoRef = useRef();
  const uploadRef = useRef();
  const groupTitleRef = useRef();
  const socketRef = useRef();

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);

  const [aboutGroup, setAboutGroup] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [mediaData, setMediaData] = useState(null);

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
                connectSocket();
                setMediaData(group.profilePicture);
                setAboutGroup(group.description);
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
  }, [connectSocket]);

  const connectSocket = useCallback(() => {
    console.log('====================================');
    console.log('202-event');
    console.log('====================================');

    socketRef.current = io('https://devapi-dsobs.alumbus.com/', {
      reconnectionAttempts: 2,
    });

    socketRef.current.on('connect', () => {
      if (socketRef.current.connected) {
        isUserConnected = true;
      }
    });
    socketRef.current.on('error', attempt => {
      isUserConnected = false;
      console.log('====================================');
      console.log('errror', attempt);
      console.log('====================================');
    });

    socketRef.current.on('disconnect', () => {
      isUserConnected = false;
      console.log('socket disconnected'); // undefined
    });

    /********************
     * Specific Events
     */
  }, []);

  const emitAdminEvent = (userId, eventName) => {
    if (
      socketRef.current !== undefined &&
      socketRef.current !== null &&
      isUserConnected
    ) {
      let payload = {
        groupId: groupId,
        userId: userId,
      };

      console.log('payload', payload);
      socketRef.current.emit(eventName, payload);
    }
  };

  const emitRemoveUserEvent = userId => {
    if (
      socketRef.current !== undefined &&
      socketRef.current !== null &&
      isUserConnected
    ) {
      let payload = {
        groupId: groupId,
        userId: userId,
      };

      console.log('payload', payload);
      socketRef.current.emit('remove-user', payload);
    }
  };

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

  const removeUser = moveHome => {
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
              emitRemoveUserEvent(selectedUser._id);
              isSuccess = true;
              responseMessage = 'Group information was successfully updated.';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
                if (moveHome) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Dashboard'}],
                    }),
                  );
                } else {
                  emitAdminEvent(selectedUserInfo._id, 'remove-user');
                  getGroupData();
                }
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
              //made admin
              if (mode === 1) {
                emitAdminEvent(selectedUserInfo._id, 'make-admin');
              } else {
                emitAdminEvent(selectedUserInfo._id, 'remove-admin');
                //remove admin
              }

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

  /**
   *
   * @UpdateGroup
   *
   */
  const updateGroupData = requestObject => {
    global.loader_ref.show_loader(1);
    doUpdateGroup(
      groupId,
      requestObject,
      response => {
        global.loader_ref.show_loader(0);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            console.log('data', data);
            if (data.status) {
              isSuccess = true;
              responseMessage =
                'You have successfully updated group information';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
                getGroupData();
              }, 2500);
            } else {
              responseMessage = 'Error while updating your request!';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
              }, 2500);
            }
          }
        }
      },
      (code, error) => {
        console.log('====================================');
        console.log(code, error);
        console.log('====================================');
        //setSubmitting(false);
        Alert.alert('Something went wrong', error);
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
    let isSuperAdmin = selectedUserInfo.isSuperAdmin;
    let isAdmin = selectedUserInfo.isAdmin;

    let maxAdminReached =
      groupData.admins !== undefined &&
      groupData.admins !== null &&
      groupData.admins.length > 4
        ? true
        : false;

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

          {!isSuperAdmin &&
            !isAdmin &&
            !maxAdminReached &&
            generateMenuOption('Make Admin', 'user-plus', 4, () => {
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

          {!isSuperAdmin &&
            isAdmin &&
            generateMenuOption('Remove Admin', 'account-remove', 1, () => {
              userInfoRef.current.close();
              removeIndex(
                `Are you sure you want to remove ${Helpers.capitalize(
                  Helpers.concatName(selectedUserInfo),
                )} from admin?`,
                () => {
                  mode = 2;
                  updateAdminRequest();
                },
              );
            })}

          {!isSuperAdmin &&
            generateMenuOption('Remove From Group', 'add-to-list', 9, () => {
              userInfoRef.current.close();
              removeIndex(
                `Are you sure you want to remove ${Helpers.capitalize(
                  Helpers.concatName(selectedUserInfo),
                )} from group?`,
                () => {
                  selectedUser = selectedUserInfo;
                  removeUser(false);
                },
              );
            })}
        </View>
      </OptionsSheet>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar
        title={
          groupData !== null
            ? `${Helpers.capitalize(groupData.name)}`
            : APP_NAME
        }
        navigation={navigation}
        showBack={true}
      />
      {showProgess(isLoading)}

      {groupData !== null && groupData !== undefined ? (
        <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={GlobalInclude.AppStyle.contentSpaceHorizonta}>
              <View style={styles.imageStyle}>
                {mediaData !== null &&
                  mediaData !== undefined &&
                  mediaData !== '' && (
                    <ProgressImage
                      source={{
                        uri: mediaData,
                      }}
                      containerStyle={styles.imageStyle}
                      imageStyle={styles.imageStyle}
                      mode={'cover'}
                    />
                  )}
                {groupData.isAdmin && (
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        uploadRef &&
                        uploadRef.current !== undefined &&
                        uploadRef.current !== null
                      ) {
                        uploadRef.current.open();
                      }
                    }}
                    style={{
                      height: scale(30),
                      width: scale(30),
                      borderRadius: scale(100),
                      backgroundColor: 'white',
                      position: 'absolute',
                      right: -4,
                      bottom: -5,
                      elevation: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <GlobalInclude.BaseIcon
                      containerStyle={{height: scale(24), width: scale(24)}}
                      iconColor={'#202020'}
                      iconName={'add-photo-alternate'}
                      iconSize={scale(22)}
                      iconType={IconType[0]}
                    />
                  </TouchableOpacity>
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
                <View style={[grid.row]}>
                  <Text
                    style={[
                      g.fs16,
                      g.mt5,
                      g.FHNB,
                      GlobalInclude.AppStyle.transform,
                      g.colorBlue,
                      grid.col,
                    ]}>
                    About the group
                  </Text>

                  {groupData.isAdmin && (
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          groupTitleRef.current !== undefined &&
                          groupTitleRef.current !== null
                        ) {
                          groupTitleRef.current.open();
                        }
                      }}
                      style={{
                        height: scale(30),
                        width: scale(30),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <GlobalInclude.BaseIcon
                        containerStyle={{height: scale(24), width: scale(24)}}
                        iconColor={'#202020'}
                        iconName={'edit'}
                        iconSize={scale(22)}
                        iconType={IconType[10]}
                      />
                    </TouchableOpacity>
                  )}
                </View>
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
                onTap={(item, index) => {
                  if (groupData.isAdmin) {
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

                      removeUser(true);
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

      <UploadMedia
        currentModule={'groups'}
        navigation={navigation}
        refRBSheet={uploadRef}
        media={{
          image: false,
          video: true,
          document: true,
          audio: true,
        }}
        supportMultiple={false}
        onPickMedia={media => {
          uploadRef.current.close();
          if (media !== undefined && media !== null) {
            let requestObject = {
              profilePicture: media[0].thumbnail,
            };
            updateGroupData(requestObject);
          }
        }}
      />

      <OptionsSheet
        ref={groupTitleRef}
        minClosingHeight={50}
        height={height / 2 - 100}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          style={grid.flex1}
          showsVerticalScrollIndicator={false}>
          <View style={grid.flex1}>
            <View style={g.mb15}>
              {generateHeader('About Group', true)}
              <TextInput
                underlineColorAndroid="transparent"
                numberOfLines={6}
                style={styles.commentInput}
                value={aboutGroup}
                keyboardType={'default'}
                autoCapitalize={'words'}
                multiline={true}
                blurOnSubmit={true}
                maxLength={500}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                returnKeyType="done"
                placeholder={'Type here'}
                onChangeText={value => {
                  setErrorMessage({});
                  setAboutGroup(value);
                }}
              />
              {errorMessage.aboutGroup && errorMessage.aboutGroup !== '' ? (
                <Text style={g.errorMsg}>{errorMessage.aboutGroup}</Text>
              ) : null}
            </View>
          </View>
          <CommonButton
            title={'Save'}
            showLoader={false}
            onPress={() => {
              setErrorMessage({});
              if (aboutGroup.trim() === '' || aboutGroup.trim().length === 0) {
                setErrorMessage({aboutGroup: 'This field is required'});
                return;
              } else {
                let requestObject = {
                  description: aboutGroup,
                };
                updateGroupData(requestObject);
              }
              groupTitleRef.current.close();
            }}
          />
        </KeyboardAwareScrollView>
      </OptionsSheet>

      {showErrorMessage && (
        <GlobalInclude.ModalAlert
          status={showErrorMessage}
          header={responseMessage}
          okButton={isSuccess ? 'Okay' : `Contact ${APP_NAME}`}
          okAction={() => {
            setShowErrorMessage(!showErrorMessage);
          }}
          closeAction={() => {
            setShowErrorMessage(!showErrorMessage);
          }}
        />
      )}
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
    height: scale(80),
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
