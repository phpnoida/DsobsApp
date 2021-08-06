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
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import TopHeaderView from '../../component/TopHeaderView';
import ProgressImage from '../../component/ProgresImage';
import {
  renderNoDataComponent,
  generateMenuOption,
  showProgess,
} from '../../component/Common';
import {IconType, APP_NAME} from '../../helper/Constants';
import Helper from '../../helper/Helper';
import moment from 'moment';
import OptionsSheet from 'react-native-raw-bottom-sheet';
// Firestore
import {
  useCollection,
  useCollectionDataOnce,
} from 'react-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';
import {
  checkUserExist,
  setUserLastSeen,
  addUserToBlockList,
} from '../../helper/ChatHelper';

const chatCollection = firestore().collection('Chats');

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
  fetching: 3,
};

let tmpArray = [];
let allUsersArray = [];
let selectedIndex = -1;
let challengerUser = null;

const ChatUserList = ({navigation}) => {
  const refOptions = useRef();
  const refPostOptions = useRef();
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.allLoaded,
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [snapshot, loading, error] = useCollectionDataOnce(
    chatCollection.where('users', 'array-contains', global.userId),
  );

  useEffect(() => {
    /**
     *
     * This will make user online
     */
    setUserLastSeen(true, new Date().getTime(), () => {});

    /**
     * We get user own details also
     */
    checkUserExist(global.userId).then((result) => {
      if (result !== undefined && result !== null) {
        challengerUser = result;
      }
    });

    tmpArray = [];
    allUsersArray = [];
    setChatList([]);
  }, []);

  // useEffect(() => {
  //   let subscriber;

  //   navigation.addListener('focus', () => {
  //     executeFunctions();
  //   });
  //   navigation.addListener('blur', () => {
  //     subscriber();
  //   });

  //   const executeFunctions = () => {
  //     subscriber = chatCollection
  //       .where('users', 'array-contains', global.userId)
  //       .onSnapshot((query) => {
  //         setPaginationStatus(PaginationStatus.fetching);
  //         if (!query.empty) {
  //           tmpArray = [];
  //           query.docs.forEach((item) => {
  //             let data = item.data();
  //             tmpArray.push(data);
  //           });

  //           var allComplete = new Promise((resolve, reject) => {
  //             tmpArray.forEach((element, index, array) => {
  //               let data = element;

  //               if (!data.isGroup) {
  //                 let users = data.users;
  //                 let opponentUser = users.filter(
  //                   (userId) => global.userId !== userId,
  //                 );

  //                 var isExist = allUsersArray.filter(
  //                   (user) => opponentUser[0] === user._id,
  //                 );

  //                 if (isExist.length === 0) {
  //                   checkUserExist(opponentUser[0])
  //                     .then((result) => {
  //                       data.opponentUser = result;
  //                     })
  //                     .then(() => {
  //                       if (index === array.length - 1) {
  //                         resolve();
  //                       }
  //                     });
  //                 } else {
  //                   data.opponentUser = isExist[0];
  //                   if (index === array.length - 1) {
  //                     resolve();
  //                   }
  //                 }
  //               }
  //             });
  //           });

  //           allComplete.then(() => {
  //             setFirstTimeLoad(false);
  //             setChatList(tmpArray);
  //             setPaginationStatus(PaginationStatus.waiting);
  //             console.log('====================================');
  //             console.log('all task complete', tmpArray.length);
  //             console.log('====================================');
  //           });
  //         }
  //       });
  //   };

  //   return () => {
  //     console.log('blur');
  //     subscriber();
  //   };
  // }, [navigation]);

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

  const blockUser = () => {
    if (selectedItem !== undefined && selectedItem !== null) {
      Alert.alert(
        'Block User',
        `Are you sure you want to block ${Helper.concatName(
          selectedItem.opponentUser,
        )}?`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              addUserToBlockList(selectedItem.opponentUser._id, (status) => {
                Alert.alert(
                  status
                    ? 'User Blocked successfully'
                    : 'Erorr while blocking user',
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
    for (let i = 0; i < userList.length; i++) {
      const element = userList[i];
      if (element._id !== global.userId) {
        return element;
      }
    }
    return null;
  };

  const renderItem = ({index, item}) => {
    let itemImage = GlobalInclude.Assets.DefaultProfile;
    let headerTitle = APP_NAME;
    let subHeader = '';
    let unreadCount = getChatCount(item.unreadCount);
    let opponentUser = null;
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
    }

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          let payload = {
            challenger: challengerUser,
            opponent: opponentUser || {},
            chatDetail: item,
          };
          //navigation.navigate('ChatScreen', payload);
          navigation.replace('ChatScreen', payload);
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
              width: scale(40),
              height: scale(40),
              borderRadius: scale(50),
            },
          ]}>
          <ProgressImage
            source={itemImage}
            containerStyle={styles.imageStyle}
            mode={'cover'}
          />
        </View>
        <View style={grid.flex1}>
          <View style={[grid.rowdir]}>
            <View style={[grid.alignItemsTop, grid.col]}>
              <Text
                style={[
                  g.fs15,
                  g.FHNM,
                  g.colorBlue,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {headerTitle}
              </Text>
              {subHeader !== undefined && subHeader !== '' && (
                <Text
                  style={[
                    g.fs12,
                    g.FHNM,
                    g.colorBlue,
                    GlobalInclude.AppStyle.transform,
                  ]}>
                  {subHeader}
                </Text>
              )}
            </View>
            {item.lastMessageTime > 0 && (
              <Text
                style={[
                  g.fs12,
                  g.FHNR,
                  g.colorBlue,
                  grid.justifyContentCenter,
                  grid.alignItems,
                ]}>
                {moment(item.lastMessageTime).fromNow()}
              </Text>
            )}
          </View>
          <View style={grid.rowdir}>
            <View style={grid.col}>
              {item.lastMessage !== undefined &&
              item.lastMessage !== null &&
              item.lastMessage !== '' ? (
                <Text
                  style={[
                    g.fs12,
                    g.FHNR,
                    g.colorBlack,
                    g.txtCenterVertical,
                    g.mt5,
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
                    g.mt5,
                    g.textJustify,
                  ]}>
                  No Messages yet!
                </Text>
              )}
            </View>
            {unreadCount > 0 && (
              <View style={styles.unreadCount}>
                <Text
                  style={[
                    g.fs15,
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
        <View style={[g.ml5, grid.alignItems, grid.justifyContentCenter]}>
          {isConversionMuted(item.mutedBy) && (
            <GlobalInclude.BaseIcon
              containerStyle={{height: scale(20), width: scale(20)}}
              iconColor={GlobalInclude.Color.ColorPrimary}
              iconName={'sound-mute'}
              iconSize={scale(20)}
              iconType={IconType[9]}
            />
          )}
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
              setTimeout(() => {
                navigation.navigate('StartChatWith');
              }, 220);
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
            !selectedItem.isGroup &&
            generateMenuOption(
              'Block This Sender',
              'exclamationcircleo',
              10,
              () => {
                refPostOptions.current.close();
                setTimeout(() => {
                  blockUser();
                }, 205);
              },
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
      />
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.fill}>
          <View style={grid.flex1}>
            {loading ? (
              <View style={GlobalInclude.AppStyle.fillCenter}>
                <ActivityIndicator
                  size={'small'}
                  color={GlobalInclude.Color.ColorPrimary}
                />
              </View>
            ) : error ? (
              renderNoDataComponent()
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                extraData={snapshot}
                data={snapshot}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.1}
                ListEmptyComponent={renderNoDataComponent}
                contentContainerStyle={{
                  paddingBottom: scale(70),
                  paddingTop: scale(25),
                  paddingHorizontal: scale(15),
                }}
              />
            )}
          </View>
        </View>
        {showProgess(paginationStatus === PaginationStatus.fetching)}
        {userOptions()}
        {postOptions()}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    width: scale(40),
    justifyContent: 'center',
  },
  unreadCount: {
    height: scale(30),
    width: scale(30),
    borderRadius: scale(100),
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatUserList;
