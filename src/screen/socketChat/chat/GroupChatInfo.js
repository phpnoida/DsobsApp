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
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import ProgressImage from '../../../component/ProgresImage';
import HeaderBar from '../../../component/HeaderBar';
import UploadMedia from '../../../component/UploadMedia';
import CommonButton from '../../../component/CommonButton';
import AutoSuggestUser from '../../../component/AutoSuggestUser';
import {generateHeader} from '../../../component/Common';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {IconType, APP_NAME} from '../../../helper/Constants';
import {showProgess} from '../../../component/Common';
import Helpers from '../../../helper/Helper';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getDirectory} from '../../../Actions/DirectoryActions';
import {doAboutGroup} from '../../../Actions/SocketChatActions';

const {width, height} = Dimensions.get('window');

let searchVal = '';
let removedMembers = [];
let newMembers = [];
let groupAdmin = '';
let responseMessage = '';
let groupId = '';
let isSuccess = false;
let isUserConnected = false;

const GroupChatInfo = ({route, navigation}) => {
  const uploadRef = useRef();
  const userSelector = useRef();
  const groupTitleRef = useRef();
  const socketRef = useRef();

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);
  const [errorMessage, setErrorMessage] = useState({});
  /**search */
  const [searchedUser, setSearchedUser] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    removedMembers = [];
    newMembers = [];
    if (route.params !== undefined && route.params !== null) {
      socketRef.current = route.params.socket;
    }

    console.log('isConnected', socketRef.current.connected);
    isUserConnected = socketRef.current.connected;
    if (socketRef.current.connected) {
      socketRef.current.on('error', attempt => {
        console.log('errror', attempt);
      });

      socketRef?.current?.on('disconnect', () => {
        isUserConnected = false;
        console.log('socket disconnected'); // undefined
      });

      socketRef?.current?.on('reconnect', attempt => {
        console.log('attempt', attempt);
      });
      socketRef?.current?.on('reconnect_error', attempt => {
        console.log('reconnect_error', attempt);
        isUserConnected = false;
      });
      socketRef?.current?.on('reconnect_attempt', attempt => {
        console.log('reconnect_attempt', attempt);
      });

      socketRef?.current?.removeListener('user-connected');
      socketRef?.current?.on('user-connected', event => {
        console.log('connected', event);
        isUserConnected = JSON.parse(event.status);
      });

      socketRef?.current?.removeListener('chat-added-user');
      socketRef?.current?.on('chat-added-user', event => {
        if (event && event !== null && event !== undefined) {
          console.log('connected', event);
          setIsUpdating(false);
          if (event.status) {
            getGroupData();
          }
        }
      });

      socketRef?.current?.removeListener('chat-removed-user');
      socketRef?.current?.on('chat-removed-user', event => {
        if (event && event !== null && event !== undefined) {
          console.log('removed', event);
          setIsUpdating(false);
          if (event.status) {
            getGroupData();
          }
        }
      });

      socketRef?.current?.removeListener('chat-updated');
      socketRef.current.on('chat-updated', event => {
        setIsUpdating(false);
        console.log('chat-updated', event);
        if (event && event !== null && event !== undefined) {
          if (event.status) {
            getGroupData();
          }
        }
      });
    }
    return () => {};
  }, [route.params, getGroupData]);

  useEffect(() => {
    if (route.params !== undefined && route.params !== null) {
      groupId = route.params.groupId;
    }
    getGroupData();
    return () => {};
  }, [getGroupData, route.params]);

  const getGroupData = useCallback(() => {
    removedMembers = [];
    newMembers = [];
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
            console.log('gourpDasta', JSON.stringify(data));
            if (data.status) {
              let group = data.data;
              if (group && group !== undefined && group !== null) {
                let item = group.superAdmins[0];
                groupAdmin = item._id;

                setGroupImage(group.profilePicture);
                setGroupName(Helpers.capitalize(group.name));
                setGroupData(group);

                let members = [];

                let superAdmin = group.superAdmins;
                members.push(superAdmin[0]);

                group.users.forEach(element => {
                  members.push(element);
                });

                sortUsers(members);
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

  const sortUsers = data => {
    data.sort((a, b) => (a.batch > b.batch ? 1 : b.batch > a.batch ? -1 : 0));
    var index = data.findIndex(x => x._id === groupAdmin);
    var placeholder = {};
    var objectToMove = data.splice(index, 1, placeholder)[0];
    data.splice(0, 0, objectToMove);
    data.splice(data.indexOf(placeholder), 1);
    setGroupMembers([...data]);
  };

  const doSearchUser = searchQuery => {
    getDirectory(
      '1',
      searchQuery,
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (searchVal.length > 0) {
              for (var i = data.data.length - 1; i >= 0; i--) {
                const element = data.data[i];
                if (element._id === global.userId) {
                  data.data.splice(i, 1);
                  break;
                }
              }
              setSearchedUser([...data.data]);
            } else {
              setSearchedUser([]);
            }
          }
        }
      },
      error => {
        setSearchedUser([]);
      },
    );
  };

  const updateGroupInfo = async () => {
    if (newMembers.length > 0 || removedMembers.length > 0) {
      setIsUpdating(true);
      setTimeout(() => {
        if (newMembers.length > 0) {
          if (socketRef?.current !== undefined && socketRef?.current !== null) {
            let payload = {
              chatId: groupId,
              usersId: newMembers,
            };
            console.log('add', payload);
            socketRef.current.emit('chat-add-user', payload);
          }
        }
        if (removedMembers.length > 0) {
          if (socketRef?.current !== undefined && socketRef?.current !== null) {
            let payload = {
              authorId: global.userId,
              chatId: groupId,
              usersId: removedMembers,
            };
            console.log('remove', payload);
            socketRef.current.emit('chat-remove-user', payload);
          }
        }
      }, 1000);
    }
  };

  const updateGroupDetail = async payload => {
    setIsUpdating(true);
    if (socketRef?.current !== undefined && socketRef?.current !== null) {
      console.log('update data', payload);
      socketRef.current.emit('chat-update', payload);
    }
  };

  const removeIndex = callBack => {
    Alert.alert(
      'Are you sure you want to delete it?',
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

  const renderSelectedUsers = () => {
    var data = selectedUsers.map((row, index) => {
      return (
        <View key={index} style={styles.selectedUserContainer}>
          <View style={[g.bggray2, g.br3, {height: scale(65)}]}>
            <ProgressImage
              source={
                row.profileImg &&
                row.profileImg !== undefined &&
                row.profileImg != null &&
                row.profileImg !== ''
                  ? {uri: row.profileImg}
                  : GlobalInclude.Assets.DefaultImage
              }
              containerStyle={styles.userProfileContainer}
              imageStyle={styles.userProfiileView}
              mode={'cover'}
            />
            <TouchableOpacity
              style={styles.removeUserContainer}
              activeOpacity={0.8}
              onPress={() => {
                let oldData = selectedUsers;
                oldData.splice(index, 1);
                setSelectedUsers([...oldData]);
              }}
              hitSlop={{
                top: 15,
                bottom: 15,
                left: 15,
                right: 15,
              }}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(18), width: scale(18)}}
                iconColor={'#fff'}
                iconName={'close'}
                iconSize={scale(18)}
                iconType={IconType[8]}
              />
            </TouchableOpacity>
          </View>
          <View style={{padding: scale(3)}}>
            <Text style={styles.userNameView}>
              {Helpers.capitalize(Helpers.concatName(row))}
            </Text>
            {row.schoolNumber ? (
              <Text
                style={[
                  g.fs10,
                  g.colorBlack,
                  g.FHNR,
                  {marginTop: scale(2), marginBottom: scale(2)},
                ]}>
                {row.schoolNumber}
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                marginTop: scale(2),
                marginBottom: scale(2),
              }}>
              {row.house ? (
                <Text
                  style={[
                    g.fs10,
                    g.colorBlack,
                    g.FHNR,
                    {marginRight: scale(2)},
                  ]}>
                  {row.house.toLowerCase().charAt(0).toUpperCase() +
                    row.house.toLowerCase().slice(1)}
                </Text>
              ) : null}
              {row.section ? (
                <Text
                  style={[
                    g.fs10,
                    g.colorBlack,
                    g.FHNR,
                    {marginLeft: scale(2)},
                  ]}>
                  {row.section}
                </Text>
              ) : null}
            </View>
            {row.batch ? (
              <Text
                style={[
                  g.fs10,
                  g.colorBlack,
                  g.FHNR,
                  {marginTop: scale(2), marginBottom: scale(2)},
                ]}>
                {row.batch}
              </Text>
            ) : null}
          </View>
        </View>
      );
    });
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {data}
      </ScrollView>
    );
  };

  const showTaggedUsers = userTag => {
    let componentArray = [];
    for (let i = 0; i < userTag.length; i++) {
      let item = userTag[i];
      const component = (
        <View
          style={[
            i < userTag.length - 1 ? styles.bottomLine : {},
            g.mb5,
            g.ml5,
            g.mr5,
          ]}
          key={i}>
          <View style={[grid.rowdir]}>
            <TouchableOpacity
              style={[grid.col]}
              activeOpacity={1}
              onPress={() => {
                navigation.navigate('UserProfile', {
                  userId: item._id,
                });
              }}>
              <View style={[grid.rowdir, g.mb5, grid.alignItems]}>
                <View
                  style={[
                    {
                      height: scale(48),
                      width: scale(48),
                      borderRadius: scale(90),
                    },
                    grid.alignItems,
                    grid.justifyContentCenter,
                    g.mr10,
                  ]}>
                  {item.profileImg !== null &&
                  item.profileImg !== undefined &&
                  item.profileImg !== '' ? (
                    <ProgressImage
                      source={{uri: item.profileImg}}
                      containerStyle={{
                        aspectRatio: 1 / 1,
                        height: scale(48),
                        width: scale(48),
                        borderRadius: scale(90),
                      }}
                      imageStyle={{
                        aspectRatio: 1 / 1,
                        height: scale(48),
                        width: scale(48),
                        borderRadius: scale(90),
                      }}
                      mode={'cover'}
                    />
                  ) : (
                    <View
                      style={[
                        {
                          height: scale(48),
                          width: scale(48),
                          borderRadius: scale(90),
                        },
                        g.bggray,
                        g.oh,
                        grid.alignItems,
                        grid.justifyContentCenter,
                      ]}>
                      <Text
                        style={[
                          g.fs28,
                          g.FHNM,
                          g.colorWhite,
                          GlobalInclude.AppStyle.transform,
                        ]}>
                        {item.firstName.charAt(0)}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={grid.col}>
                  <View style={[grid.rowdir]}>
                    <Text
                      style={[
                        g.colordarkGray,
                        g.fs14,
                        g.FHNR,
                        g.txtLeft,
                        grid.col,
                      ]}>
                      {Helpers.capitalize(Helpers.concatName(item))}
                    </Text>
                    {item._id === groupData.isAd && (
                      <Text
                        style={[g.colordarkGray, g.fs14, g.FHNM, g.txtLeft]}>
                        Admin
                      </Text>
                    )}
                  </View>

                  <View style={[g.mt2, g.mb2]} />
                  <Text style={[g.colordarkGray, g.fs14, g.FHNR, g.txtLeft]}>
                    Batch {item.batch}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {groupData.isAdmin && item._id !== global.userId && (
              <TouchableOpacity
                onPress={() => {
                  removeIndex(() => {
                    var isExist = removedMembers.findIndex(x => x === item._id);
                    if (isExist < 0) {
                      removedMembers.push(item._id);
                      let oldData = groupMembers;
                      var findIndex = oldData.findIndex(
                        x => x._id === item._id,
                      );
                      if (findIndex > -1) {
                        oldData.splice(findIndex, 1);
                      }
                      setGroupMembers([...oldData]);
                    }
                  });
                }}
                style={[grid.alignItems, grid.justifyContentCenter]}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(24), width: scale(24)}}
                  iconColor={'#202020'}
                  iconName={'remove'}
                  iconSize={scale(22)}
                  iconType={IconType[4]}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      );

      componentArray.push(component);
    }
    return componentArray;
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      {groupData !== null && groupData.isAdmin ? (
        <HeaderBar
          title={
            groupData !== null && groupName !== ''
              ? `${Helpers.capitalize(groupName)}`
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
            if (
              groupTitleRef.current !== undefined &&
              groupTitleRef.current !== null
            ) {
              groupTitleRef.current.open();
            }
          }}
          navigation={navigation}
          showBack={true}
        />
      ) : (
        <HeaderBar
          title={
            groupData !== null ? `${Helpers.capitalize(groupName)}` : APP_NAME
          }
          navigation={navigation}
          showBack={true}
        />
      )}

      {showProgess(isLoading)}
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        {groupData !== null && groupData !== undefined && (
          <View style={[grid.flex1]}>
            <View style={[grid.flex1, g.pl10, g.pr10]}>
              <View style={styles.headerContainer}>
                <View
                  style={[
                    {
                      height: scale(65),
                      width: scale(65),
                      borderRadius: scale(90),
                    },

                    grid.alignItems,
                    grid.justifyContentCenter,
                  ]}>
                  <View
                    style={[
                      {
                        height: scale(65),
                        width: scale(65),
                        borderRadius: scale(90),
                      },
                      g.bggray,
                      g.oh,
                      grid.alignItems,
                      grid.justifyContentCenter,
                    ]}>
                    {groupImage !== null &&
                    groupImage !== undefined &&
                    groupImage !== '' ? (
                      <ProgressImage
                        source={{uri: groupImage}}
                        containerStyle={{
                          aspectRatio: 1 / 1,
                          height: scale(65),
                          width: scale(65),
                          borderRadius: scale(90),
                        }}
                        imageStyle={{
                          aspectRatio: 1 / 1,
                          height: scale(65),
                          width: scale(65),
                          borderRadius: scale(90),
                        }}
                        mode={'cover'}
                      />
                    ) : (
                      <Text
                        style={[
                          g.fs28,
                          g.FHNM,
                          g.colorWhite,
                          GlobalInclude.AppStyle.transform,
                        ]}>
                        {groupData.name.charAt(0)}
                      </Text>
                    )}
                  </View>
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
                <Text
                  style={[
                    g.colordarkGray,
                    g.fs18,
                    g.FHNB,
                    GlobalInclude.AppStyle.transform,
                    grid.alignItems,
                    grid.justifyContentCenter,
                    g.ml15,
                  ]}>
                  {Helpers.capitalize(groupName)}
                </Text>
              </View>

              <View style={[styles.bottomLine, g.ml10, g.mr10]}>
                <View
                  style={[
                    grid.rowdir,
                    grid.alignItems,
                    grid.justifyContentCenter,
                    g.mb5,
                  ]}>
                  <Text
                    style={[
                      g.colordarkGray,
                      g.fs18,
                      g.FHNM,
                      g.txtLeft,
                      g.txtCenterVertical,
                      grid.col,
                    ]}>
                    People In Group
                  </Text>

                  {groupData.isAdmin && (
                    <TouchableOpacity
                      onPress={() => {
                        if (groupMembers.length > 10) {
                          Alert.alert(
                            'Max limit exceeded',
                            'Multi user chat is available for groups of 10 users or less only. Please limit the number of people in this chat to 10 or fewer.',
                          );
                        } else {
                          setSelectedUsers([]);
                          if (
                            userSelector &&
                            userSelector.current !== undefined &&
                            userSelector.current !== null
                          ) {
                            userSelector.current.open();
                          }
                        }
                      }}>
                      <GlobalInclude.BaseIcon
                        containerStyle={{height: scale(24), width: scale(24)}}
                        iconColor={'#202020'}
                        iconName={'adduser'}
                        iconSize={scale(22)}
                        iconType={IconType[10]}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[g.mt10, g.mb10, g.pl5, g.pr5]}>
                  {showTaggedUsers(groupMembers)}
                </View>
              </ScrollView>
            </View>
            {groupData.isAdmin && (
              <View style={[styles.filterButton, g.mb10]}>
                <CommonButton
                  showLoader={isUpdating}
                  title={'Update'}
                  onPress={() => {
                    if (!isUpdating) {
                      updateGroupInfo();
                    }
                  }}
                />
              </View>
            )}
          </View>
        )}
      </SafeAreaView>

      <UploadMedia
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
            console.log('media', media);

            // let requestObject = {
            //   profilePicture: media[0].thumbnail,
            // };
            // updateGroupData(requestObject);

            let requestObject = {
              chatType: 1,
              chatId: groupId,
              profilePicture: media[0].thumbnail,
            };
            updateGroupDetail(requestObject);
          }
        }}
      />

      <OptionsSheet
        ref={groupTitleRef}
        minClosingHeight={50}
        height={height / 2 - 170}
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
              {generateHeader('Group Name', true)}
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                maxLength={50}
                keyboardType={'default'}
                autoCapitalize={'words'}
                returnKeyType={'done'}
                placeholder={'Type name'}
                value={groupName}
                onChangeText={value => {
                  setGroupName(value);
                }}
              />
              {errorMessage.groupName && errorMessage.groupName.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.groupName}
                </Text>
              )}
            </View>
          </View>
          <CommonButton
            title={'Save'}
            showLoader={false}
            onPress={() => {
              setErrorMessage({});
              if (groupName.trim() === '' || groupName.trim().length === 0) {
                setErrorMessage({groupName: 'This field is required'});
                return;
              } else {
                // let requestObject = {
                //   description: groupName,
                // };

                let requestObject = {
                  chatType: 1,
                  chatId: groupId,
                  name: groupName,
                };
                updateGroupDetail(requestObject);
                //updateGroupData(requestObject);
              }
              setTimeout(() => {
                groupTitleRef.current.close();
              }, 220);
            }}
          />
        </KeyboardAwareScrollView>
      </OptionsSheet>

      <OptionsSheet
        ref={userSelector}
        minClosingHeight={50}
        height={height / 2 + height / 3}
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
              <View
                style={[
                  grid.rowdir,
                  grid.alignItems,
                  grid.justifyContentCenter,
                  g.mb5,
                ]}>
                <Text style={g.labeltext1}>Add Participants</Text>
              </View>
              <TextInput
                underlineColorAndroid="transparent"
                style={[g.inputWhite]}
                autoCapitalize={'words'}
                value={searchUserQuery}
                placeholder={'Search user here'}
                onChangeText={value => {
                  searchVal = value;
                  setSearchUserQuery(value);
                  if (value.length > 0) {
                    doSearchUser(value);
                  } else {
                    setSearchedUser([]);
                  }
                }}
              />
            </View>
            {searchedUser.length > 0 && (
              <AutoSuggestUser
                searchedUser={searchedUser}
                onPress={(row, index) => {
                  let oldData = selectedUsers;
                  searchVal = '';
                  oldData.push(row);
                  setSearchUserQuery('');
                  setSelectedUsers([...oldData]);
                  setSearchedUser([]);
                }}
              />
            )}

            {selectedUsers.length > 0 && (
              <View style={g.mb15}>
                <View style={[grid.rowdir, grid.alignItemsTop]}>
                  <Text style={g.labeltext1}>Selected Users</Text>
                </View>
                {renderSelectedUsers()}
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
        <View style={[g.mb10]}>
          <CommonButton
            title={'Save'}
            showLoader={false}
            onPress={() => {
              userSelector.current.close();
              let oldData = groupMembers;
              selectedUsers.forEach(element => {
                var index = oldData.findIndex(x => x._id === element._id);
                if (index < 0) {
                  oldData.push(element);
                  newMembers.push(element._id);
                  var isExist = removedMembers.findIndex(
                    x => x === element._id,
                  );
                  if (isExist > -1) {
                    removedMembers.splice(isExist, 1);
                  }
                  console.log('removedMembers', removedMembers);
                }
              });
              sortUsers(oldData);
            }}
          />
        </View>
      </OptionsSheet>

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

export default GroupChatInfo;
