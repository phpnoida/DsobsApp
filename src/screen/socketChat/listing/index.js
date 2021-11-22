import React, {useState, useEffect, useCallback, useRef} from 'react';
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
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {scale} from '../../../theme/Scalling';
import TopHeaderView from '../../../component/TopHeaderView';
import ProgressImage from '../../../component/ProgresImage';
import SingleSearchWithFilter from '../../../component/SingleSearchWithFilter';
import {generateMenuOption, showProgess} from '../../../component/Common';
import {IconType, APP_NAME} from '../../../helper/Constants';
import Helper from '../../../helper/Helper';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import {doGetChats, updateChatStatus} from '../../../Actions/SocketChatActions';
import {SERVER_PATH} from '../../../../config';
import _ from 'lodash';
import io from 'socket.io-client';

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
  fetching: 3,
};
let filterObject = {
  page: 1,
  limit: 10,
  search: '',
};

let totalPages = 0;
let currentPage = 1;
let searchQuery = '';
let myGroupIds = [];
let messageIds = [];
let chatItem = null;
let isChatEnabled = false;
let timerInterval = null;
let checkAlternate = false;

const ChatList = ({navigation}) => {
  const refOptions = useRef();
  const socketRef = useRef();
  const refPostOptions = useRef();

  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [postData, setPostData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.allLoaded,
  );
  const [selectedItem, setSelectedItem] = useState(null);

  /**
   * Socket section
   */

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      filterObject = {
        page: 1,
        limit: 10,
        search: '',
      };

      totalPages = 0;
      currentPage = 1;
      searchQuery = '';
      myGroupIds = [];
      messageIds = [];
      chatItem = null;
      isChatEnabled = false;
      timerInterval = null;
      checkAlternate = false;

      disconnectSocket();
      connectSocket();
      getGroupData();
    });

    const backAction = () => {
      disconnectSocket();
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      console.log('Line 88');
      if (backHandler !== undefined && backHandler !== null) {
        backHandler.remove();
      }
      unsubscribe();
      disconnectSocket();
    };
  }, [navigation, connectSocket, getGroupData]);

  const connectSocket = useCallback(() => {
    if (
      socketRef == null ||
      socketRef.current === null ||
      socketRef.current === undefined
    ) {
      socketRef.current = io(SERVER_PATH, {
        reconnectionAttempts: 2,
        transports: ['websocket'],
        upgrade: false,
      });
    }

    socketRef?.current?.on('connect', () => {
      if (socketRef?.current.connected) {
        joinSocketEvent();
        socketRef?.current.on('error', attempt => {
          console.log('errror', attempt);
        });

        socketRef?.current.on('disconnect', () => {
          console.log('socket disconnected'); // undefined
        });

        socketRef?.current.on('reconnect', attempt => {
          console.log('attempt', attempt);
        });
        socketRef?.current.on('reconnect_error', attempt => {
          console.log('reconnect_error', attempt);
        });
        socketRef?.current.on('reconnect_attempt', attempt => {
          console.log('reconnect_attempt', attempt);
        });

        socketRef?.current.once('user-connected', event => {
          console.log('connected', event);
          console.log('connected', event.status);
        });

        socketRef?.current?.removeListener('chat-user-subscribe');
        socketRef?.current.on('chat-user-subscribe', event => {
          console.log('connected', event);
        });

        socketRef?.current?.removeListener('chat-blocked-user');
        socketRef.current.on('chat-blocked-user', event => {
          // console.log('chat-blocked-user', event);
          if (event && event !== null && event !== undefined) {
            if (event.status) {
              getGroupData();
            }
          }
        });

        socketRef?.current?.removeListener('chat-unblocked-user');
        socketRef.current.on('chat-unblocked-user', event => {
          // console.log('chat-unblocked-user', event);
          if (event && event !== null && event !== undefined) {
            if (event.status) {
              getGroupData();
            }
          }
        });

        socketRef?.current?.removeListener('chat-read-all-message-ack');
        socketRef.current.on('chat-read-all-message-ack', event => {
          // console.log('chat-read-all-message-ack', event);
          if (event && event !== null && event !== undefined) {
            if (event.status) {
              getGroupData();
            }
          }
        });

        socketRef?.current?.removeListener('chat-status-ack');
        socketRef.current.on('chat-status-ack', event => {
          console.log('chat-status-ack', event);
          if (event && event !== null && event !== undefined) {
            if (event.status) {
              console.log('checkAlternate', checkAlternate);
              if (checkAlternate) {
                checkAlternate = false;
                chatStatus(event.chatStatus);
              } else {
                isChatEnabled = event.chatStatus === 1;
              }
            }
          }
        });
      }
    });
    /********************
     * Specific Events
     */
  }, [joinSocketEvent, getGroupData, chatStatus]);

  const pingYourSelf = useCallback(() => {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }
    timerInterval = setInterval(() => {
      if (socketRef.current !== undefined && socketRef.current !== null) {
        let payload = {
          userId: global.userId,
        };
        socketRef?.current?.emit('chat-user-ping', payload);
      }
    }, 3000);
  }, []);

  useEffect(() => {
    socketRef?.current?.removeListener('chat-created-list');
    socketRef?.current?.on('chat-created-list', event => {
      console.log('created-list', JSON.stringify(event));
      if (event && event !== null && event !== undefined) {
        if (event.status) {
          let chat = event.chat;
          let _id = chat._id;
          var index = postData.findIndex(x => x._id === _id);
          if (index < 0) {
            console.log('====================================');
            console.log('New Chat Added');
            console.log('====================================');
            mergeGroups(chat);
          }
        }
      }
    });

    if (socketRef.current !== undefined && socketRef.current !== null) {
      socketRef?.current?.removeListener('chat-get-message');
      socketRef?.current.on('chat-get-message', event => {
        if (event && event !== null && event !== undefined) {
          let message = event.message;
          let exist = _.includes(messageIds, message._id);
          if (!exist) {
            console.log('====================================');
            console.log('useEffect-message-209', message);
            console.log('====================================');
            updateCountInGroup(message);
          }
        }
      });
    }
  }, [postData, mergeGroups, updateCountInGroup]);

  const mergeGroups = useCallback(
    chat => {
      let oldData = postData;
      chat.unreadMessageCount = 0;
      oldData.push(chat);

      let exist = _.includes(myGroupIds, chat._id);
      if (!exist) {
        myGroupIds.push(chat._id);
        joinGroupWithSocket([chat._id]);
      }

      setPostData([...oldData]);
    },
    [postData, joinGroupWithSocket],
  );

  const disconnectSocket = () => {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }
    socketRef?.current?.removeListener('connect');
    socketRef?.current?.removeListener('error');
    socketRef?.current?.removeListener('disconnect');
    socketRef?.current?.removeListener('reconnect');
    socketRef?.current?.removeListener('reconnect_error');
    socketRef?.current?.removeListener('reconnect_attempt');
    socketRef?.current?.removeListener('user-connected');
    socketRef?.current?.removeListener('chat-subscribe-user');
    socketRef?.current?.removeListener('chat-created-list');
    socketRef?.current?.removeListener('chat-status-ack');
    socketRef?.current?.removeListener('chat-blocked-user');
    socketRef?.current?.removeListener('chat-unblocked-user');
    socketRef?.current?.disconnect();
    socketRef.current = null;
  };

  const joinSocketEvent = useCallback(() => {
    console.log('====================================');
    console.log('299');
    console.log('====================================');
    if (socketRef.current !== undefined && socketRef.current !== null) {
      let payload = {
        userId: global.userId,
      };
      console.log('payload', payload);
      socketRef?.current?.emit('chat-subscribe-user', payload);
    }
  }, []);

  const joinGroupWithSocket = useCallback(unJoined => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      unJoined.forEach(element => {
        let payload = {
          chatId: element,
          userId: global.userId,
        };
        console.log('payload', payload);
        setTimeout(() => {
          socketRef?.current?.emit('chat-subscribe-chat', payload);
        }, 100);
      });
    }
  }, []);

  const disconnectAllGroup = useCallback(() => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      myGroupIds.forEach((element, index) => {
        let payload = {
          groupId: element,
          userId: global.userId,
        };
        socketRef?.current?.emit('user-disconnect', payload);
      });
      disconnectSocket();
    }
  }, []);

  const updateCountInGroup = useCallback(
    message => {
      let oldData = postData;
      let index = _.findIndex(oldData, function (item) {
        return item._id === message.chatId;
      });
      if (index !== undefined && index !== null && index > -1) {
        let newCount = oldData[index].unreadMessageCount
          ? oldData[index].unreadMessageCount + 1
          : 1;
        oldData[index].unreadMessageCount = newCount;
        oldData[index].lastMessage = message;

        var placeholder = {};
        var objectToMove = oldData.splice(index, 1, placeholder)[0];
        oldData.splice(0, 0, objectToMove);
        oldData.splice(oldData.indexOf(placeholder), 1);

        setPostData([...oldData]);
      }
    },
    [postData],
  );

  const blockUser = useCallback(isBlocked => {
    if (socketRef?.current !== undefined && socketRef?.current !== null) {
      let payload = {
        blockUserId: chatItem.userId,
        blockByUserId: global.userId,
      };
      //{"blockByUserId": "602a65dca1714c5bd918612e", "blockUserId": undefined}
      console.log('blockUser', payload);
      if (isBlocked) {
        socketRef?.current?.emit('chat-block-user', payload);
      } else {
        socketRef?.current?.emit('chat-unblock-user', payload);
      }
    }
  }, []);

  const checkChatStatus = useCallback(userId => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      let payload = {
        userId: userId,
        _id: global.userId,
      };

      socketRef?.current?.emit('chat-status', payload);
    }
  }, []);

  const markAllMessageAsRead = useCallback(() => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      let payload = {
        userId: global.userId,
        chatId: chatItem._id,
      };

      socketRef?.current?.emit('chat-read-all-message', payload);
    }
  }, []);

  /**
   * Socket section
   */

  /**
   *
   * @API Section
   */
  const getGroupData = useCallback(() => {
    doGetChats(
      filterObject,
      response => {
        pingYourSelf();
        setTimeout(() => {
          checkChatStatus(global.userId);
        }, 200);
        setShowLoader(false);
        setFirstTimeLoad(false);
        manageResponse(response);
      },
      (code, error) => {
        setShowLoader(false);
        console.log('====================================');
        console.log('error,code', code, error);
        console.log('====================================');
        setFirstTimeLoad(false);
        setPostData([]);
      },
    );
  }, [manageResponse, checkChatStatus, pingYourSelf]);

  const updateConversion = useCallback(
    type => {
      updateChatStatus(
        type,
        chatItem._id,
        response => {
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.data !== null
            ) {
              let data = response.data;
              console.log('====================================');
              console.log('response: ' + data);
              console.log('====================================');
              if (data.status) {
                getGroupData();
              }
            }
          }
        },
        (error, message) => {
          console.log('====================================');
          console.log('error: ' + error, message);
          console.log('====================================');
        },
      );
    },
    [getGroupData],
  );

  /**
   *
   * @API Section
   */

  const chatStatus = useCallback(
    status => {
      if (status === 1) {
        disconnectAllGroup();
        let payload = {
          groupId: chatItem._id,
          chatType: chatItem.chatType,
          chatItem: chatItem,
        };
        navigation.navigate('MakeChat', payload);
      } else {
        Alert.alert('Feature not available', 'User has disabled Chat.');
      }
    },
    [disconnectAllGroup, navigation],
  );

  const updateConversionStatus = useCallback(
    type => {
      Alert.alert(
        type === 1 ? 'Mute Conversion' : 'Unmute Conversion',
        `Are you sure you want to ${
          type === 1 ? 'Mute Conversion' : 'Unmute Conversion'
        }?`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              updateConversion(type);
            },
          },
        ],
      );
    },
    [updateConversion],
  );

  const manageResponse = useCallback(
    response => {
      if (response && response !== null) {
        if (
          response.data &&
          response.data !== undefined &&
          response.data !== null
        ) {
          try {
            let data = response.data;
            totalPages = data.totalPages;
            currentPage = data.currentPage;

            if (data.status) {
              let arrayItems = data.groups;

              console.log('====================================');
              console.log('arrayItems', arrayItems);
              console.log('====================================');

              let result = [];
              arrayItems.forEach(element => {
                if (element.chatType === 0) {
                  if (element.isBlock === 0 && element.userStatusForChat) {
                    result.push(element._id);
                  }
                } else {
                  if (element.userStatusForChat) {
                    result.push(element._id);
                  }
                }
              });

              //let result = _.map(arrayItems, '_id');
              let isAnyNew = false;
              let unJoined = [];
              result.forEach(element => {
                let exist = _.includes(myGroupIds, element);
                if (!exist) {
                  unJoined.push(element);
                  isAnyNew = true;
                  myGroupIds.push(element);
                }
              });
              if (isAnyNew) {
                joinGroupWithSocket(unJoined);
              }

              // console.log('arrayItems', JSON.stringify(arrayItems));

              if (filterObject.page === 1) {
                setPostData([...arrayItems]);
              } else {
                let oldData = postData;
                var merge = _.merge(oldData, arrayItems);

                setPostData([...merge]);
              }
              setPaginationStatus(PaginationStatus.waiting);
            }
          } catch (error) {
            console.log('error', error);
            setPaginationStatus(PaginationStatus.allLoaded);
          }
        }
      }
    },
    [postData, joinGroupWithSocket],
  );

  /**
   *
   * Pagination
   *
   */

  const onEndReached = () => {
    if (totalPages <= currentPage) {
      setPaginationStatus(PaginationStatus.allLoaded);
      return;
    }
    if (paginationStatus === PaginationStatus.waiting) {
      onPaginate();
    }
  };

  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      setPaginationStatus(PaginationStatus.fetching);
      filterObject.page = filterObject.page + 1;
      getGroupData();
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(false);
    resetCount();
    getGroupData();
  };

  const resetCount = () => {
    totalPages = 0;
    currentPage = 1;
    filterObject = {};
    filterObject.page = 1;
    filterObject.limit = 10;
    filterObject.search = '';
  };

  /**
   *
   * Pagination
   *
   */

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
                navigation.navigate('CreateChat', {socket: socketRef?.current});
              }, 220);
            },
          )}

          {generateMenuOption('My Settings', 'setting', 10, () => {
            refOptions.current.close();
            setTimeout(() => {
              navigation.navigate('ChatUserSettings', {
                socket: socketRef?.current,
              });
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
                markAllMessageAsRead();
              }, 205);
            })}

          {selectedItem !== null &&
          selectedItem !== undefined &&
          selectedItem.isMute
            ? generateMenuOption(
                'UnMute This conversation',
                'unmute',
                5,
                () => {
                  refPostOptions.current.close();
                  setTimeout(() => {
                    updateConversionStatus(0);
                  }, 205);
                },
              )
            : generateMenuOption('Mute This conversation', 'mute', 5, () => {
                refPostOptions.current.close();
                setTimeout(() => {
                  updateConversionStatus(1);
                }, 205);
              })}

          {selectedItem !== null &&
            selectedItem !== undefined &&
            selectedItem.chatType === 0 && (
              <View>
                {selectedItem.isBlock === 1
                  ? generateMenuOption(
                      'Unblock This Sender',
                      'exclamationcircleo',
                      10,
                      () => {
                        refPostOptions.current.close();
                        setTimeout(() => {
                          blockUser(0);
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
                          blockUser(1);
                        }, 205);
                      },
                    )}
              </View>
            )}
        </View>
      </OptionsSheet>
    );
  };

  const renderItem = ({index, item}) => {
    let itemImage = '';
    let headerTitle = APP_NAME;
    let subHeader = '';
    let emptyPicMsg = '';

    if (
      item.profilePicture !== undefined &&
      item.profilePicture !== null &&
      item.profilePicture !== ''
    ) {
      itemImage = {uri: item.profilePicture};
    }

    headerTitle = item?.name;
    emptyPicMsg = item?.name?.charAt(0);

    let mediaIcon = null;
    let mediaIconType = null;
    let lastMsg = item.lastMessage;
    let lastMsgTime = 0;
    let messageText = '';
    let totalLines = 2;

    if (lastMsg !== undefined && lastMsg !== null) {
      lastMsgTime = lastMsg.createdAt;

      if (lastMsg?.media?.mediaType === 'IMAGE') {
        mediaIcon = 'camera';
        mediaIconType = 'feather';
        totalLines = 1;
        if (item.chatType === 1) {
          messageText = `${Helper.capitalize(lastMsg.authorId.firstName)}: ${
            lastMsg.messageText !== '' ? lastMsg.messageText : 'Image'
          }`;
        } else {
          messageText =
            lastMsg.messageText !== '' ? lastMsg.messageText : 'Image';
        }
      } else if (lastMsg?.media?.mediaType === 'VIDEO') {
        mediaIcon = 'video';
        mediaIconType = 'feather';
        totalLines = 1;
        if (item.chatType === 1) {
          messageText = `${Helper.capitalize(lastMsg.authorId.firstName)}: ${
            lastMsg.messageText !== '' ? lastMsg.messageText : 'Video'
          }`;
        } else {
          messageText =
            lastMsg.messageText !== '' ? lastMsg.messageText : 'Video';
        }
      } else if (lastMsg?.media?.mediaType === 'AUDIO') {
        mediaIcon = 'audiotrack';
        mediaIconType = 'material-icon';
        totalLines = 1;
        if (item.chatType === 1) {
          messageText = `${Helper.capitalize(lastMsg.authorId.firstName)}: ${
            lastMsg.messageText !== '' ? lastMsg.messageText : 'Audio'
          }`;
        } else {
          messageText =
            lastMsg.messageText !== '' ? lastMsg.messageText : 'Audio';
        }
      } else if (lastMsg?.media?.mediaType === 'DOCUMENT') {
        mediaIcon = 'file-pdf-o';
        mediaIconType = 'font-awesome';
        totalLines = 1;
        if (item.chatType === 1) {
          messageText = `${Helper.capitalize(lastMsg.authorId.firstName)}: ${
            lastMsg.messageText !== '' ? lastMsg.messageText : 'Document'
          }`;
        } else {
          messageText =
            lastMsg.messageText !== '' ? lastMsg.messageText : 'Document';
        }
      } else {
        if (item.chatType === 1) {
          messageText = `${Helper.capitalize(lastMsg.authorId.firstName)}: ${
            lastMsg.messageText
          }`;
        } else {
          messageText = lastMsg.messageText;
        }
      }
    }

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          console.log('item', JSON.stringify(item));
          chatItem = item;
          if (isChatEnabled) {
            if (item.chatType === 0) {
              checkAlternate = true;
              checkChatStatus(chatItem.userId);
            } else {
              disconnectAllGroup();
              let payload = {
                groupId: chatItem._id,
                chatType: chatItem.chatType,
                chatItem: chatItem,
              };
              navigation.navigate('MakeChat', payload);
            }
          } else {
            Alert.alert(
              'Chat Disabled',
              'Your chat has been disabled from settings.You can no longer send and receive messages.',
            );
          }
        }}
        onLongPress={() => {
          chatItem = item;
          setSelectedItem(item);
          if (
            refPostOptions.current !== undefined &&
            refPostOptions.current !== null
          ) {
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
          ) : item.isGroup ? (
            <GlobalInclude.BaseIcon
              containerStyle={{
                width: scale(35),
                height: scale(35),
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}
              iconColor={'white'}
              iconName={'groups'}
              iconSize={scale(30)}
              iconType={IconType[0]}
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
                  g.FHNB,
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
                    g.mt2,
                  ]}>
                  {subHeader}
                </Text>
              )}
            </View>
            {lastMsgTime > 0 && (
              <Text
                style={[
                  g.fs13,
                  g.FHNM,
                  item.unreadMessageCount > 0 ? g.colorBlue : g.colordarkGray,
                ]}>
                {Helper.getChatDate(lastMsgTime * 1000)}
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
                {messageText !== undefined &&
                messageText !== null &&
                messageText !== '' ? (
                  <Text
                    numberOfLines={totalLines}
                    style={[
                      g.fs12,
                      g.FHNR,
                      g.colorBlack,
                      g.txtCenterVertical,
                      g.textJustify,
                    ]}>
                    {messageText}
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
              {item?.isMute && (
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
              {!item.isGroup && item.isBlock === 1 && (
                <View style={[g.ml5, g.mr5]}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(18), width: scale(18)}}
                    iconColor={'red'}
                    iconName={'block'}
                    iconSize={scale(18)}
                    iconType={IconType[0]}
                  />
                </View>
              )}
              {item.unreadMessageCount > 0 && (
                <View style={styles.unreadCount}>
                  <Text
                    style={[
                      g.fs13,
                      g.FHNB,
                      g.colorWhite,
                      g.txtCenter,
                      grid.alignItems,
                    ]}>
                    {item.unreadMessageCount > 99
                      ? '+99'
                      : item.unreadMessageCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const noDataComponent = () => {
    return (
      <View style={GlobalInclude.AppStyle.fillColCenter}>
        <Text
          style={[
            g.colorBlack,
            g.FHNM,
            g.fs12,
            g.textCenter,
            grid.alignItems,
            grid.justifyContentCenter,
          ]}>
          No Record Found
        </Text>
      </View>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <TopHeaderView
        index={4}
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
          disconnectAllGroup();
          navigation.goBack();
        }}
        openNewPage={page => {
          disconnectAllGroup();
          navigation.navigate(page);
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
              <View style={[GlobalInclude.AppStyle.fill]}>
                <View style={[GlobalInclude.AppStyle.contentSpaceHorizonta]}>
                  <SingleSearchWithFilter
                    placeholder={'Search'}
                    filterQuery={filterQuery}
                    changeText={text => {
                      setFilterQuery(text);
                      if (text.length > 2) {
                        setPostData([]);
                        setTimeout(() => {
                          resetCount();
                          filterObject.search = text;
                          getGroupData();
                        }, 200);
                      }
                      if (text.length === 0 && searchQuery.length > 0) {
                        setPostData([]);
                        setTimeout(() => {
                          resetCount();
                          filterObject.search = '';
                          getGroupData();
                        }, 200);
                      }
                      searchQuery = text;
                    }}
                    showGoButton={false}
                    onFilterPress={() => {}}
                    hideFilter={true}
                  />
                </View>
                {showLoader ? (
                  <View style={GlobalInclude.AppStyle.fillCenter}>
                    <ActivityIndicator
                      size={'large'}
                      color={GlobalInclude.Color.ColorPrimary}
                    />
                  </View>
                ) : (
                  <FlatList
                    style={grid.col}
                    showsVerticalScrollIndicator={false}
                    extraData={postData}
                    data={postData}
                    onEndReachedThreshold={0.1}
                    onEndReached={onEndReached}
                    renderItem={renderItem}
                    ListEmptyComponent={noDataComponent}
                    contentContainerStyle={{
                      flexGrow: 1,
                      paddingStart: scale(15),
                      paddingEnd: scale(15),
                    }}
                    bounces={false}
                    keyExtractor={(v, i) => i.toString()}
                    scrollEventThrottle={16}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    handleRefresh={handleRefresh}
                  />
                )}
                {showProgess(paginationStatus === PaginationStatus.fetching)}
              </View>
            )}
          </View>
        </View>

        <View style={styles.chatIcon}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setTimeout(() => {
                navigation.navigate('CreateChat', {socket: socketRef?.current});
              }, 220);
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

      {userOptions()}
      {selectedItem !== null && postOptions()}
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
    width: scale(24),
    height: scale(24),
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

export default ChatList;
