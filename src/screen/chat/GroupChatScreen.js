import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  ActivityIndicator,
  Keyboard,
  BackHandler,
  Dimensions,
  ScrollView,
  AppState,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {showProgess} from '../../component/Common';
import UploadMedia from '../../component/UploadMedia';
import ProgressImage from '../../component/ProgresImage';
import DocViewer from '../../component/DocViewer';
import AudioPlayer from '../../component/AudioPlayer';
import ImageViewer from '../../component/ImageViewer';
import {showMediaType, showImageThumb} from './ChatDelegates';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {IconType} from '../../helper/Constants';
import ThreeDotsLoader from '../../helper/ThreeDotsLoader';
import ChatItem from './ChatItem';
import Helper from '../../helper/Helper';
import EmojiSelector from 'react-native-emoji-selector';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {getScrappedData} from '../../Actions/CommonActions';
import _ from 'lodash';

// Firestore
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {useCollection} from 'react-firebase-hooks/firestore';

import {
  updateChatObject,
  getChatObject,
  setLatestUnread,
  checkUserExist,
  sendWelcomeMessage,
} from '../../helper/ChatHelper';

const {height, width} = Dimensions.get('window');

let selectedFontSize = 1;
let challenger = null,
  opponent = null,
  isGroup = null;
var isChatExist = null;
let newItems = false;
let lastPickedMsgId = '';
let isStickerShowing = false;
let lastPickIndex = -1;
let blockMsg = '';
let inEditMode = false;
let documentItem = '';
let playAudio = '';
let extraObjects = null;
let latestMessageArray = [];
let bottomUnread = 0;
let newMessageList = [];
let inMessageThread = false;
let threadId = '';
let previousStatusOfTyping = false;
let wantsUpdateChilds = [];
let pendingChilds = [];
let imageArray = [];
let offlineUsers = [];
let messageColor = [];
let mutedBy = [];
let removedBy = [];
let groupMembers = [];
let isBackTap = false;
let memberKicked = false;

const scrollToBottomOffset = 200;
const chatCollection = firestore().collection('Chats');
const reference = database().ref('Messages');

