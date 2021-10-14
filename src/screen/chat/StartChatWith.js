import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Keyboard,
  Alert,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {IconType} from '../../helper/Constants';
import {getDirectory} from '../../Actions/DirectoryActions';
import AutoSuggestUser from '../../component/AutoSuggestUser';
import Helper from '../../helper/Helper';
import ProgresImage from '../../component/ProgresImage';
import ModelAlert from '../../component/ModalAlert';
import CommonButton from '../../component/CommonButton';
import {
  addUser,
  checkChatExist,
  checkUserExist,
  createGroupChat,
  sendWelcomeMessage,
} from '../../helper/ChatHelper';
import _ from 'lodash';
const {width} = Dimensions.get('window');

let searchVal = '';
let lastIndex = 1;
let challengerUser = null;

const StartChatWith = ({navigation}) => {
  const [chatType, setchatType] = useState(1);
  const [searchedUser, setSearchedUser] = useState([]);
  const [searchUserName, setSearchUserName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [selectedUser, setSelectedUser] = useState([]);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    /**
     * We get user own details also
     */
    checkUserExist(global.userId, false).then(result => {
      if (result !== undefined && result !== null) {
        challengerUser = result;
      }
    });
    return () => {};
  }, []);

  const validateUser = async () => {
    const result = await checkUserExist(selectedUser[0]._id, false);
    if (result === null) {
      addUser(selectedUser[0]._id, selectedUser[0], () => {
        createChatUser(selectedUser[0]);
      });
    } else {
      if (result !== undefined && result !== null) {
        if (
          result.chatEnabled &&
          result.chatEnabled !== undefined &&
          result.chatEnabled !== null &&
          result.chatEnabled
        ) {
          let blockedUser = result.blockedUser;

          if (blockedUser.indexOf(global.userId) > -1) {
            setIsLoading(false);
            Alert.alert(
              'You have been blocked',
              'user has blocked you on chat.',
            );
          } else {
            createChatUser(selectedUser[0]);
          }
        } else {
          setIsLoading(false);
          Alert.alert(
            'Feature not available',
            'user has disabled this feature.',
          );
        }
      } else {
        setIsLoading(false);
        Alert.alert('Feature not available', 'user has disabled this feature.');
      }
    }
  };

  const createChatUser = async opponentUser => {
    const result = await checkChatExist(opponentUser._id, 1);
    setIsLoading(false);
    if (result !== undefined && result !== null) {
      let threadId = result._id;
      let payload = {
        isGroup: false,
        threadId: threadId,
      };
      navigation.navigate('ChatScreen', payload);
      //props.navigation.replace('ChatScreen', payload);
    } else {
      let payload = {
        challenger: challengerUser,
        opponent: opponentUser || {},
        isGroup: false,
      };
      navigation.navigate('ChatScreen', payload);
    }
  };

  const createGroup = async () => {
    let userIds = [];
    let isAnyMemberDisabled = false;
    let disabledUserMessage = '';
    let disabledIds = [];

    let groupMembers = [];
    let detail = {};
    detail._id = global.userDetails._id;
    detail.profileImg = global.userDetails.profileImg;
    detail.lastName = global.userDetails.lastName;
    detail.batch = global.userDetails.batch;
    detail.firstName = global.userDetails.firstName;
    detail.profession = global.userDetails.profession;
    detail.prefix = global.userDetails.prefix;
    detail.isOnline = true;
    detail.isAdmin = true;
    detail.color = Helper.getRandomLightColor();
    groupMembers.push(detail);

    selectedUser.map((item, index) => {
      userIds.push(item._id);
      detail = {};
      detail._id = item._id;
      detail.profileImg = item.profileImg;
      detail.lastName = item.lastName;
      detail.batch = item.batch;
      detail.firstName = item.firstName;
      detail.profession = item.profession;
      detail.prefix = item.prefix;
      detail.isOnline = false;
      detail.color = Helper.getRandomLightColor();
      groupMembers.push(detail);
    });

    const result = await checkUserExist(userIds, true);

    if (result !== undefined && result !== null) {
      if (result.length === userIds.length) {
        result.forEach(element => {
          if (!element.chatEnabled) {
            disabledIds.push(element._id);
            isAnyMemberDisabled = true;
            disabledUserMessage =
              disabledUserMessage +
              Helper.capitalize(Helper.concatName(element)) +
              ' - ' +
              element.batch +
              '\n';
          }
        });

        if (isAnyMemberDisabled) {
          setIsLoading(false);
          Alert.alert(
            'Error',
            'Some members in your selected list have disabled their chat, so you cannot add them. The members are\n' +
              disabledUserMessage,
          );
        } else {
          generateGroups(groupMembers, result);
        }
      } else {
        var pendingUsers = [];
        userIds.forEach(userId => {
          const found = result.some(el => el._id === userId);
          if (!found) {
            const child = selectedUser.find(el => el._id === userId);
            pendingUsers.push(child);
          }
        });

        if (pendingUsers.length > 0) {
          let arrayList = [];
          for (const element of pendingUsers) {
            arrayList.push(
              new Promise(function (resolve, reject) {
                addUser(element._id, element, status => {
                  console.log(status);
                  resolve(status);
                });
              }),
            );
          }
          Promise.all(arrayList).then(() => {
            result.forEach(element => {
              if (!element.chatEnabled) {
                disabledIds.push(element._id);
                isAnyMemberDisabled = true;
                disabledUserMessage =
                  disabledUserMessage + Helper.concatName(element);
              }
            });
            if (isAnyMemberDisabled) {
              setIsLoading(false);
              Alert.alert(
                'Error',
                'Some group members disabled chat you cannot add them. Users are,\n' +
                  disabledUserMessage,
              );
            } else {
              generateGroups(groupMembers, result);
            }
          });
        }
      }
    }
  };

  const generateGroups = (groupMembers, userResults) => {
    createGroupChat(groupName, groupMembers, groupInfo => {
      console.log('groupInfo', groupInfo);
      if (groupInfo !== undefined && groupInfo !== null) {
        let title =
          Helper.capitalize(Helper.concatName(global.userDetails)) +
          ' added you to the group';
        let message = `\u201C${groupName}\u201D`;

        sendWelcomeMessage(
          true,
          userResults,
          title,
          message,
          groupInfo._id,
          () => {
            console.log('notification complete');
            setIsLoading(false);
            let payload = {
              challenger: challengerUser,
              threadId: groupInfo._id,
            };
            navigation.navigate('GroupChatScreen', payload);
          },
        );
      }
    });
  };

  // Filter section
  const changeText = text => {
    setSearchUserName(text);
    searchVal = text;
    if (text.length > 2) {
      setSearchedUser([]);
      doSearchUser(text);
    } else if (text.length < 2) {
      setSearchedUser([]);
    }
  };

  const doSearchUser = query => {
    getDirectory(
      '1',
      query,
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
        console.log('error', error);
      },
    );
  };

  const searchInput = () => {
    return (
      <View style={[grid.rowdir, g.mt10]}>
        <View style={[g.inputNew, grid.rowdir]}>
          <GlobalInclude.BaseIcon
            containerStyle={styles.searchIcon}
            iconColor={'#dddddd'}
            iconName={'search'}
            iconSize={scale(20)}
            iconType={IconType[4]}
          />
          <TextInput
            underlineColorAndroid="transparent"
            value={searchUserName}
            style={[g.pl0, g.fs14, grid.col, grid.justifyContentCenter]}
            keyboardType={'default'}
            placeholder={'Type more than 3 characters'}
            onChangeText={text => {
              changeText(text);
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar title={'Start Chat'} navigation={navigation} showBack={true} />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}>
          <View style={GlobalInclude.AppStyle.fill}>
            <View style={[grid.flex1, g.pl10, g.pr10, g.mt10]}>
              <Text
                numberOfLines={2}
                style={[
                  g.FHNM,
                  g.fs15,
                  g.colorBlack,
                  GlobalInclude.AppStyle.transform,
                ]}>
                Type of Message
              </Text>
              <View style={styles.buttonContainer}>
                <View style={grid.flex1}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      backgroundColor:
                        chatType === 1
                          ? GlobalInclude.Color.ColorPrimary
                          : '#f8f8f8',
                      textAlign: 'center',
                      fontSize: scale(16),
                      borderRadius: scale(8),
                      width: '100%',
                      height: scale(38),
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      setSearchUserName('');
                      setSearchedUser([]);
                      setSelectedUser([]);
                      setchatType(1);
                    }}>
                    <Text
                      style={{
                        fontSize: scale(14),
                        color:
                          chatType === 1
                            ? '#ffffff'
                            : GlobalInclude.Color.ColorPrimary,
                        fontFamily: 'Lato-Regular',
                        textAlign: 'center',
                      }}>
                      1 ON 1
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginHorizontal: scale(10)}} />
                <View style={grid.flex1}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      backgroundColor:
                        chatType === 2
                          ? GlobalInclude.Color.ColorPrimary
                          : '#f8f8f8',
                      textAlign: 'center',
                      fontSize: scale(16),
                      borderRadius: scale(8),
                      width: '100%',
                      height: scale(38),
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      setSearchUserName('');
                      setSearchedUser([]);
                      setSelectedUser([]);
                      setchatType(2);
                    }}>
                    <Text
                      style={{
                        fontSize: scale(14),
                        color:
                          chatType === 2
                            ? '#ffffff'
                            : GlobalInclude.Color.ColorPrimary,
                        fontFamily: 'Lato-Regular',
                        textAlign: 'center',
                      }}>
                      MULTI USER
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[g.mt10, g.mb5]} />
              {chatType === 1 ? (
                <View>
                  <Text
                    numberOfLines={2}
                    style={[
                      g.FHNM,
                      g.fs15,
                      g.colorBlack,
                      GlobalInclude.AppStyle.transform,
                    ]}>
                    Send Message to
                  </Text>
                  {searchInput()}
                </View>
              ) : (
                <View>
                  <View style={g.mb15}>
                    <Text
                      numberOfLines={2}
                      style={[
                        g.FHNM,
                        g.fs15,
                        g.colorBlack,
                        GlobalInclude.AppStyle.transform,
                      ]}>
                      Set Group name
                    </Text>
                    <TextInput
                      underlineColorAndroid="transparent"
                      style={[g.inputWhite, g.mt10]}
                      value={groupName}
                      maxLength={100}
                      keyboardType={'default'}
                      autoCapitalize={'words'}
                      returnKeyType={'done'}
                      placeholder={'Enter your text here'}
                      onChangeText={value => {
                        setGroupName(value);
                      }}
                    />
                  </View>

                  <View style={g.mb15}>
                    <Text
                      numberOfLines={2}
                      style={[
                        g.FHNM,
                        g.fs15,
                        g.colorBlack,
                        GlobalInclude.AppStyle.transform,
                      ]}>
                      Add Members
                    </Text>
                    {searchInput()}
                  </View>
                </View>
              )}

              {searchedUser.length > 0 && (
                <AutoSuggestUser
                  searchedUser={searchedUser}
                  onPress={(row, index) => {
                    if (chatType === 1) {
                      let itemArray = [];
                      itemArray.push(row);
                      setSelectedUser([...itemArray]);
                      setSearchedUser([]);
                      setSearchUserName('');
                      Keyboard.dismiss();
                    } else {
                      let oldData = selectedUser;

                      let isExist = oldData.findIndex(
                        item => item._id === row._id,
                      );

                      if (isExist > -1) {
                        Alert.alert(
                          'You have already selected this participant',
                          '',
                        );
                      } else {
                        oldData.push(row);
                        setSelectedUser([...oldData]);
                        setSearchedUser([]);
                        setSearchUserName('');
                        Keyboard.dismiss();
                      }
                    }
                  }}
                />
              )}

              <View style={g.mt15}>
                {selectedUser.length > 0 ? (
                  <Text style={[g.fs14, g.FHNB, g.colordarkGray]}>
                    Selected
                  </Text>
                ) : null}
                <View
                  style={[
                    grid.row,
                    selectedUser.length > 2 ? grid.justifyContent : '',
                    grid.flexwrap,
                  ]}>
                  {selectedUser.map((item, index) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onLongPress={() => {
                          lastIndex = index;
                          setShowRemoveAlert(true);
                        }}
                        key={index}
                        style={[
                          {
                            marginLeft: 10,
                            width: width / 3 - 40,
                            marginRight: selectedUser.length > 2 ? 10 : 20,
                            paddingTop: scale(10),
                          },
                        ]}>
                        <View
                          style={[g.bglightGray, g.oh, {borderRadius: 100}]}>
                          <ProgresImage
                            source={
                              item.profileImg != null && item.profileImg !== ''
                                ? {uri: item.profileImg}
                                : GlobalInclude.Assets.DefaultProfile
                            }
                            containerStyle={{
                              aspectRatio: 1 / 1,
                            }}
                            mode={'cover'}
                          />
                        </View>
                        <View style={{height: 80}}>
                          <Text
                            style={[
                              g.FHNR,
                              g.txtCenter,
                              g.colorBlack,
                              g.fs14,
                              g.mt8,
                            ]}
                            numberOfLines={2}>
                            {Helper.capitalize(Helper.concatName(item))}
                          </Text>

                          <Text
                            style={[
                              g.FHNR,
                              g.txtCenter,
                              g.colorGray,
                              g.fs12,
                              g.mt2,
                            ]}
                            numberOfLines={2}>
                            {item.designation}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
            <View style={styles.postButtonContainer}>
              {selectedUser.length > 0 && (
                <CommonButton
                  showLoader={isLoading}
                  title={'Start Chat'}
                  onPress={() => {
                    if (!isLoading) {
                      setIsLoading(true);
                      if (chatType === 1) {
                        validateUser();
                      } else {
                        if (selectedUser.length > 10) {
                          Alert.alert(
                            'Max limit exceeded',
                            'Multi user chat is available for groups of 10 users or less only. Please limit the number of people in this chat to 10 or fewer.',
                          );
                        } else {
                          createGroup();
                        }
                      }
                    }
                  }}
                />
              )}
            </View>
          </View>
        </ScrollView>

        {showRemoveAlert && (
          <ModelAlert
            status={true}
            header={'Are you sure you would like to remove this user?'}
            okButton={'Okay'}
            okAction={() => {
              setShowRemoveAlert(false);
              let oldData = selectedUser;
              oldData.splice(lastIndex, 1);
              setSelectedUser([...oldData]);
            }}
            cancelButton={'Cancel'}
            cancelAction={() => {
              setShowRemoveAlert(false);
            }}
            closeAction={() => {
              setShowRemoveAlert(false);
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    paddingTop: scale(10),
    paddingBottom: scale(10),
  },
  postButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
  },
  searchIcon: {
    height: scale(20),
    width: scale(20),
    alignSelf: 'center',
    marginEnd: scale(6),
    marginStart: scale(6),
  },
});

export default StartChatWith;
