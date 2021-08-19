import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  BackHandler,
  ScrollView,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import TopHeaderView from '../../component/TopHeaderView';
import ProgressImage from '../../component/ProgresImage';
import SingleSearchWithFilter from '../../component/SingleSearchWithFilter';
import {
  renderNoDataComponent,
  generateMenuOption,
  showProgess,
} from '../../component/Common';
import {IconType, APP_NAME} from '../../helper/Constants';
import Helper from '../../helper/Helper';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import Highlighter from '../../component/HighlightWord';
import {CommonActions} from '@react-navigation/native';

// Firestore
import {useCollection} from 'react-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';
import {
  setUserLastSeen,
  addUserToBlockList,
  setLatestUnread,
} from '../../helper/ChatHelper';

const chatCollection = firestore().collection('Chats');
const usersCollection = firestore().collection('Users');

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
  fetching: 3,
};

let finalItemsArray = [];
let tmpArray = [];
let selectedIndex = -1;
let challengerUser = null;
let backHandler = null;
let pendingUnreads = false;

const ChatUserList = ({navigation}) => {
  const refOptions = useRef();
  const refPostOptions = useRef();
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.allLoaded,
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [blockedUser, setBlockedUser] = useState([]);
  // const [snapshot, loading, error] = useCollection(
  //   chatCollection.where('users', 'array-contains', global.userId),
  // );
  const [snapshot] = useCollection(
    usersCollection.where('_id', '==', global.userId),
  );

  useEffect(() => {
    /**
     *
     * This will make user online
     */
    setUserLastSeen(true, new Date().getTime(), () => {});

    tmpArray = [];
    setChatList([]);
  }, [navigation]);

  useEffect(() => {
    /**
     * We get user own details also
     */
    if (snapshot !== undefined && snapshot !== null) {
      if (
        snapshot.docs !== undefined &&
        snapshot.docs !== null &&
        snapshot.docs.length > 0
      ) {
        let data = snapshot.docs[0].data();
        if (data && data !== null && data !== undefined) {
          challengerUser = data;
          setBlockedUser(data.blockedUser);
        }
      }
    }

    return () => {};
  }, [snapshot]);

  useEffect(() => {
    let subscriber;

    navigation.addListener('focus', () => {
      executeFunctions();
    });
    navigation.addListener('blur', () => {
      if (subscriber !== undefined && subscriber !== null) {
        subscriber();
        subscriber = null;
      }
    });

    const executeFunctions = () => {
      subscriber = chatCollection
        .where('users', 'array-contains', global.userId)
        .onSnapshot((query) => {
          setPaginationStatus(PaginationStatus.fetching);
          if (!query.empty) {
            tmpArray = [];
            query.docs.forEach((item) => {
              let data = item.data();
              tmpArray.push(data);
            });

            tmpArray.sort(function (x, y) {
              return y.lastMessageTime - x.lastMessageTime;
            });

            finalItemsArray = tmpArray;
            pendingUnreads = false;
            for (let i = 0; i < tmpArray.length; i++) {
              const element = tmpArray[i];
              let unreadCount = getChatCount(element.unreadCount);
              if (unreadCount > 0) {
                pendingUnreads = true;
                break;
              }
            }

            if (!pendingUnreads) {
              setLatestUnread(false, global.userId, () => {
                setChatList(tmpArray);
                setPaginationStatus(PaginationStatus.waiting);
                setFirstTimeLoad(false);
              });
            } else {
              setFirstTimeLoad(false);
              setChatList(tmpArray);
              setPaginationStatus(PaginationStatus.waiting);
            }

            // var allComplete = new Promise((resolve, reject) => {
            //   tmpArray.forEach((element, index, array) => {
            //     let data = element;

            //     if (!data.isGroup) {
            //       let users = data.users;
            //       let opponentUser = users.filter(
            //         (userId) => global.userId !== userId,
            //       );

            //       var isExist = allUsersArray.filter(
            //         (user) => opponentUser[0] === user._id,
            //       );

            //       if (isExist.length === 0) {
            //         checkUserExist(opponentUser[0])
            //           .then((result) => {
            //             data.opponentUser = result;
            //           })
            //           .then(() => {
            //             if (index === array.length - 1) {
            //               resolve();
            //             }
            //           });
            //       } else {
            //         data.opponentUser = isExist[0];
            //         if (index === array.length - 1) {
            //           resolve();
            //         }
            //       }
            //     }
            //   });
            // });

            // allComplete.then(() => {
            //   setFirstTimeLoad(false);
            //   setChatList(tmpArray);
            //   setPaginationStatus(PaginationStatus.waiting);
            //   console.log('====================================');
            //   console.log('all task complete', tmpArray.length);
            //   console.log('====================================');
            // });
          } else {
            setFirstTimeLoad(false);
            setPaginationStatus(PaginationStatus.waiting);
          }
        });
    };

    const backAction = () => {
      if (navigation.isFocused()) {
        setUserLastSeen(false, new Date().getTime(), () => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            }),
          );
        });

        return true;
      }
    };

    backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      if (subscriber !== undefined && subscriber !== null) {
        subscriber();
      }
      if (backHandler !== undefined && backHandler !== null) {
        backHandler.remove();
      }
    };
  }, [navigation]);

  const inArray = (needle, haystack) => {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
      if (haystack[i].toLocaleLowerCase().includes(needle)) {
        return true;
      }
    }
    return false;
  };

  const filterResult = (searchText) => {
    setPaginationStatus(PaginationStatus.fetching);
    let oldData = finalItemsArray;

    if (searchText.trim().length === 0) {
      setIsFiltering(false);
      setChatList([...finalItemsArray]);
      setPaginationStatus(PaginationStatus.waiting);
    } else {
      setIsFiltering(true);
      let tempArray = [];
      var anotherArray = [];
      var itemOne = new Promise((resolve, reject) => {
        oldData.forEach((element, index, array) => {
          let userInfo = element.userInfo;
          let filteredX = userInfo.filter(
            (itemX) => itemX._id !== global.userId,
          );

          if (
            filteredX.length > 0 &&
            Helper.concatName(filteredX[0])
              .toLocaleLowerCase()
              .includes(searchText.toLocaleLowerCase())
          ) {
            tempArray.push(element);
          }
          if (index === array.length - 1) {
            resolve();
          }
        });
      });

      itemOne.then(() => {
        setChatList([...tempArray]);
        var itemTwo = new Promise((resolve, reject) => {
          oldData.forEach((element, index, array) => {
            let latestMessages = element.latestMessages;
            let filteredX = latestMessages.filter((itemX) =>
              itemX.message
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase()),
            );
            if (filteredX.length > 0) {
              filteredX.forEach((child) => {
                let item = {
                  type: '2',
                  element: child,
                  threadId: element._id,
                };
                anotherArray.push(item);
              });
            }
            if (index === array.length - 1) {
              resolve();
            }
          });
        });

        itemTwo.then(() => {
          setMessages([...anotherArray]);
          setPaginationStatus(PaginationStatus.waiting);
        });
      });

      // if (tempArray.length > 0) {
      //   setChatList([...tempArray]);
      //   setPaginationStatus(PaginationStatus.waiting);
      // } else {
      //   setChatList([]);
      //   setPaginationStatus(PaginationStatus.waiting);
      // }
    }
  };

  const markAllRead = () => {
    if (selectedItem !== undefined && selectedItem !== null) {
      let refId = selectedItem._id;
      let unreadCount = selectedItem.unreadCount;

      unreadCount.forEach((element) => {
        if (element.userId === global.userId) {
          element.count = 0;
        }
      });

      let updateObject = {
        unreadCount: unreadCount,
      };

      chatCollection
        .doc(refId)
        .update(updateObject)
        .then(() => {
          let oldData = chatList;
          oldData[selectedIndex].unreadCount = unreadCount;
          setChatList([...oldData]);
        });
    }
  };
  const muteConversion = () => {
    if (selectedItem !== undefined && selectedItem !== null) {
      let refId = selectedItem._id;
      let mutedBy = selectedItem.mutedBy;

      const index = mutedBy.indexOf(global.userId);
      if (index > -1) {
        mutedBy.splice(index, 1);
      } else {
        mutedBy.push(global.userId);
      }

      let updateObject = {
        mutedBy: mutedBy,
      };

      chatCollection.doc(refId).update(updateObject);
    }
  };

  const blockUser = (wantBlock) => {
    if (selectedItem !== undefined && selectedItem !== null) {
      let opponentUser = getOpponentInfo(selectedItem.userInfo);
      Alert.alert(
        wantBlock ? 'Block User' : 'Unblock User',
        `Are you sure you want to ${
          wantBlock ? 'Block' : 'Unblock'
        } ${Helper.capitalize(Helper.concatName(opponentUser))}?`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              addUserToBlockList(opponentUser._id, (status) => {
                Alert.alert(
                  status
                    ? `User ${wantBlock ? 'Blocked' : 'Unblocked'} successfully`
                    : `Erorr while ${
                        wantBlock ? 'blocking' : 'unblocking'
                      } user`,
                );
              });
            },
          },
        ],
      );
    }
  };

  const getChatCount = (unreadCount) => {
    let countData = unreadCount.filter((user) => global.userId === user.userId);

    if (
      countData.length === 0 ||
      countData === undefined ||
      countData === null
    ) {
      return 0;
    } else {
      return countData[0].count;
    }
  };

  const isConversionMuted = (mutedBy) => {
    let isMuted = mutedBy.filter((user) => global.userId === user);

    if (isMuted.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const getOpponentInfo = (userList) => {
    if (userList !== undefined && userList !== null && userList !== '') {
      for (let i = 0; i < userList.length; i++) {
        const element = userList[i];
        if (element._id !== global.userId) {
          return element;
        }
      }
    }

    return null;
  };

  const isUserBlocked = (userInfo) => {
    let opponentUser = getOpponentInfo(userInfo);

    if (opponentUser !== undefined && opponentUser !== null) {
      let isExist = blockedUser.filter((user) => opponentUser._id === user);
      return isExist.length > 0;
    }
    return false;
  };

  const showItem = (item, index) => {
    let itemImage = '';
    let headerTitle = APP_NAME;
    let subHeader = '';
    let unreadCount = getChatCount(item.unreadCount);
    let opponentUser = null;
    let emptyPicMsg = '';
    if (!item.isGroup) {
      opponentUser = getOpponentInfo(item.userInfo);
      if (opponentUser !== undefined && opponentUser !== null) {
        if (
          opponentUser.profileImg !== undefined &&
          opponentUser.profileImg !== null &&
          opponentUser.profileImg !== ''
        ) {
          itemImage = {uri: opponentUser.profileImg};
        }
        headerTitle =
          Helper.concatName(opponentUser) + ' - ' + opponentUser.batch;

        emptyPicMsg = opponentUser.firstName.charAt(0);
        subHeader = opponentUser.profession;
      }
    } else {
      if (
        item.profileImg !== undefined &&
        item.profileImg !== null &&
        item.profileImg !== ''
      ) {
        itemImage = {uri: item.profileImg};
      }
      headerTitle = item.groupName;
      emptyPicMsg = item.groupName.charAt(0);
    }

    let mediaIcon = null;
    let mediaIconType = null;
    if (item.lastMessageType === 2) {
      mediaIcon = 'camera';
      mediaIconType = 'feather';
    } else if (item.lastMessageType === 3) {
      mediaIcon = 'video';
      mediaIconType = 'feather';
    } else if (item.lastMessageType === 4) {
      mediaIcon = 'audiotrack';
      mediaIconType = 'material-icon';
    } else if (item.lastMessageType === 5) {
      mediaIcon = 'file-pdf-o';
      mediaIconType = 'font-awesome';
    }

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (challengerUser.chatEnabled) {
            let payload = {
              challenger: challengerUser,
              opponent: opponentUser || {},
              chatDetail: item,
              threadId: item._id,
            };
            //navigation.navigate('ChatScreen', payload);
            navigation.replace('ChatScreen', payload);
          } else {
            Alert.alert(
              'Chat Disabled',
              'Your chat has been disabled from settings.You can no longer send and receive messages.',
            );
          }
        }}
        onLongPress={() => {
          if (
            refPostOptions.current !== undefined &&
            refPostOptions.current !== null
          ) {
            selectedIndex = index;
            setSelectedItem(item);
            refPostOptions.current.open();
          }
        }}
        style={[
          grid.rowdir,
          g.bggray3,
          g.mb10,
          {
            borderRadius: scale(10),
            paddingHorizontal: scale(6),
            paddingTop: scale(8),
            paddingBottom: scale(8),
          },
        ]}
        key={index}>
        <View
          style={[
            g.mr10,
            g.bggray,
            g.oh,
            grid.alignItems,
            grid.justifyContentCenter,
            {
              width: scale(45),
              height: scale(45),
              borderRadius: scale(50),
            },
          ]}>
          {itemImage !== undefined && itemImage !== null && itemImage !== '' ? (
            <ProgressImage
              source={itemImage}
              containerStyle={styles.imageStyle}
              mode={'cover'}
            />
          ) : (
            <Text
              style={[
                g.fs32,
                g.FHNM,
                g.colorWhite,
                GlobalInclude.AppStyle.transform,
              ]}>
              {emptyPicMsg}
            </Text>
          )}
        </View>
        <View style={grid.flex1}>
          <View style={[grid.rowdir, grid.alignItemsTop]}>
            <View style={grid.col}>
              <Text
                style={[
                  g.fs13,
                  g.FHNM,
                  g.colorBlue,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {headerTitle}
              </Text>
              {/* {subHeader !== undefined && subHeader !== '' && (
                <Text
                  style={[
                    g.fs12,
                    g.FHNM,
                    g.colorBlue,
                    GlobalInclude.AppStyle.transform,
                    g.mt2,
                  ]}>
                  {subHeader}
                </Text>
              )} */}
            </View>
            {item.lastMessageTime > 0 && (
              <Text
                style={[
                  g.fs13,
                  g.FHNM,
                  unreadCount > 0 ? g.colorBlue : g.colordarkGray,
                ]}>
                {Helper.getChatDate(item.lastMessageTime)}
              </Text>
            )}
          </View>
          <View style={grid.rowdir}>
            <View style={[grid.col, g.mt5]}>
              <View style={[grid.rowdir]}>
                {mediaIcon !== null && (
                  <View style={[g.mr5]}>
                    <GlobalInclude.BaseIcon
                      containerStyle={{height: scale(16), width: scale(16)}}
                      iconColor={'#A9A9A9'}
                      iconName={mediaIcon}
                      iconSize={scale(14)}
                      iconType={mediaIconType}
                    />
                  </View>
                )}
                {item.lastMessage !== undefined &&
                item.lastMessage !== null &&
                item.lastMessage !== '' ? (
                  <Text
                    numberOfLines={2}
                    style={[
                      g.fs12,
                      g.FHNR,
                      g.colorBlack,
                      g.txtCenterVertical,
                      g.textJustify,
                    ]}>
                    {item.lastMessage}
                  </Text>
                ) : (
                  <Text
                    style={[
                      g.fs12,
                      g.FHNR,
                      g.colorBlack,
                      g.txtCenterVertical,
                      g.textJustify,
                    ]}>
                    No Messages yet!
                  </Text>
                )}
              </View>
            </View>
            <View
              style={[
                g.ml5,
                grid.alignItems,
                grid.justifyContentCenter,
                grid.rowrow,
              ]}>
              {isConversionMuted(item.mutedBy) && (
                <View style={[g.ml5, g.mr5]}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(18), width: scale(18)}}
                    iconColor={GlobalInclude.Color.ColorPrimary}
                    iconName={'volume-mute'}
                    iconSize={scale(18)}
                    iconType={IconType[1]}
                  />
                </View>
              )}
              {unreadCount > 0 && (
                <View style={styles.unreadCount}>
                  <Text
                    style={[
                      g.fs13,
                      g.FHNB,
                      g.colorWhite,
                      g.txtCenter,
                      grid.alignItems,
                    ]}>
                    {unreadCount > 99 ? '+99' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({index, item}) => {
    return showItem(item, index);
  };

  const renderFilterItem = (item, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          if (challengerUser.chatEnabled) {
            let payload = {
              threadId: item.threadId,
            };
            //navigation.replace('ChatScreen', payload);
            navigation.navigate('ChatScreen', payload);
          } else {
            Alert.alert(
              'Chat Disabled',
              'Your chat has been disabled from settings.You can no longer send and receive messages.',
            );
          }
        }}>
        <View
          style={[
            g.mb10,
            {
              paddingHorizontal: scale(6),
              paddingTop: scale(8),
              paddingBottom: scale(8),
              borderBottomWidth: 0.5,
              borderBottomColor: '#cccccc',
            },
          ]}>
          <Text
            style={[
              g.fs13,
              g.FHNB,
              g.colorBlue,
              GlobalInclude.AppStyle.transform,
              g.mb5,
            ]}>
            {item.element.userName}
          </Text>
          <Highlighter
            highlightStyle={{backgroundColor: 'yellow'}}
            searchWords={[filterQuery]}
            textToHighlight={item.element.message}
            style={[
              g.fs12,
              g.FHNR,
              g.colorBlack,
              g.txtCenterVertical,
              g.textJustify,
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const userOptions = () => {
    return (
      <OptionsSheet
        ref={refOptions}
        minClosingHeight={50}
        height={300}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View stylre={[grid.flex1, g.mb10]}>
          {generateMenuOption(
            'Start a new conversation',
            'add-to-list',
            9,
            () => {
              refOptions.current.close();
              if (challengerUser.chatEnabled) {
                setTimeout(() => {
                  navigation.navigate('StartChatWith');
                }, 220);
              } else {
                Alert.alert(
                  'Chat Disabled',
                  'Your chat has been disabled from settings.You can no longer send and receive messages.',
                );
              }
            },
          )}

          {generateMenuOption('My Settings', 'setting', 10, () => {
            refOptions.current.close();
            setTimeout(() => {
              navigation.navigate('ChatSettings');
            }, 220);
          })}

          {generateMenuOption(
            'Chat Etiquette ',
            'exclamationcircleo',
            10,
            () => {
              refOptions.current.close();
              setTimeout(() => {
                navigation.navigate('ChatEtiquette');
              }, 220);
            },
          )}
        </View>
      </OptionsSheet>
    );
  };

  const postOptions = () => {
    return (
      <OptionsSheet
        ref={refPostOptions}
        minClosingHeight={50}
        height={300}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View stylre={[grid.flex1, g.mb10]}>
          {selectedItem !== null &&
            selectedItem !== undefined &&
            generateMenuOption('Mark as Read', 'add-to-list', 9, () => {
              refPostOptions.current.close();
              setTimeout(() => {
                markAllRead();
              }, 205);
            })}

          {selectedItem !== null &&
          selectedItem !== undefined &&
          isConversionMuted(selectedItem.mutedBy)
            ? generateMenuOption(
                'UnMute This conversation',
                'unmute',
                5,
                () => {
                  refPostOptions.current.close();
                  setTimeout(() => {
                    muteConversion();
                  }, 205);
                },
              )
            : generateMenuOption('Mute This conversation', 'mute', 5, () => {
                refPostOptions.current.close();
                setTimeout(() => {
                  muteConversion();
                }, 205);
              })}

          {selectedItem !== null &&
            selectedItem !== undefined &&
            !selectedItem.isGroup && (
              <View>
                {isUserBlocked(selectedItem.userInfo)
                  ? generateMenuOption(
                      'Unblock This Sender',
                      'exclamationcircleo',
                      10,
                      () => {
                        refPostOptions.current.close();
                        setTimeout(() => {
                          blockUser(false);
                        }, 205);
                      },
                    )
                  : generateMenuOption(
                      'Block This Sender',
                      'exclamationcircleo',
                      10,
                      () => {
                        refPostOptions.current.close();
                        setTimeout(() => {
                          blockUser(true);
                        }, 205);
                      },
                    )}
              </View>
            )}
        </View>
      </OptionsSheet>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <TopHeaderView
        index={12}
        navigation={navigation}
        label={'Chat'}
        showLabel={false}
        customIcon={{
          containerStyle: {height: scale(24), width: scale(24)},
          iconColor: GlobalInclude.Color.ColorPrimary,
          iconName: 'dots-horizontal',
          size: scale(24),
          type: IconType[1],
        }}
        customIconPress={() => {
          if (refOptions.current !== undefined && refOptions.current !== null) {
            refOptions.current.open();
          }
        }}
        customDelegate={() => {
          setUserLastSeen(false, new Date().getTime(), () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Dashboard'}],
              }),
            );
          });
        }}
        openNewPage={(page) => {
          setUserLastSeen(false, new Date().getTime(), () => {
            navigation.navigate(page);
          });
        }}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.fill}>
          <View style={grid.flex1}>
            {firstTimeLoad ? (
              <View style={GlobalInclude.AppStyle.fillCenter}>
                <ActivityIndicator
                  size={'small'}
                  color={GlobalInclude.Color.ColorPrimary}
                />
              </View>
            ) : (
              <View style={[GlobalInclude.AppStyle.contentSpaceHorizonta]}>
                <SingleSearchWithFilter
                  placeholder={'Search'}
                  filterQuery={filterQuery}
                  changeText={(text) => {
                    setFilterQuery(text);
                    filterResult(text);
                  }}
                  showGoButton={false}
                  onFilterPress={() => {}}
                  hideFilter={true}
                />
                {!isFiltering ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    extraData={chatList}
                    data={chatList}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.1}
                    ListEmptyComponent={renderNoDataComponent}
                    contentContainerStyle={{
                      paddingBottom: scale(70),
                      paddingTop: scale(10),
                    }}
                  />
                ) : (
                  <View>
                    {chatList.length === 0 && messages.length === 0 ? (
                      renderNoDataComponent()
                    ) : (
                      <View>
                        <ScrollView
                          showsVerticalScrollIndicator={false}
                          contentContainerStyle={{flexGrow: 1}}>
                          {chatList.length > 0 && (
                            <View>
                              <Text
                                style={[
                                  g.fs20,
                                  g.FHNB,
                                  g.colorBlue,
                                  GlobalInclude.AppStyle.transform,
                                ]}>
                                Chats
                              </Text>
                              {chatList.map((item, index) => {
                                return showItem(item, index);
                              })}
                            </View>
                          )}
                          {messages.length > 0 && (
                            <View>
                              <Text
                                style={[
                                  g.fs20,
                                  g.FHNB,
                                  g.colorBlue,
                                  GlobalInclude.AppStyle.transform,
                                ]}>
                                Messages
                              </Text>
                              {messages.map((item, index) => {
                                return renderFilterItem(item, index);
                              })}
                            </View>
                          )}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
        {/* {showProgess(paginationStatus === PaginationStatus.fetching)} */}
        {userOptions()}
        {postOptions()}

        <View style={styles.chatIcon}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              if (challengerUser.chatEnabled) {
                setTimeout(() => {
                  navigation.navigate('StartChatWith');
                }, 220);
              } else {
                Alert.alert(
                  'Chat Disabled',
                  'Your chat has been disabled from settings.You can no longer send and receive messages.',
                );
              }
            }}
            style={[grid.alignItems, grid.justifyContentCenter]}>
            <GlobalInclude.BaseIcon
              containerStyle={{height: scale(25), width: scale(25)}}
              iconColor={'#fff'}
              iconName={'chat'}
              iconSize={scale(25)}
              iconType={IconType[9]}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    width: scale(45),
    justifyContent: 'center',
  },
  unreadCount: {
    borderRadius: scale(100),
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
  },
  chatIcon: {
    position: 'absolute',
    bottom: scale(10),
    right: scale(10),
    height: scale(46),
    width: scale(46),
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    borderRadius: scale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatUserList;