const GroupChatScreen = ({route}) => {
  const appState = useRef(AppState.currentState);
  const uploadRef = useRef();
  const emojiRef = useRef();
  const animRef = useRef();
  const chatObjRef = useRef();
  const chatRef = useRef();
  const messageInfoRef = useRef();

  const navigation = useNavigation();

  const transform =
    Platform.OS === 'android'
      ? [{scaleY: -1}, {perspective: 1280}]
      : [{scaleY: -1}];

  const [nextState, setNextState] = useState(appState.current);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [fontSize, setFontSize] = useState(scale(14));
  const [scaleSize, setScaleSize] = useState(scale(22));
  const [inputValue, setInputValue] = useState('');
  const [header, setHeader] = useState('');
  const [subHeader, setSubHeader] = useState('');
  const [typingUser, setTypingUser] = useState('');
  const [headerImage, setHeaderImage] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [messageThreadId, setMessageThreadId] = useState('');
  const [selectedChatObject, setSelectedChatObject] = useState(null);
  const [isReplayEditComment, setIsReplayEditComment] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [emojiIconWidth, setEmojiIconWidth] = useState(scale(40));
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [bottomMessages, setBottomMessages] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [chatObjectSnapshot] = useCollection(
    messageThreadId !== ''
      ? chatCollection.where('_id', '==', messageThreadId)
      : null,
  );

  /**
   *
   * General
   */

  useEffect(() => {
    updateResources();
  }, [updateResources]);

  const updateResources = useCallback(() => {
    resetOldData();
    if (
      route !== undefined &&
      route.params !== undefined &&
      route.params !== null
    ) {
      threadId =
        route.params.threadId !== undefined && route.params.threadId !== null
          ? route.params.threadId
          : null;

      challenger =
        route.params.challenger !== undefined &&
        route.params.challenger !== null
          ? route.params.challenger
          : null;

      if (threadId !== null) {
        isGroup = true;
        offlineSelf(true, () => {
          validateChatScreen();
        });
      }
    }
  }, [route, validateChatScreen, offlineSelf]);

  const validateChatScreen = useCallback(() => {
    getChatObject(threadId, response => {
      if (response && response !== null && response !== undefined) {
        isChatExist = response;
        let userNames = [];
        inMessageThread = true;
        offlineUsers = [];
        messageColor = [];
        mutedBy = response.mutedBy;
        removedBy = response.removed;
        let info = response.userInfo;

        if (
          removedBy !== undefined &&
          removedBy !== null &&
          removedBy.length > 0
        ) {
          var isExist = removedBy.findIndex(x => x._id === global.userId);
          if (isExist > -1) {
            var infoIndex = info.findIndex(x => x._id === global.userId);
            if (infoIndex > -1) {
              info.splice(infoIndex, 1);
            }

            info.forEach(element => {
              if (element._id !== global.userId) {
                groupMembers.push(element);
                userNames.push(Helper.capitalize(element.firstName));
                messageColor.push({color: element.color, userId: element._id});
              }
            });
            memberKicked = true;
            //removedBy
            blockMsg =
              removedBy[isExist].removedBy === 1
                ? 'You have exited this group.'
                : 'The Admin has removed you.';
            setChatEnabled(false);
            reference
              .child(threadId)
              .limitToFirst(removedBy[isExist].count)
              .once('value')
              .then(snapshot => {
                updateMessages(
                  snapshot,
                  snapshots => {
                    if (snapshots && snapshots !== undefined) {
                      let systemMsg = {
                        system: true,
                        message: 'You left',
                        createdAt: new Date().getTime(),
                        messageType: 1,
                        media: '',
                        user: getUserObject(),
                        isSent: true,
                        isDelivered: true,
                        isRead: true,
                        replay: {},
                        removedBy: [],
                      };
                      snapshots.push(systemMsg);

                      let msgList = snapshots.reverse();

                      setMessages([...msgList]);
                      setIsFirstLoad(false);
                    }
                  },
                  true,
                );
              });

            let subTitle = '';
            userNames.forEach((item, index) => {
              subTitle += item + ', ';
            });
            subTitle = subTitle.replace(/,\s*$/, '');
            subTitle = subTitle + ', You';

            setHeader(response.groupName);
            if (
              response.profileImg !== null &&
              response.profileImg !== undefined &&
              response.profileImg !== ''
            ) {
              setHeaderImage({uri: response.profileImg});
            }

            setSubHeader(subTitle);
            setProfileLoading(false);
          } else {
            setMessageThreadId(threadId);
          }
        } else {
          setMessageThreadId(threadId);
        }
      }
    });
  }, [updateMessages]);

  /**
   *
   * General
   */

  /**
   *
   * @UseEffects
   */

  useEffect(() => {
    if (chatObjectSnapshot !== undefined && chatObjectSnapshot !== null) {
      if (
        chatObjectSnapshot.docs !== undefined &&
        chatObjectSnapshot.docs !== null &&
        chatObjectSnapshot.docs.length > 0
      ) {
        let data = chatObjectSnapshot.docs[0].data();
        if (data && data !== null && data !== undefined) {
          isChatExist = data;

          latestMessageArray =
            data.latestMessages !== undefined && data.latestMessages !== null
              ? data.latestMessages
              : [];

          setHeader(data.groupName);
          if (
            data.profileImg !== null &&
            data.profileImg !== undefined &&
            data.profileImg !== ''
          ) {
            setHeaderImage({uri: data.profileImg});
          }
          let userNames = [];
          inMessageThread = true;
          offlineUsers = [];
          messageColor = [];
          mutedBy = data.mutedBy;
          removedBy = data.removed;

          let info = data.userInfo;

          if (removedBy !== undefined && removedBy !== null) {
            for (var i = info.length - 1; i >= 0; i--) {
              const element = info[i];
              var isExist = removedBy.findIndex(x => x._id === element._id);
              if (isExist > -1) {
                info.splice(i, 1);
              }
            }
          }

          groupMembers = [];
          info.forEach(element => {
            if (element._id !== global.userId) {
              groupMembers.push(element);
              userNames.push(Helper.capitalize(element.firstName));
              messageColor.push({color: element.color, userId: element._id});
            }

            if (!element.isOnline) {
              offlineUsers.push(element);
              inMessageThread = false;
            }
          });
          var loggedInUserStatus = true;
          if (
            data.removed !== undefined &&
            data.removed !== null &&
            data.removed.length > 0
          ) {
            var isExist = data.removed.findIndex(x => x._id === global.userId);
            if (isExist > -1) {
              memberKicked = true;
              blockMsg = 'You have exited this group.';
              setChatEnabled(false);
              loggedInUserStatus = false;
              shutAllListeners();
            }
          } else {
            memberKicked = false;
            loggedInUserStatus = true;
            setChatEnabled(true);

            // if (memberKicked) {
            //   memberKicked = false;
            //   onAllListeners();
            // }

            let isAnyTyping = false;
            data.isTyping.forEach(item => {
              if (item.userId !== global.userId && item.status) {
                isAnyTyping = true;
                setTypingUser(`${item.userName} typing...`);
              }
            });

            if (!isAnyTyping) {
              setTypingUser('');
            }
          }

          if (!memberKicked) {
            if (userNames.length > 0) {
              let subTitle = '';
              userNames.forEach((item, index) => {
                subTitle += item + ', ';
              });
              subTitle = subTitle.replace(/,\s*$/, '');
              if (loggedInUserStatus) {
                subTitle = subTitle + ', You';
              }

              // let subTitle = loggedInUserStatus
              //   ? userNames.join() + ', You'
              //   : userNames.join() + '';
              setSubHeader(subTitle);
            } else {
              setSubHeader('You');
            }
          }

          setProfileLoading(false);
        }
      }
    }
  }, [chatObjectSnapshot, refreshChatItems, shutAllListeners, onAllListeners]);

  const refreshChatItems = useCallback(
    isOnline => {
      if (pendingChilds.length > 0) {
        let cloneArray = _.cloneDeep(pendingChilds);
        let isAnyChildFound = false;
        let oldData = messages;

        cloneArray.forEach(element => {
          if (!isGroup) {
            if (element.user._id === global.userId) {
              if (isOnline) {
                if (
                  element.isDelivered === undefined ||
                  !element.isDelivered ||
                  element.isRead === undefined ||
                  !element.isRead
                ) {
                  isAnyChildFound = true;
                  element.isRead = true;
                  element.isDelivered = true;
                }
              } else {
                if (element.isDelivered === undefined || !element.isDelivered) {
                  isAnyChildFound = true;
                  element.isDelivered = true;
                }
              }
              oldData[oldData.findIndex(el => el._id === element._id)] =
                element;
            }
          }
        });

        if (isAnyChildFound) {
          if (oldData.length > 0) {
            setMessages([...oldData]);
          }
          setTimeout(() => {
            updateChatMessages(cloneArray, isOnline);
          }, 200);
        } else {
          if (
            isChatExist !== undefined &&
            isChatExist !== null &&
            inMessageThread
          ) {
            let isFound = false;
            let unreadCount = isChatExist.unreadCount;
            unreadCount.forEach(element => {
              if (element.userId === global.userId) {
                if (element.count > 0) {
                  isFound = true;
                  element.count = 0;
                }
              }
            });

            if (isFound) {
              const request = {
                unreadCount: unreadCount,
              };
              console.log('427', isChatExist);
              updateChatObject(threadId, request, () => {});
            }
          }
        }
      }
    },
    [messages],
  );

  /**FirebaseFunction */
  const onError = error => {
    console.log('====================================');
    console.log('firebase error', error);
    console.log('====================================');
  };

  /**FirebaseFunction */

  /**Firebase All functions Hook**/
  useEffect(() => {
    if (
      messageThreadId === '' ||
      messageThreadId === null ||
      messageThreadId === undefined
    ) {
      return;
    }

    const mainRef = reference.child(threadId).ref;
    let childAddedHandler;

    const onChildAdded = (child, previousKey) => {
      if (!newItems || lastPickedMsgId === child.val()._id) {
        return;
      }
      if (child && child !== null && child !== undefined) {
        let nextMsg = JSON.parse(JSON.stringify(child.val()));
        let msgUser = nextMsg.user;
        if (
          msgUser._id !== undefined &&
          msgUser._id !== null &&
          msgUser._id !== global.userId
        ) {
          if (showScrollToBottom) {
            newMessageList = append(newMessageList, child.val());
          } else {
            setMessages(previousMessages =>
              append(previousMessages, child.val()),
            );
          }
        } else {
          setMessages(previousMessages =>
            append(previousMessages, child.val()),
          );
        }
        if (showScrollToBottom) {
          bottomUnread = bottomUnread + 1;
          setBottomMessages(bottomUnread);
        }
      }
    };

    const onValue = snapshots => {
      if (snapshots && snapshots !== undefined) {
        let msgList = snapshots.reverse();
        setMessages([...msgList]);
        setIsFirstLoad(false);
        newItems = true;
        childAddedHandler = mainRef
          .limitToLast(1)
          .on('child_added', onChildAdded, onError);
      }
    };

    const onInitialLoad = objectValue => {
      const snapshotVal = objectValue.val();
      let childrenToProcess = snapshotVal
        ? Object.keys(objectValue.val()).length
        : 0;

      if (childrenToProcess === 0) {
        onValue([]);
      } else {
        updateMessages(objectValue, onValue, false);
      }
    };

    mainRef.once('value', onInitialLoad, onError);

    const _handleAppStateChange = state => {
      console.log('state-597', state);
      if (appState.current.match(/inactive|background/) && state === 'active') {
        console.log('App has come to the foreground!');
        updateResources();
        newItems = true;
        lastPickedMsgId = '';
        // let previousMessages = messages;
        // console.log('previousMessages',previousMessages);
        // updateMessages(previousMessages, onValue, false);
      } else if (state === 'background' || state === 'inactive') {
        console.log('App gone to the background!');
        if (!isBackTap) {
          isBackTap = true;
          offlineSelf(false, () => {});
        }
      }
      appState.current = state;
      setNextState(appState.current);
    };

    const backAction = () => {
      setUserLastSeenAndMakeOffline();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      mainRef.off('child_added', childAddedHandler);
      if (backHandler !== undefined && backHandler !== null) {
        backHandler.remove();
      }
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [
    messages,
    messageThreadId,
    showScrollToBottom,
    setUserLastSeenAndMakeOffline,
    updateMessages,
    offlineSelf,
    updateResources,
  ]);
  /**Firebase All functions Hook**/

  /**Firebase child change Hook**/
  useEffect(() => {
    //console.log('messageThreadId', messageThreadId);
    if (
      messageThreadId === '' ||
      messageThreadId === undefined ||
      messageThreadId === null
    ) {
      return;
    }
    const mainRef = reference.child(messageThreadId).ref;

    const onChildChanged = childChanged => {
      if (childChanged && childChanged !== null && childChanged !== undefined) {
        console.log('====================================');
        console.log('childChanged', childChanged.val());
        console.log('====================================');
        let nextMsg = JSON.parse(JSON.stringify(childChanged.val()));
        let msgUser = nextMsg.user;
        if (
          msgUser._id !== undefined &&
          msgUser._id !== null &&
          msgUser._id === global.userId
        ) {
          let oldData = messages;
          oldData[oldData.findIndex(el => el._id === nextMsg._id)] = nextMsg;
          if (oldData.length > 0) {
            setMessages([...oldData]);
          }
        }
      }
    };

    const childChangedHandler = mainRef.on(
      'child_changed',
      onChildChanged,
      onError,
    );
    return () => {
      mainRef.off('child_changed', childChangedHandler);
    };
  }, [messageThreadId, messages]);

  const shutAllListeners = useCallback(() => {
    if (threadId !== undefined && threadId !== null && threadId !== '') {
      const mainRef = reference.child(threadId).ref;
      mainRef.off('child_changed');
      mainRef.off('child_added');
    }
  }, []);

  const onAllListeners = useCallback(() => {
    if (threadId !== undefined && threadId !== null && threadId !== '') {
      const mainRef = reference.child(threadId).ref;
      mainRef.on('child_changed');
      mainRef.on('child_added');
    }
  }, []);

  const updateMessages = useCallback((objectValue, onValue, isBlocked) => {
    const children = [];
    let arrayItems = [];
    wantsUpdateChilds = [];
    pendingChilds = [];
    let unreadPosition = -1;
    let unreadCount = 0;
    let isAnyChildFound = false;
    let childrenToProcess = Object.keys(objectValue.val()).length;
    try {
      objectValue.forEach((item, index, array) => {
        let element = item.val();
        childrenToProcess--;
        let readBy = element.readBy;
        let user = element.user;

        if (user._id !== global.userId) {
          if (readBy !== undefined && readBy !== null) {
            const found = readBy.some(el => el._id === global.userId);
            if (!found) {
              isAnyChildFound = true;
              unreadCount++;
              if (unreadPosition === -1) {
                unreadPosition = index;
              }
              readBy.push({
                _id: global.userId,
                fullName: Helper.capitalize(
                  Helper.concatName(global.userDetails),
                ),
                isRead: true,
              });
              wantsUpdateChilds.push(element);
            }
          } else {
            readBy = [];
            groupMembers.forEach(group => {
              if (group.isOnline && group._id !== user._id) {
                readBy.push({
                  _id: group._id,
                  fullName: Helper.capitalize(Helper.concatName(group)),
                  isRead: true,
                });
              }
            });
            unreadCount++;
            if (unreadPosition === -1) {
              unreadPosition = index;
            }
            readBy.push({
              _id: global.userId,
              fullName: Helper.capitalize(
                Helper.concatName(global.userDetails),
              ),
              isRead: true,
            });
            element.readBy = readBy;
            wantsUpdateChilds.push(element);
            isAnyChildFound = true;
          }
        }
        if (
          removedBy !== undefined &&
          removedBy !== null &&
          removedBy.length > 0 &&
          isChatExist !== undefined &&
          isChatExist !== null
        ) {
          for (let t = 0; t < removedBy.length; t++) {
            const removeItem = removedBy[t];
            if (index === removeItem.count) {
              var isExist = isChatExist.userInfo.findIndex(
                x => x._id === removeItem._id,
              );
              let userIn = isChatExist.userInfo[isExist];
              if (isExist > -1) {
                let msg = '';
                if (removeItem.removedBy === 1) {
                  if (userIn._id === global.userId) {
                    msg = 'You left';
                  } else {
                    msg = Helper.capitalize(userIn.firstName) + ' left';
                  }
                } else {
                  msg =
                    'Admin has removed ' + Helper.capitalize(userIn.firstName);
                }
                let systemMsg = {
                  system: true,
                  message: msg,
                  createdAt: new Date().getTime(),
                  messageType: 1,
                  media: '',
                  user: getUserObject(),
                  isSent: true,
                  isDelivered: true,
                  isRead: true,
                  replay: {},
                  removedBy: [],
                };
                children.push(systemMsg);
              }
            }
          }
        }

        children.push(element);
        arrayItems.push(element);

        if (childrenToProcess === 0) {
          lastPickedMsgId = element._id;

          if (
            removedBy !== undefined &&
            removedBy !== null &&
            removedBy.length > 0 &&
            isChatExist !== undefined &&
            isChatExist !== null
          ) {
            removedBy.forEach(remove => {
              if (remove.count >= Object.keys(objectValue.val()).length) {
                var available = isChatExist.userInfo.findIndex(
                  x => x._id === remove._id,
                );

                if (available > -1) {
                  let userIn = isChatExist.userInfo[available];
                  let msg = '';
                  if (remove.removedBy === 1) {
                    if (userIn._id === global.userId) {
                      msg = 'You left';
                    } else {
                      msg = Helper.capitalize(userIn.firstName) + ' left';
                    }
                  } else {
                    msg =
                      'Admin has removed ' +
                      Helper.capitalize(userIn.firstName);
                  }

                  let memberMsg = {
                    system: true,
                    message: msg,
                    createdAt: new Date().getTime(),
                    messageType: 1,
                    media: '',
                    user: getUserObject(),
                    isSent: true,
                    isDelivered: true,
                    isRead: true,
                    replay: {},
                    removedBy: [],
                  };
                  children.push(memberMsg);
                }
              }
            });
          }

          let systemMsg = {
            system: true,
            message: `(${unreadCount}) Unread Messages`,
            createdAt: new Date().getTime(),
            messageType: 1,
            media: '',
            user: getUserObject(),
            isSent: true,
            isDelivered: true,
            isRead: true,
            replay: {},
            removedBy: [],
          };
          if (!isBlocked) {
            if (unreadPosition > -1) {
              children.splice(unreadPosition, 0, systemMsg);
            }
          }

          onValue(children);

          if (isAnyChildFound && wantsUpdateChilds.length > 0 && !isBlocked) {
            setTimeout(() => {
              updateChatMessages(wantsUpdateChilds, inMessageThread);
            }, 500);
          }
        }
      });
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  /**Firebase child change Hook**/

  /**
   *
   * @param {*} currentMessages
   * @param {*} message
   * @UseEffects
   */

  /**
   *
   * @ChatMethod
   *
   */

  const append = (currentMessages = [], message) => {
    if (!Array.isArray(message)) {
      message = [message];
    }
    return message.concat(currentMessages);
  };

  const sendUserTyping = typing => {
    if (previousStatusOfTyping !== typing) {
      previousStatusOfTyping = typing;

      if (isChatExist !== undefined && isChatExist !== null) {
        let isTyping = updateTyping(isChatExist.isTyping, typing);
        if (isTyping !== undefined && isTyping !== null) {
          const request = {
            isTyping: isTyping,
          };
          updateChatObject(threadId, request, () => {});
        }
      }
    }
  };

  const offlineSelf = useCallback((status, callback) => {
    if (threadId !== undefined && threadId !== null && threadId !== '') {
      getChatObject(threadId, response => {
        //console.log('response', response);
        if (response && response !== null && response !== undefined) {
          let userInfo = response.userInfo;
          let unreadCount = response.unreadCount;
          let isTyping = updateTyping(response.isTyping, false);
          let found = false;
          if (userInfo !== undefined && userInfo !== null) {
            var isExist = userInfo.findIndex(x => x._id === global.userId);
            if (isExist > -1) {
              found = true;
              userInfo[isExist].isOnline = status;
            }
          }

          let request = {};
          if (isTyping !== undefined && isTyping !== null) {
            request.isTyping = isTyping;
          }
          if (found) {
            request.userInfo = userInfo;
          }

          if (status) {
            var isFound = false;
            unreadCount.forEach(element => {
              if (element.userId === global.userId) {
                if (element.count > 0) {
                  isFound = true;
                  element.count = 0;
                }
              }
            });
            if (isFound) {
              request.unreadCount = unreadCount;
            }
          }

          if (found) {
            updateChatObject(threadId, request, () => {
              callback(true);
            });
          } else {
            callback(false);
          }
        } else {
          callback(false);
        }
      });
    } else {
      callback(false);
    }
  }, []);

  const updateChatMessages = (messageArray, clearArray) => {
    var rv = {};

    messageArray.forEach(element => {
      rv[element._id] = element;
    });

    if (threadId !== '') {
      reference
        .child(threadId)
        .update(rv)
        .then(() => {
          if (clearArray) {
            wantsUpdateChilds = [];
            pendingChilds = [];
            if (inMessageThread) {
              let foundData = false;
              getChatObject(threadId, response => {
                if (response && response !== null && response !== undefined) {
                  let unreadCount = response.unreadCount;
                  unreadCount.forEach(element => {
                    if (element.userId === global.userId) {
                      if (element.count > 0) {
                        element.count = 0;
                        foundData = true;
                      }
                    }
                  });
                  if (foundData) {
                    const request = {
                      unreadCount: unreadCount,
                    };
                    updateChatObject(threadId, request, () => {});
                  }
                }
              });
            }
          }
        });
    }
  };

  /**
   *
   * @ChatMethod
   *
   */
  /**
   *
   * @ChatMethodAddObject
   *
   */

  const userLastMessage = request => {
    let message = '';
    if (request.messageType === 1) {
      message = request.message;
    } else if (request.messageType === 2) {
      message =
        request.message !== null &&
        request.message !== undefined &&
        request.message !== ''
          ? request.message
          : 'Photo';
    } else if (request.messageType === 3) {
      message =
        request.message !== null &&
        request.message !== undefined &&
        request.message !== ''
          ? request.message
          : 'Video';
    } else if (request.messageType === 4) {
      message =
        request.message !== null &&
        request.message !== undefined &&
        request.message !== ''
          ? request.message
          : 'Audio';
    } else if (request.messageType === 5) {
      message =
        request.message !== null &&
        request.message !== undefined &&
        request.message !== ''
          ? request.message
          : request.extraObjects.fileName;
    } else if (request.messageType === 6) {
      message = request.message;
    }
    return message;
  };

  const addObjectToChat = (request, chatId) => {
    let childRef = reference.child(chatId);
    childRef.push().then(snap => {
      const _id = snap.key;
      request._id = _id;
      snap.set(request).then(() => {
        setIsSending(false);
        let message = userLastMessage(request);
        if (!inMessageThread) {
          pendingChilds.push(JSON.parse(JSON.stringify(request)));
          let itemObject = setLastMessage(message, chatId, request.messageType);
          if (itemObject !== undefined && itemObject !== null) {
            setUnreadCount(itemObject);
          }
          let promiseArray = [];
          console.log('offlineUsers', offlineUsers);
          let userIds = [];

          offlineUsers.forEach(element => {
            var isExist = removedBy.findIndex(x => x._id === element);

            if (isExist === -1) {
              let index = mutedBy.findIndex(id => id === element._id);
              if (index === -1) {
                userIds.push(element._id);
              }
              promiseArray.push(
                new Promise(function (resolve, reject) {
                  setLatestUnread(true, element._id, () => {
                    resolve(true);
                  });
                }),
              );
            }
          });

          Promise.all(promiseArray).then(() => {
            let messageElement =
              Helper.capitalize(global.userDetails.firstName) + ' ' + message;
            promiseArray = [];
            if (userIds.length > 0) {
              checkUserExist(userIds, true).then(result => {
                if (result !== undefined && result !== null) {
                  sendWelcomeMessage(
                    true,
                    result,
                    isChatExist.groupName,
                    messageElement,
                    threadId,
                    () => {
                      console.log('notification complete');
                    },
                  );
                }
              });
            }
          });
        } else {
          let itemObject = setLastMessage(message, chatId, request.messageType);
          updateChatObject(chatId, itemObject, () => {});
        }
        previousStatusOfTyping = false;
        setInputValue('');
        isStickerShowing = false;
        setEmojiIconWidth(scale(40));
        animRef.current.slideInLeft().then(() => {});
        if (isReplayEditComment) {
          scrollToBottom();
          setIsReplayEditComment(false);
          setSelectedChatObject(null);
        }
      });
    });
  };

  const updateTyping = (isTyping, status) => {
    if (isTyping !== undefined && isTyping !== null) {
      let element = {
        userId: global.userId,
        status: status,
        userName: Helper.capitalize(Helper.concatName(global.userDetails)),
      };
      isTyping[isTyping.findIndex(el => el.userId === global.userId)] = element;
    }
    return isTyping;
  };

  const setLastMessage = (lastMsg, mediaType) => {
    if (isChatExist !== undefined && isChatExist !== null) {
      let isTyping = updateTyping(isChatExist.isTyping, false);
      const request = {
        lastMessage:
          Helper.capitalize(global.userDetails.firstName) + ': ' + lastMsg,
        lastMessageTime: new Date().getTime(),
        lastMessageType: mediaType,
        isTyping: isTyping,
      };

      if (mediaType === 1) {
        if (latestMessageArray.length > 99) {
          latestMessageArray.splice(0, 1);
          let item = {
            userName: Helper.capitalize(Helper.concatName(challenger)),
            message: lastMsg,
          };
          latestMessageArray.push(item);
        } else {
          let item = {
            userName: Helper.capitalize(Helper.concatName(challenger)),
            message: lastMsg,
          };
          latestMessageArray.push(item);
        }
        request.latestMessages = latestMessageArray;
      }

      return request;
    }
    return null;
  };

  const setUnreadCount = requestObject => {
    getChatObject(threadId, response => {
      if (response && response !== null && response !== undefined) {
        let unreadCount = response.unreadCount;

        unreadCount.forEach(element => {
          if (element.userId !== global.userId) {
            if (
              response.removed !== undefined &&
              response.removed !== null &&
              response.removed.length > 0
            ) {
              var isExist = response.removed.findIndex(
                x => x._id === element.userId,
              );
              if (isExist === -1) {
                element.count = element.count + 1;
              }
            } else {
              element.count = element.count + 1;
            }
          }
        });

        const request = {
          unreadCount: unreadCount,
        };

        let finalRequest = _.merge(request, requestObject);
        updateChatObject(threadId, finalRequest, () => {});
      }
    });
  };

  const postMsg = request => {
    setIsSending(true);

    let readBy = [];

    if (inMessageThread) {
      groupMembers.forEach(element => {
        readBy.push({
          _id: element._id,
          fullName: Helper.capitalize(Helper.concatName(element)),
          isRead: true,
        });
      });
    } else {
      groupMembers.forEach(element => {
        if (element.isOnline) {
          readBy.push({
            _id: element._id,
            fullName: Helper.capitalize(Helper.concatName(element)),
            isRead: true,
          });
        }
      });
    }

    request.readBy = readBy;
    addObjectToChat(request, threadId);
  };

  /**
   *
   * @ChatMethodAddObject
   *
   */

  /**
   *
   * @PostMessage
   */

  const editMessageInThread = extraObject => {
    setIsSending(true);
    let selectedMsg = selectedChatObject;
    selectedMsg.message = inputValue;
    selectedMsg.isEdited = true;
    selectedMsg.extraObjects = extraObject;
    reference
      .child(threadId)
      .child(selectedMsg._id)
      .update(selectedMsg)
      .then(() => {
        inEditMode = false;
        let oldData = messages;
        oldData[lastPickIndex] = selectedMsg;
        setMessages([...oldData]);
        setIsSending(false);
        setInputValue('');
        sendUserTyping(false);
        previousStatusOfTyping = false;
        Keyboard.dismiss();
        if (
          chatRef !== undefined &&
          chatRef !== null &&
          chatRef.current !== undefined &&
          chatRef.current !== null
        ) {
          chatRef.current.scrollToOffset({
            offset: 0,
            animated: true,
          });
        }
      });
  };

  const postUserCommentInThread = (
    replayInput,
    replayMedia,
    replayMediaType,
    extraObject,
  ) => {
    let selectedMsg = selectedChatObject;
    let request = generateChatObject(
      selectedMsg.message,
      selectedMsg.media,
      selectedMsg.messageType,
    );

    let reply = generateChatObject(replayInput, replayMedia, replayMediaType);
    reply.user = selectedChatObject.user;
    request.replay = reply;
    request.extraObjects = extraObject;
    postMsg(request);
  };

  const getUserObject = () => {
    return {
      _id: challenger._id,
      profileImg: challenger.profileImg,
      prefix: challenger.prefix,
      firstName: challenger.firstName,
      lastName: challenger.lastName,
      batch: challenger.batch,
    };
  };

  const generateChatObject = (message, media, mediaType) => {
    return {
      message: message,
      createdAt: new Date().getTime(),
      messageType: mediaType,
      media: media,
      user: getUserObject(),
      isRead: inMessageThread,
      //isDelivered: isOpponentOnline,
      isDelivered: true,
      isSent: true,
      replay: {},
      removedBy: [],
    };
  };

  const handleInputChat = (type, input, mediaType, media, extraItem) => {
    if (inEditMode) {
      editMessageInThread(extraItem);
    } else if (isReplayEditComment) {
      postUserCommentInThread(input, media, mediaType, extraItem);
    } else {
      let request = generateChatObject(input, media, mediaType);
      request.extraObjects = extraItem;
      postMsg(request);
    }
  };
  /**
   *
   * @PostMessage
   */

  /**
   *
   * @CommonFunctions
   */

  const setUserLastSeenAndMakeOffline = useCallback(() => {
    if (!isBackTap) {
      isBackTap = true;
      global.loader_ref.show_loader(1);
      offlineSelf(false, () => {
        global.loader_ref.show_loader(0);
        resetOldData();
        navigation.reset({
          routes: [{name: 'Dashboard'}, {name: 'ChatUserList'}],
        });
      });
    }
  }, [navigation, offlineSelf]);

  const handleOnScroll = event => {
    const {
      nativeEvent: {
        contentOffset: {y: contentOffsetY},
      },
    } = event;

    if (contentOffsetY > scrollToBottomOffset) {
      setShowScrollToBottom(true);
    } else {
      if (contentOffsetY === 0) {
        newMessageList.forEach(element => {
          setMessages(previousMessages => append(previousMessages, element));
        });
      }
      bottomUnread = 0;
      setBottomMessages(0);
      setShowScrollToBottom(false);
    }
  };

  const scrollToBottom = () => {
    if (
      chatRef !== undefined &&
      chatRef !== null &&
      chatRef.current !== undefined &&
      chatRef.current !== null
    ) {
      chatRef.current.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  const keyExtractor = (item, index) => index;

  const resetOldData = () => {
    offlineUsers = [];
    isBackTap = false;
    selectedFontSize = 1;
    challenger = null;
    opponent = null;
    isGroup = null;
    isChatExist = null;
    newItems = false;
    lastPickedMsgId = '';
    isStickerShowing = false;
    lastPickIndex = -1;
    blockMsg = '';
    inEditMode = false;
    documentItem = '';
    playAudio = '';
    latestMessageArray = [];
    bottomUnread = 0;
    newMessageList = [];
    inMessageThread = false;
    threadId = '';
    previousStatusOfTyping = false;
    wantsUpdateChilds = [];
    pendingChilds = [];
    imageArray = [];
    offlineUsers = [];
    messageColor = [];
    mutedBy = [];
    removedBy = [];
    groupMembers = [];
    isBackTap = false;
    memberKicked = false;
  };

  const doScrapping = (link, onDone) => {
    getScrappedData(
      link,
      response => {
        if (
          response &&
          response !== null &&
          response.data &&
          response.data !== undefined &&
          response.data !== null
        ) {
          let data = response.data;
          if (data.status) {
            let child = data.data;
            onDone(child);
          } else {
            onDone(null);
          }
        } else {
          onDone(null);
        }
      },
      (error, code) => {
        console.log('error', error, code);
        onDone(null);
      },
    );
  };

  /**
   *
   * @CommonFunctions
   */

  /**
   *
   * @UIMethods
   *
   */

  const renderChatItem = ({item, index}) => {
    const previousMessage = messages[index + 1] || {};
    const nextMessage = messages[index - 1] || {};

    const customFont = {fontSize: fontSize};

    const messageProps = {
      groupMembers: groupMembers,
      messageColor: messageColor,
      isGroup: isGroup,
      key: item._id,
      currentMessage: item,
      previousMessage,
      nextMessage,
      customFont,
      position: item.user._id === global.userId ? 'right' : 'left',
    };

    return (
      <ChatItem
        {...messageProps}
        onPress={() => {
          if (!item.delete) {
            console.log(item.messageType);
            if (item.messageType === 5) {
              documentItem = item.media;
              setShowDocViewer(true);
            } else if (item.messageType === 4) {
              playAudio = item.media;
              extraObjects = item.extraObjects;
              setShowPlayer(!showPlayer);
            } else if (item.messageType === 2) {
              imageArray = [];
              imageArray.push({
                url: item.media,
              });
              setShowImageModal(true);
            }
          }
        }}
        onLongPress={() => {
          if (!item.delete) {
            setSelectedChatObject(item);
            lastPickIndex = index;
            setTimeout(() => {
              if (
                chatObjRef.current !== undefined &&
                chatObjRef.current !== null
              ) {
                chatObjRef.current.open();
              }
            }, 200);
          }
        }}
        onTapUserName={() => {
          navigation.navigate('UserProfile', {
            userId: item.user._id,
          });
        }}
      />
    );
  };

  const renderScrollToBottomWrapper = () => {
    return (
      <View style={[styles.scrollToBottomStyle]}>
        {bottomMessages > 0 && (
          <View style={styles.bottomCountContainer}>
            <Text
              style={[
                g.fs16,
                g.FHNB,
                g.colorWhite,
                g.txtCenter,
                g.txtCenterVertical,
              ]}
              numberOfLines={1}>
              {bottomMessages}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.scrollBottomContainer}
          onPress={() => scrollToBottom()}
          hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}>
          <GlobalInclude.BaseIcon
            containerStyle={{height: scale(20), width: scale(20)}}
            iconColor={'#FFF'}
            iconName={'angle-double-down'}
            iconSize={scale(20)}
            iconType={IconType[4]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const emojiList = () => {
    return (
      <OptionsSheet
        ref={emojiRef}
        minClosingHeight={50}
        height={height / 2 + 150}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <EmojiSelector
          onEmojiSelected={emoji => {
            emojiRef.current.close();
            handleInputChat(1, emoji, 6, '', null);
          }}
        />
      </OptionsSheet>
    );
  };

  const findUser = userId => {
    const found = groupMembers.some(el => el._id === userId);
    if (found) {
      let info = groupMembers.find(el => el._id === userId);
      return info;
    }
    return null;
  };

  const findDeliveredTo = readBy => {
    let members = JSON.parse(JSON.stringify(groupMembers));

    if (readBy === undefined || readBy === null) {
      return members.length > 0 ? members : null;
    }
    for (var i = members.length - 1; i >= 0; i--) {
      let member = members[i];
      for (let j = 0; j < readBy.length; j++) {
        const read = readBy[j];
        if (member._id === read._id) {
          members.splice(i, 1);
          break;
        }
      }
    }

    return members.length > 0 ? members : null;
  };

  const showReadByUsers = (userTag, isRead) => {
    let componentArray = [];
    for (let i = 0; i < userTag.length; i++) {
      let item = userTag[i];
      let userInfo = findUser(item._id);

      console.log('====================================');
      console.log('userInfo', userInfo);
      console.log('userId', item._id);
      console.log('====================================');

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
            <View style={[grid.col]}>
              <View style={[grid.rowdir, g.mb5, grid.alignItems]}>
                <View
                  style={[
                    {
                      height: scale(42),
                      width: scale(42),
                      borderRadius: scale(90),
                    },
                    grid.alignItems,
                    grid.justifyContentCenter,
                    g.mr10,
                  ]}>
                  {userInfo !== null &&
                  userInfo.profileImg !== null &&
                  userInfo.profileImg !== undefined &&
                  userInfo.profileImg !== '' ? (
                    <ProgressImage
                      source={{uri: userInfo.profileImg}}
                      containerStyle={{
                        aspectRatio: 1 / 1,
                        height: scale(42),
                        width: scale(42),
                        borderRadius: scale(90),
                      }}
                      imageStyle={{
                        aspectRatio: 1 / 1,
                        height: scale(42),
                        width: scale(42),
                        borderRadius: scale(90),
                      }}
                      mode={'cover'}
                    />
                  ) : (
                    <View
                      style={[
                        {
                          height: scale(42),
                          width: scale(42),
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
                        {userInfo !== null
                          ? userInfo.firstName.charAt(0)
                          : item.fullName.charAt(0)}
                      </Text>
                    </View>
                  )}
                </View>
                <View>
                  <Text style={[g.colordarkGray, g.fs14, g.FHNR, g.txtLeft]}>
                    {userInfo !== null
                      ? Helper.capitalize(Helper.concatName(userInfo))
                      : item.fullName}
                  </Text>
                  {userInfo !== null && (
                    <View>
                      <View style={[g.mt2, g.mb2]} />
                      <Text
                        style={[g.colordarkGray, g.fs14, g.FHNR, g.txtLeft]}>
                        Batch {userInfo.batch}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View style={[grid.alignItems, grid.justifyContentCenter]}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(20), width: scale(20)}}
                iconColor={isRead ? '#34b7f1' : '#cccccc'}
                iconName={'checkmark-done-sharp'}
                iconSize={scale(18)}
                iconType={IconType[6]}
              />
            </View>
          </View>
        </View>
      );

      componentArray.push(component);
    }
    return componentArray;
  };

  const messageInfoSheet = () => {
    return (
      <OptionsSheet
        ref={messageInfoRef}
        minClosingHeight={50}
        height={height / 2 + 150}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        {selectedChatObject !== null && (
          <View>
            <Text style={[g.colordarkGray, g.fs20, g.FHNB]}>Message Info</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedChatObject.readBy &&
                selectedChatObject.readBy !== undefined &&
                selectedChatObject.readBy !== null && (
                  <View>
                    <View style={[styles.bottomLine, g.ml10, g.mr10]}>
                      <View
                        style={[
                          grid.rowdir,
                          grid.alignItems,
                          grid.justifyContentCenter,
                          g.mb5,
                          g.mt10,
                        ]}>
                        <Text
                          style={[
                            g.colordarkGray,
                            g.fs16,
                            g.FHNB,
                            g.txtLeft,
                            g.txtCenterVertical,
                            grid.col,
                          ]}>
                          Read By
                        </Text>
                      </View>
                    </View>
                    <View style={[g.mt5, g.mb10, g.pl5, g.pr5]}>
                      {showReadByUsers(selectedChatObject.readBy, true)}
                    </View>
                  </View>
                )}

              {findDeliveredTo(selectedChatObject.readBy) !== null && (
                <View>
                  <View style={[styles.bottomLine, g.ml10, g.mr10]}>
                    <View
                      style={[
                        grid.rowdir,
                        grid.alignItems,
                        grid.justifyContentCenter,
                        g.mb5,
                        g.mt10,
                      ]}>
                      <Text
                        style={[
                          g.colordarkGray,
                          g.fs16,
                          g.FHNB,
                          g.txtLeft,
                          g.txtCenterVertical,
                          grid.col,
                        ]}>
                        Delivered To
                      </Text>
                    </View>
                  </View>
                  <View style={[g.mt5, g.mb10, g.pl5, g.pr5]}>
                    {showReadByUsers(
                      findDeliveredTo(selectedChatObject.readBy),
                      false,
                    )}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </OptionsSheet>
    );
  };

  const renderHeader = () => {
    return (
      <View style={headerStyle.headerContainer}>
        <View style={headerStyle.topContainer} />
        <View style={headerStyle.container}>
          {profileLoading ? null : (
            <View style={GlobalInclude.AppStyle.fillRow}>
              <View style={[grid.alignItems, grid.justifyContentCenter]}>
                <TouchableOpacity
                  onPress={() => setUserLastSeenAndMakeOffline()}
                  style={[grid.alignItems, grid.justifyContentCenter]}>
                  <Image
                    source={GlobalInclude.Assets.Back}
                    style={headerStyle.back}
                  />
                </TouchableOpacity>
              </View>
              <View style={[grid.col, grid.rowdir, g.ml5, g.mr5]}>
                <View
                  style={[
                    grid.alignItems,
                    grid.justifyContentCenter,
                    {
                      width: scale(35),
                      height: scale(35),
                      borderRadius: scale(50),
                    },
                  ]}>
                  <View
                    style={[
                      g.bggray,
                      g.oh,
                      {
                        borderRadius: scale(50),
                        width: scale(35),
                        height: scale(35),
                      },
                    ]}>
                    {headerImage !== undefined &&
                    headerImage !== null &&
                    headerImage !== '' ? (
                      <ProgressImage
                        source={headerImage}
                        containerStyle={styles.imageStyle}
                        mode={'cover'}
                      />
                    ) : (
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
                        iconSize={scale(25)}
                        iconType={IconType[0]}
                      />
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('GroupMembersProfile', {
                      threadId: threadId,
                    });
                  }}
                  style={[grid.col, g.ml5, g.mr5, grid.justifyContentCenter]}>
                  {header !== null && header !== '' && (
                    <Text
                      style={[
                        g.fs14,
                        g.FHNB,
                        g.colordarkGray,
                        g.txtLeft,
                        GlobalInclude.AppStyle.transform,
                      ]}
                      numberOfLines={1}>
                      {header}
                    </Text>
                  )}

                  {subHeader !== null && subHeader !== '' && (
                    <Text
                      style={[
                        g.fs11,
                        g.FHNB,
                        g.colordarkGray,
                        g.txtLeft,
                        g.mt2,
                      ]}
                      numberOfLines={1}>
                      {typingUser.length > 0 ? typingUser : subHeader}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  if (selectedFontSize === 1) {
                    setFontSize(scale(18));
                    setScaleSize(scale(24));
                    selectedFontSize = 2;
                  } else if (selectedFontSize === 2) {
                    setFontSize(scale(20));
                    setScaleSize(scale(26));
                    selectedFontSize = 3;
                  } else if (selectedFontSize === 3) {
                    setFontSize(scale(16));
                    setScaleSize(scale(22));
                    selectedFontSize = 1;
                  }
                }}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                style={{
                  height: scaleSize,
                  width: scaleSize,
                  alignSelf: 'center',
                }}>
                <Image
                  source={GlobalInclude.Assets.FontSize}
                  style={{
                    height: scaleSize,
                    width: scaleSize,
                    padding: scale(5),
                    alignSelf: 'center',
                  }}
                  resizeMethod={'auto'}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={headerStyle.shadowView} />
      </View>
    );
  };

  const showUserPostOptions = () => {
    return (
      <View>
        {selectedChatObject.messageType === 1 && (
          <TouchableOpacity
            onPress={() => {
              if (
                chatObjRef.current !== undefined &&
                chatObjRef.current !== null
              ) {
                chatObjRef.current.close();
              }
              inEditMode = true;
              setInputValue(selectedChatObject.message);
            }}
            style={[
              grid.justifyContentCenter,
              grid.alignItems,
              g.p15,
              {
                borderBottomWidth: 2,
                borderBottomColor: '#ebebe4',
              },
            ]}>
            <Text
              style={[
                g.fs18,
                g.FHNM,
                g.colorBlue,
                grid.justifyContentCenter,
                grid.alignItems,
                g.txtCenterVertical,
              ]}>
              Edit
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            if (
              chatObjRef.current !== undefined &&
              chatObjRef.current !== null
            ) {
              chatObjRef.current.close();
            }

            setTimeout(() => {
              let selectedMsg = selectedChatObject;
              selectedMsg.delete = true;

              reference
                .child(threadId)
                .child(selectedMsg._id)
                .update(selectedMsg)
                .then(() => {
                  let oldData = messages;
                  oldData[lastPickIndex] = selectedMsg;
                  setMessages([...oldData]);
                })
                .catch(err => {
                  console.log('error', err);
                });
            }, 220);
          }}
          style={[
            grid.justifyContentCenter,
            grid.alignItems,
            g.p15,
            {
              borderBottomWidth: 2,
              borderBottomColor: '#ebebe4',
            },
          ]}>
          <Text
            style={[
              g.fs18,
              g.FHNM,
              g.colorBlue,
              grid.justifyContentCenter,
              grid.alignItems,
              g.txtCenterVertical,
            ]}>
            Remove Message
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (
              chatObjRef.current !== undefined &&
              chatObjRef.current !== null
            ) {
              chatObjRef.current.close();
            }

            setTimeout(() => {
              if (
                messageInfoRef.current !== undefined &&
                messageInfoRef.current !== null
              ) {
                messageInfoRef.current.open();
              }
            }, 220);
          }}
          style={[grid.justifyContentCenter, grid.alignItems, g.p15]}>
          <Text
            style={[
              g.fs18,
              g.FHNM,
              g.colorBlue,
              grid.justifyContentCenter,
              grid.alignItems,
              g.txtCenterVertical,
            ]}>
            Message Info
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const chatOptions = () => {
    return (
      <OptionsSheet
        ref={chatObjRef}
        minClosingHeight={50}
        height={
          selectedChatObject !== null &&
          selectedChatObject.user._id === global.userId
            ? 340
            : 180
        }
        duration={200}
        closeOnDragDown={false}
        keyboardAvoidingViewEnabled={false}
        customStyles={{
          container: {
            backgroundColor: 'transparent',
          },
        }}>
        <View
          style={{
            backgroundColor: 'white',
            marginHorizontal: scale(10),
            borderRadius: 15,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (
                chatObjRef.current !== undefined &&
                chatObjRef.current !== null
              ) {
                chatObjRef.current.close();
              }
              setIsReplayEditComment(true);
            }}
            style={[
              grid.justifyContentCenter,
              grid.alignItems,
              g.p15,
              selectedChatObject !== null &&
              selectedChatObject.user._id === global.userId
                ? {borderBottomWidth: 2, borderBottomColor: '#ebebe4'}
                : {},
            ]}>
            <Text
              style={[
                g.fs18,
                g.FHNM,
                g.colorBlue,
                grid.justifyContentCenter,
                grid.alignItems,
                g.txtCenterVertical,
              ]}>
              Reply
            </Text>
          </TouchableOpacity>
          {selectedChatObject !== null &&
            selectedChatObject.user._id === global.userId &&
            showUserPostOptions()}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            if (
              chatObjRef.current !== undefined &&
              chatObjRef.current !== null
            ) {
              chatObjRef.current.close();
            }
          }}
          style={{
            backgroundColor: 'white',
            marginHorizontal: scale(10),
            borderRadius: 15,
            marginVertical: scale(10),
          }}>
          <View style={[grid.justifyContentCenter, grid.alignItems, g.p15]}>
            <Text
              style={[
                g.fs18,
                g.FHNM,
                g.colorBlue,
                grid.justifyContentCenter,
                grid.alignItems,
                g.txtCenterVertical,
              ]}>
              Close
            </Text>
          </View>
        </TouchableOpacity>
      </OptionsSheet>
    );
  };

  const emptyComponent = () => {
    return (
      <View style={[transform]}>
        <View style={GlobalInclude.AppStyle.fillCenter}>
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
      </View>
    );
  };

  /**
   *
   * UI Methods
   *
   */

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bggray3]}>
      {renderHeader()}
      {showProgess(isFirstLoad)}
      {showScrollToBottom ? renderScrollToBottomWrapper() : null}
      <View style={[GlobalInclude.AppStyle.fill]}>
        {isFirstLoad ? (
          <View style={[GlobalInclude.AppStyle.fillCenter]}>
            <ThreeDotsLoader
              size={scale(12)}
              activeBackground={GlobalInclude.Color.ColorPrimary}
            />
          </View>
        ) : (
          <FlatList
            ref={chatRef}
            inverted={-1}
            data={messages}
            renderItem={renderChatItem}
            removeClippedSubviews={Platform.OS !== 'web'}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.1}
            maintainVisibleContentPosition={true}
            ListEmptyComponent={emptyComponent}
            scrollEventThrottle={16}
            bounces={false}
            initialNumToRender={10}
            maxToRenderPerBatch={8}
            updateCellsBatchingPeriod={100}
            automaticallyAdjustContentInsets={false}
            initialListSize={5}
            pageSize={1}
            contentContainerStyle={{
              paddingTop: scale(15),
              paddingBottom: scale(20),
            }}
            onScroll={handleOnScroll}
          />
        )}

        {profileLoading ? null : (
          <KeyboardAvoidingView
            behavior={Platform.select({android: 'height', ios: 'padding'})}
            style={{marginBottom: scale(10)}}>
            {chatEnabled ? (
              <View style={styles.footer}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    flex: 1,
                    borderRadius: isReplayEditComment ? scale(10) : scale(30),
                  }}>
                  <View
                    style={[grid.flex1, isReplayEditComment && [g.pt5, g.pb5]]}>
                    {isReplayEditComment && (
                      <View style={grid.rowdir}>
                        <View
                          style={[
                            styles.replayContainer,
                            g.ml10,
                            g.mr10,
                            grid.col,
                          ]}>
                          <View
                            style={[
                              styles.renderBorder,
                              {
                                backgroundColor:
                                  GlobalInclude.Color.ColorPrimary,
                              },
                            ]}
                          />
                          <View style={[g.pl10, g.pt3, g.pr10, g.pb3]}>
                            <Text
                              style={[
                                g.fs12,
                                g.FHNB,
                                g.colorBlue,
                                grid.justifyContentCenter,
                                grid.alignItems,
                                g.txtCenterVertical,
                                g.mb5,
                              ]}>
                              {'Replying To:'}
                            </Text>
                            <Text style={[g.fs14, g.FHNB, g.colorBlack]}>
                              {Helper.capitalize(
                                Helper.concatName(selectedChatObject.user),
                              )}
                            </Text>
                            <View style={[g.mt2, g.mb2]} />
                            <Text
                              numberOfLines={1}
                              style={[g.fs12, g.FHNR, g.colorBlack]}>
                              {selectedChatObject.messageType === 1
                                ? selectedChatObject.message
                                : showMediaType(selectedChatObject.messageType)}
                            </Text>
                          </View>
                        </View>
                        <View style={[g.mt2, g.mr5]}>
                          {showImageThumb(
                            selectedChatObject.media,
                            selectedChatObject.messageType,
                          )}
                        </View>

                        {/* part two */}
                        <TouchableOpacity
                          onPress={() => {
                            setIsReplayEditComment(false);
                            setSelectedChatObject(null);
                          }}
                          style={styles.closeComment}>
                          <GlobalInclude.BaseIcon
                            containerStyle={{
                              height: scale(14),
                              width: scale(14),
                            }}
                            iconColor={'#fff'}
                            iconName={'close'}
                            iconSize={scale(14)}
                            iconType={IconType[6]}
                          />
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* row two */}
                    <View style={[grid.rowdir]}>
                      <Animatable.View
                        ref={animRef}
                        useNativeDriver={true}
                        style={{
                          width: emojiIconWidth,
                          height: scale(40),
                          borderRadius: scale(10),
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                        }}
                        easing={'linear'}>
                        <TouchableOpacity
                          onPress={() => {
                            if (emojiRef !== undefined && emojiRef !== null) {
                              emojiRef.current.open();
                            }
                          }}
                          style={[styles.commentButton]}>
                          <GlobalInclude.BaseIcon
                            containerStyle={{
                              height: scale(20),
                              width: scale(20),
                            }}
                            iconColor={GlobalInclude.Color.ColorPrimary}
                            iconName={'sticker-emoji'}
                            iconSize={scale(20)}
                            iconType={IconType[1]}
                          />
                        </TouchableOpacity>
                      </Animatable.View>
                      <TextInput
                        autoCapitalize={'sentences'}
                        underlineColorAndroid="transparent"
                        style={[styles.inputContainer, styles.inputView]}
                        keyboardType={'default'}
                        value={inputValue}
                        multiline={true}
                        placeholder="Enter text here"
                        onChangeText={input => {
                          setInputValue(input);
                          sendUserTyping(input.length > 0 ? true : false);

                          if (input.length > 0 && !isStickerShowing) {
                            isStickerShowing = true;
                            setEmojiIconWidth(0);
                            animRef.current.slideOutLeft().then(() => {});
                          } else if (input.length === 0 && isStickerShowing) {
                            inEditMode = false;
                            isStickerShowing = false;
                            setEmojiIconWidth(scale(40));

                            animRef.current.slideInLeft().then(() => {});
                          }
                        }}
                        placeholderTextColor={'#b2b2b2'}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          if (uploadRef.current !== null) {
                            uploadRef.current.open();
                          }
                        }}
                        style={[styles.commentButton]}>
                        <GlobalInclude.BaseIcon
                          containerStyle={{height: scale(20), width: scale(20)}}
                          iconColor={GlobalInclude.Color.ColorPrimary}
                          iconName={'attach-file'}
                          iconSize={scale(20)}
                          iconType={IconType[0]}
                        />
                      </TouchableOpacity>
                    </View>
                    {/* row two */}
                  </View>
                </View>
                {inputValue.trim().length > 0 && (
                  <Animatable.View
                    useNativeDriver={true}
                    animation={'slideInRight'}
                    style={[
                      g.ml5,
                      styles.commentButton,
                      inputValue.trim().length > 0
                        ? styles.enableButton
                        : styles.disbleButton,
                    ]}>
                    <TouchableOpacity
                      style={[styles.commentButton, styles.enableButton]}
                      onPress={() => {
                        handleInputChat(1, inputValue, 1, '', null);
                      }}>
                      {isSending ? (
                        <ActivityIndicator size={'small'} color={'#fff'} />
                      ) : (
                        <GlobalInclude.BaseIcon
                          containerStyle={{height: scale(20), width: scale(20)}}
                          iconColor={
                            inputValue.trim().length > 0 ? '#fff' : '#b2b2b2'
                          }
                          iconName={'send-o'}
                          iconSize={scale(20)}
                          iconType={IconType[4]}
                        />
                      )}
                    </TouchableOpacity>
                  </Animatable.View>
                )}
              </View>
            ) : (
              <View style={styles.footer}>
                <View
                  style={[
                    styles.whiteCurvedBox,
                    g.p10,
                    grid.alignItems,
                    grid.justifyContentCenter,
                    g.ml15,
                    g.mr15,
                  ]}>
                  <Text
                    style={[
                      g.colorBlue,
                      g.fs12,
                      g.FHNR,
                      g.txtCenter,
                      g.txtCenterVertical,
                    ]}>
                    {blockMsg === '' ? 'This chat has been blocked' : blockMsg}
                  </Text>
                </View>
              </View>
            )}
          </KeyboardAvoidingView>
        )}
      </View>
      <UploadMedia
        hideTagInVideo={true}
        refRBSheet={uploadRef}
        media={{image: false, video: false, document: false, audio: false}}
        supportMultiple={false}
        onPickMedia={media => {
          console.log(';media', media);
          if (media !== undefined && media !== null) {
            media.forEach(item => {
              let mediaType = '1';
              if (item.type === 1) {
                mediaType = 2;
              }
              if (item.type === 2) {
                mediaType = 3;
              }
              if (item.type === 3) {
                mediaType = 5;
              }
              if (item.type === 4) {
                mediaType = 4;
              }

              if (item.type === 1) {
                global.loader_ref.show_loader(1);
                Image.getSize(item.fileName, (iw, ih) => {
                  console.log(ih, iw);
                  let windowWidth = width;
                  let windowHeight = height;
                  if (ih > iw) {
                    windowWidth = width - 80;
                    windowHeight = height / 2;
                  } else {
                    windowWidth = width - 80;
                    windowHeight = height;
                  }
                  let ratio = Math.min(windowWidth / iw, windowHeight / ih);
                  let iWidth = Math.ceil(iw * ratio);
                  let iHeight = Math.ceil(ih * ratio);
                  let element = {};
                  element.iw = iWidth;
                  element.ih = iHeight;
                  global.loader_ref.show_loader(0);
                  handleInputChat(
                    2,
                    inputValue,
                    mediaType,
                    item.fileName,
                    element,
                  );
                });
              } else if (item.type === 2) {
                global.loader_ref.show_loader(1);
                doScrapping(item.fileName, callback => {
                  global.loader_ref.show_loader(0);
                  handleInputChat(
                    2,
                    inputValue,
                    mediaType,
                    item.fileName,
                    callback,
                  );
                });
              } else if (item.type === 3 || item.type === 4) {
                handleInputChat(
                  2,
                  inputValue,
                  mediaType,
                  item.fileName,
                  item.requestObject,
                );
              } else {
                handleInputChat(2, inputValue, mediaType, item.fileName, null);
              }
            });
          }

          uploadRef.current.close();
        }}
      />
      {emojiList()}
      {chatOptions()}
      {messageInfoSheet()}

      {showDocViewer && (
        <DocViewer
          mediaContent={documentItem}
          onClose={() => {
            setShowDocViewer(false);
          }}
        />
      )}
      {showPlayer && (
        <AudioPlayer
          mediaContent={playAudio}
          extraObjects={extraObjects}
          onClose={() => {
            setShowPlayer(false);
          }}
        />
      )}
      {showImageModal && (
        <ImageViewer
          imageViewerArray={imageArray}
          onClose={() => {
            setShowImageModal(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  closeComment: {
    width: scale(26),
    height: scale(26),
    borderRadius: scale(30),
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(5),
    position: 'absolute',
    right: -5,
    top: -3,
  },
  back: {
    width: scale(30),
    height: scale(30),
    padding: scale(4),
    alignSelf: 'flex-end',
  },
  inputContainer: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    minHeight: scale(40),
    flex: 1,
    borderRadius: scale(30),
  },
  inputView: {
    fontSize: scale(15),
    fontFamily: 'Lato-Regular',
  },
  commentButton: {
    height: scale(40),
    width: scale(40),
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  enableButton: {
    backgroundColor: GlobalInclude.Color.ColorPrimary,
  },
  disbleButton: {
    backgroundColor: '#eee',
  },

  footer: {
    flexDirection: 'row',
    marginHorizontal: scale(6),
  },
  input: {
    paddingHorizontal: 20,
    fontSize: 18,
    flex: 1,
  },
  imageStyle: {
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    width: scale(40),
    justifyContent: 'center',
  },
  whiteCurvedBox: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    flex: 1,
    borderRadius: scale(30),
  },
  replayContainer: {
    borderRadius: scale(6),
    backgroundColor: 'rgba(43, 50, 82,0.3)',
    flexDirection: 'row',
  },
  renderBorder: {
    width: scale(3),
    borderRadius: 0,
    borderBottomLeftRadius: scale(10),
    borderTopLeftRadius: scale(10),
  },
  scrollToBottomStyle: {
    opacity: 0.9,
    position: 'absolute',
    left: 10,
    bottom: scale(60),
    zIndex: 998,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 1,
    elevation: 3,
  },
  scrollBottomContainer: {
    height: scale(30),
    width: scale(30),
    borderRadius: 20,
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomCountContainer: {
    position: 'absolute',
    top: -6,
    left: -6,
    backgroundColor: 'green',
    height: scale(20),
    width: scale(20),
    zIndex: 999,
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLine: {
    borderBottomColor: '#ebebe4',
    borderBottomWidth: 1,
  },
});

const headerStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: scale(50),
    backgroundColor: 'white',
    paddingStart: scale(15),
    paddingEnd: scale(15),
    alignContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  shadowView: {
    backgroundColor: 'white',
    elevation: 6,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    height: 0,
    marginTop: Platform.OS === 'android' ? scale(-6) : 2,
  },
  backIcon: {
    height: scale(23),
    width: scale(23),
    justifyContent: 'center',
    marginStart: scale(15),
  },
  titleContainer: {
    flex: 1,
    marginStart: scale(10),
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  back: {
    width: scale(30),
    height: scale(30),
    padding: scale(4),
    alignSelf: 'flex-end',
  },
  topContainer: {
    height: Platform.OS === 'android' ? 0 : getStatusBarHeight(),
    width: '100%',
    backgroundColor: 'white',
  },
  headerContainer: {
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.22,
    elevation: 3,
    backgroundColor: 'white',
  },
  userInfo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    marginEnd: scale(40),
    marginStart: scale(40),
  },
});

export default GroupChatScreen;
