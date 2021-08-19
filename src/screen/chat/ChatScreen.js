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
  Alert,
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
import _ from 'lodash';

// Firestore
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {useCollection} from 'react-firebase-hooks/firestore';

import {
  createSingleChat,
  updateChatObject,
  getChatObject,
  setLatestUnread,
  sendPushNotification,
  checkUserExist,
  addUserToBlockList,
} from '../../helper/ChatHelper';

const {height} = Dimensions.get('window');

let selectedFontSize = 1;
let challenger = null,
  opponent = null,
  isGroup = null;
var isChatExist = null;
let newItems = false;
let lastPickedMsgId = '';
let backHandler = null;
let isStickerShowing = false;
let lastPickIndex = -1;
let blockMsg = '';
let inEditMode = false;
let isOpponentMuted = false;
let documentItem = '';
let playAudio = '';
let latestMessageArray = [];
let bottomUnread = 0;
let newMessageList = [];
let inMessageThread = false;
let threadId = '';
let previousStatusOfTyping = false;
let wantsUpdateChilds = [];
let pendingChilds = [];
let lastOnlineStatus = false;
let imageArray = [];

const scrollToBottomOffset = 200;
const usersCollection = firestore().collection('Users');
const chatCollection = firestore().collection('Chats');
const reference = database().ref('Messages');

const ChatScreen = ({route}) => {
  const uploadRef = useRef();
  const emojiRef = useRef();
  const animRef = useRef();
  const chatObjRef = useRef();
  const chatRef = useRef();

  const navigation = useNavigation();

  const transform =
    Platform.OS === 'android'
      ? [{scaleY: -1}, {perspective: 1280}]
      : [{scaleY: -1}];

  const [opponentId, setOpponentId] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isSenderBlocked, setIsSenderBlocked] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [fontSize, setFontSize] = useState(scale(14));
  const [inputValue, setInputValue] = useState('');
  const [header, setHeader] = useState('');
  const [subHeader, setSubHeader] = useState('');
  const [isOpponentTyping, setIsOpponentTyping] = useState(false);
  const [headerImage, setHeaderImage] = useState(
    GlobalInclude.Assets.DefaultProfile,
  );
  const [isOpponentOnline, setIsOpponentOnline] = useState(false);
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

  const [opponentSnapshot] = useCollection(
    opponentId !== '' ? usersCollection.where('_id', '==', opponentId) : null,
  );
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

      if (threadId !== null) {
        validateChatScreen();
      } else {
        challenger =
          route.params.challenger !== undefined &&
          route.params.challenger !== null
            ? route.params.challenger
            : null;
        opponent =
          route.params.opponent !== undefined && route.params.opponent !== null
            ? route.params.opponent
            : null;
        isGroup =
          route.params.isGroup !== undefined && route.params.isGroup !== null
            ? route.params.isGroup
            : null;

        setOpponentId(opponent._id);
        setIsOpponentOnline(opponent.isOnline);
        lastOnlineStatus = opponent.isOnline;
        setIsFirstLoad(false);
      }
    }

    const backAction = () => {
      if (navigation.isFocused()) {
        setUserLastSeenAndMakeOffline();
        return true;
      }
    };

    backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    //return () => {};
  }, [route, navigation, validateChatScreen, setUserLastSeenAndMakeOffline]);

  const validateChatScreen = useCallback(() => {
    getChatObject(threadId, (response) => {
      if (response && response !== null && response !== undefined) {
        isChatExist = response;
        offlineSelf(true, () => {
          isGroup =
            response.isGroup !== undefined && response.isGroup !== null
              ? response.isGroup
              : null;

          checkUserExist(global.userId)
            .then((result) => {
              if (result !== undefined && result !== null) {
                let blockedList = result.blockedUser;
                isChatExist.userInfo.forEach((element) => {
                  if (element._id === global.userId) {
                    challenger = element;
                  } else {
                    opponent = element;

                    let inBlocked = blockedList.filter(
                      (item) => item === element._id,
                    );

                    if (
                      inBlocked !== undefined &&
                      inBlocked !== null &&
                      inBlocked.length > 0
                    ) {
                      setIsSenderBlocked(true);
                    }

                    setOpponentId(element._id);
                    setIsOpponentOnline(element.isOnline);
                    inMessageThread = element.isOnline;
                    lastOnlineStatus = element.isOnline;
                  }
                });
              }
            })
            .finally(() => {
              setMessageThreadId(threadId);
            });
        });
      }
    });
  }, []);

  /**
   *
   * General
   */

  /**
   *
   * @UseEffects
   */

  useEffect(() => {
    if (opponentSnapshot !== undefined && opponentSnapshot !== null) {
      if (
        opponentSnapshot.docs !== undefined &&
        opponentSnapshot.docs !== null &&
        opponentSnapshot.docs.length > 0
      ) {
        let data = opponentSnapshot.docs[0].data();

        if (data && data !== null && data !== undefined) {
          opponent = data;

          setHeader(
            Helper.capitalize(Helper.concatName(opponent)) +
              ' - ' +
              opponent.batch,
          );

          if (data.isOnline !== lastOnlineStatus && data.isOnline) {
            refreshChatItems(false);
          }

          lastOnlineStatus = data.isOnline;
          setIsOpponentOnline(data.isOnline);

          if (
            opponent.profileImg !== undefined &&
            opponent.profileImg !== null &&
            opponent.profileImg !== ''
          ) {
            setHeaderImage({uri: opponent.profileImg});
          }
          setSubHeader(opponent.profession);

          if (!data.chatEnabled) {
            blockMsg = `${Helper.capitalize(
              Helper.concatName(data),
            )} has disabled chat.`;
            setChatEnabled(false);
          } else {
            if (isSenderBlocked) {
              blockMsg = 'You blocked this chat. Tap to unblock';
              setChatEnabled(false);
            } else {
              setChatEnabled(true);
              checkOpponentBlocked(data.blockedUser, data.blockedBy);
            }
          }
          setProfileLoading(false);
        }
      }
    }
  }, [opponentSnapshot, isSenderBlocked, refreshChatItems, route]);

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
          let isMuted = data.mutedBy.filter((item) => global.userId !== item);
          isOpponentMuted = isMuted.length > 0 ? true : false;

          let typingUser = data.isTyping;
          let usersList = data.userInfo;

          let whoTyping = typingUser.filter(
            (element) => element.userId !== global.userId,
          );

          if (
            whoTyping !== undefined &&
            whoTyping !== null &&
            whoTyping.length > 0
          ) {
            setIsOpponentTyping(whoTyping[0].status);
          }

          let isUserAvailable = usersList.filter(
            (element) => element._id !== global.userId,
          );

          if (
            isUserAvailable !== undefined &&
            isUserAvailable !== null &&
            isUserAvailable.length > 0
          ) {
            let lastOnline = isUserAvailable[0].isOnline;
            if (lastOnline !== inMessageThread && lastOnline) {
              refreshChatItems(true);
            }
            inMessageThread = isUserAvailable[0].isOnline;
          }
        }
      }
    }
  }, [chatObjectSnapshot, refreshChatItems]);

  const refreshChatItems = useCallback(
    (isOnline) => {
      if (pendingChilds.length > 0) {
        let cloneArray = _.cloneDeep(pendingChilds);
        let isAnyChildFound = false;
        let oldData = messages;

        cloneArray.forEach((element) => {
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
              oldData[oldData.findIndex((el) => el._id === element._id)] =
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
            unreadCount.forEach((element) => {
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
  const onError = (error) => {
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
            setMessages((previousMessages) =>
              append(previousMessages, child.val()),
            );
          }
        } else {
          setMessages((previousMessages) =>
            append(previousMessages, child.val()),
          );
        }
        if (showScrollToBottom) {
          bottomUnread = bottomUnread + 1;
          setBottomMessages(bottomUnread);
        }
      }
    };

    const onValue = (snapshots) => {
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

    const onInitialLoad = (objectValue) => {
      const snapshotVal = objectValue.val();
      let childrenToProcess = snapshotVal
        ? Object.keys(objectValue.val()).length
        : 0;

      if (childrenToProcess === 0) {
        onValue([]);
      } else {
        const children = [];
        let arrayItems = [];
        wantsUpdateChilds = [];
        pendingChilds = [];
        let unreadPosition = -1;
        let unreadCount = 0;
        let isAnyChildFound = false;
        try {
          objectValue.forEach((item, index, array) => {
            let element = item.val();
            childrenToProcess--;
            if (!isGroup) {
              if (element.user._id === global.userId) {
                if (inMessageThread) {
                  if (
                    element.isDelivered === undefined ||
                    !element.isDelivered ||
                    element.isRead === undefined ||
                    !element.isRead
                  ) {
                    isAnyChildFound = true;
                    wantsUpdateChilds.push(element);

                    element.isRead = true;
                    element.isDelivered = true;

                    unreadCount++;
                    if (unreadPosition === -1) {
                      unreadPosition = index;
                    }
                  }
                } else if (opponent.isOnline) {
                  if (
                    element.isDelivered === undefined ||
                    !element.isDelivered
                  ) {
                    isAnyChildFound = true;
                    element.isDelivered = true;
                    wantsUpdateChilds.push(element);
                  }
                } else {
                  pendingChilds.push(element);
                }
              } else if (element.user._id !== global.userId) {
                if (
                  element.isDelivered === undefined ||
                  !element.isDelivered ||
                  element.isRead === undefined ||
                  !element.isRead
                ) {
                  isAnyChildFound = true;
                  wantsUpdateChilds.push(element);

                  element.isRead = true;
                  element.isDelivered = true;

                  unreadCount++;
                  if (unreadPosition === -1) {
                    unreadPosition = index;
                  }
                } else {
                  pendingChilds.push(element);
                }
              }
            }

            children.push(element);
            arrayItems.push(element);

            if (childrenToProcess === 0) {
              lastPickedMsgId = element._id;
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
              if (unreadPosition > -1) {
                children.splice(unreadPosition, 0, systemMsg);
              }
              onValue(children);

              if (isAnyChildFound && wantsUpdateChilds.length > 0) {
                updateChatMessages(wantsUpdateChilds, inMessageThread);
              }
            }
          });
        } catch (error) {}
      }
    };

    mainRef.once('value', onInitialLoad, onError);

    return () => {
      mainRef.off('child_added', childAddedHandler);
      backHandler.remove();
    };
  }, [messageThreadId, showScrollToBottom]);
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

    const onChildChanged = (childChanged) => {
      if (childChanged && childChanged !== null && childChanged !== undefined) {
        let nextMsg = JSON.parse(JSON.stringify(childChanged.val()));
        let msgUser = nextMsg.user;
        if (
          msgUser._id !== undefined &&
          msgUser._id !== null &&
          msgUser._id !== global.userId
        ) {
          let oldData = messages;
          oldData[oldData.findIndex((el) => el._id === nextMsg._id)] = nextMsg;
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

  const sendUserTyping = (typing) => {
    if (previousStatusOfTyping !== typing) {
      previousStatusOfTyping = typing;

      if (isChatExist !== undefined && isChatExist !== null) {
        let isTyping = isChatExist.isTyping;
        if (isTyping !== undefined && isTyping !== null) {
          let element = {userId: global.userId, status: typing};
          isTyping[isTyping.findIndex((el) => el.userId === global.userId)] =
            element;
        }

        const request = {
          isTyping: isTyping,
        };
        updateChatObject(threadId, request, () => {});
      }
    }
  };

  const offlineSelf = (status, callback) => {
    if (threadId !== undefined && threadId !== null && threadId !== '') {
      getChatObject(threadId, (response) => {
        if (response && response !== null && response !== undefined) {
          let userInfo = response.userInfo;
          let unreadCount = response.unreadCount;
          let isTyping = response.isTyping;
          let found = false;
          if (userInfo !== undefined && userInfo !== null) {
            for (let i = 0; i < userInfo.length; i++) {
              const user = userInfo[i];
              if (global.userId === user._id) {
                user.isOnline = status;
                found = true;
                break;
              }
            }
          }

          if (isTyping !== undefined && isTyping !== null) {
            let element = {userId: global.userId, status: false};
            isTyping[isTyping.findIndex((el) => el.userId === global.userId)] =
              element;
          }

          let request = {};
          if (found) {
            request = {
              userInfo: userInfo,
              isTyping: isTyping,
            };
          }
          if (status) {
            var isFound = false;
            unreadCount.forEach((element) => {
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
  };

  const updateChatMessages = (messageArray, clearArray) => {
    var rv = {};

    messageArray.forEach((element) => {
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
              getChatObject(threadId, (response) => {
                if (response && response !== null && response !== undefined) {
                  let unreadCount = response.unreadCount;
                  unreadCount.forEach((element) => {
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

  const userLastMessage = (request) => {
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
          : Helper.getFilename(request.media);
    } else if (request.messageType === 6) {
      message = request.message;
    }
    return message;
  };

  const generateSingleChat = async (request, callback) => {
    let message = userLastMessage(request);
    createSingleChat(opponent, message, (chatObject) => {
      if (chatObject !== undefined && chatObject !== null) {
        isChatExist = chatObject;
        threadId = chatObject._id;
        setMessageThreadId(chatObject._id);
        callback(chatObject._id);
      }
    });
  };

  const addObjectToChat = (request, chatId) => {
    let childRef = reference.child(chatId);
    childRef.push().then((snap) => {
      const _id = snap.key;
      request._id = _id;
      snap.set(request).then(() => {
        setIsSending(false);
        let message = userLastMessage(request);
        if (!isGroup && !inMessageThread) {
          pendingChilds.push(JSON.parse(JSON.stringify(request)));
          let itemObject = setLastMessage(message, chatId, request.messageType);
          setUnreadCount(itemObject);
          if (!isOpponentMuted) {
            sendPushNotification(
              opponent,
              request.message.trim() === '' ? 'Shared Media' : request.message,
              threadId,
            );
          }
        } else {
          let itemObject = setLastMessage(message, chatId, request.messageType);
          updateChatObject(chatId, itemObject, () => {});
        }

        if (!inMessageThread || !isOpponentOnline) {
          setLatestUnread(true, opponent._id, () => {});
        }

        previousStatusOfTyping = false;
        setInputValue('');
        isStickerShowing = false;
        setEmojiIconWidth(scale(40));
        animRef.current.slideInLeft().then(() => {});
        //Keyboard.dismiss();
        if (isReplayEditComment) {
          scrollToBottom();
          setIsReplayEditComment(false);
          setSelectedChatObject(null);
        }
      });
    });
  };

  const setLastMessage = (lastMsg, chatId, mediaType) => {
    let isTyping = isChatExist.isTyping;
    if (isTyping !== undefined && isTyping !== null) {
      let element = {userId: global.userId, status: false};
      isTyping[isTyping.findIndex((el) => el.userId === global.userId)] =
        element;
    } else {
      isTyping = [
        {userId: global.userId, status: false},
        {userId: opponent._id, status: false},
      ];
    }

    const request = {
      lastMessage: lastMsg,
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
  };

  const setUnreadCount = (requestObject) => {
    getChatObject(threadId, (response) => {
      if (response && response !== null && response !== undefined) {
        let unreadCount = response.unreadCount;

        unreadCount.forEach((element) => {
          if (element.userId !== global.userId) {
            element.count = element.count + 1;
          }
        });

        const request = {
          unreadCount: unreadCount,
        };

        let finalRequest = _.merge(request, requestObject);

        console.log('916');
        updateChatObject(threadId, finalRequest, () => {});
      }
    });
  };

  const postMsg = (request) => {
    setIsSending(true);
    if (isChatExist === null) {
      generateSingleChat(request, (chatId) => {
        addObjectToChat(request, chatId);
      });
    } else {
      addObjectToChat(request, threadId);
    }
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

  const editMessageInThread = () => {
    setIsSending(true);
    let selectedMsg = selectedChatObject;
    selectedMsg.message = inputValue;
    selectedMsg.isEdited = true;
    reference
      .child(threadId)
      .child(selectedMsg._id)
      .update(selectedMsg)
      .then(() => {
        inEditMode = false;
        let oldData = messages;
        oldData[lastPickIndex] = selectedMsg;
        previousStatusOfTyping = false;
        setMessages([...oldData]);
        setIsSending(false);
        setInputValue('');
        sendUserTyping(false);
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
    postMsg(request);
  };

  const getUserObject = () => {
    return {
      _id: challenger._id,
      profileImg: challenger.profileImg,
      prefix: challenger.prefix,
      firstName: challenger.firstName,
      lastName: challenger.lastName,
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

  const handleInputChat = (type, input, mediaType, media) => {
    if (inEditMode) {
      editMessageInThread();
    } else if (isReplayEditComment) {
      postUserCommentInThread(input, media, mediaType);
    } else {
      let request = generateChatObject(input, media, mediaType);
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

  const blockUser = (wantBlock) => {
    Alert.alert(
      wantBlock ? 'Block User' : 'Unblock User',
      `Are you sure you want to ${
        wantBlock ? 'Block' : 'Unblock'
      } ${Helper.capitalize(Helper.concatName(opponent))}?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            addUserToBlockList(opponent._id, (status) => {
              Alert.alert(
                '',
                status
                  ? `User ${wantBlock ? 'Blocked' : 'Unblocked'} successfully`
                  : `Erorr while ${wantBlock ? 'blocking' : 'unblocking'} user`,
                [
                  {
                    text: 'Okay',
                    onPress: () => {
                      setIsSenderBlocked(false);
                      validateChatScreen();
                    },
                  },
                ],
              );
            });
          },
        },
      ],
    );
  };

  const checkOpponentBlocked = (blockedList, blockedBy) => {
    if (
      blockedList !== undefined &&
      blockedList !== null &&
      blockedList !== ''
    ) {
      let isBlocked = blockedList.filter((user) => global.userId === user);

      blockMsg = `${Helper.capitalize(
        Helper.concatName(opponent),
      )} has blocked this chat.`;
      setChatEnabled(isBlocked.length === 0);
    } else if (
      blockedBy !== undefined &&
      blockedBy !== null &&
      blockedBy !== ''
    ) {
      let isBlocked = blockedBy.filter((user) => global.userId === user);
      blockMsg = `${Helper.capitalize(
        Helper.concatName(challenger),
      )} has blocked this chat.`;
      setChatEnabled(isBlocked.length === 0);
    }
  };

  const setUserLastSeenAndMakeOffline = useCallback(() => {
    offlineSelf(false, () => {
      resetOldData();
      setTimeout(() => {
        navigation.reset({
          routes: [{name: 'Dashboard'}, {name: 'ChatUserList'}],
        });
      }, 200);
    });
  }, [navigation]);

  const handleOnScroll = (event) => {
    const {
      nativeEvent: {
        contentOffset: {y: contentOffsetY},
      },
    } = event;

    if (contentOffsetY > scrollToBottomOffset) {
      setShowScrollToBottom(true);
    } else {
      if (contentOffsetY === 0) {
        newMessageList.forEach((element) => {
          setMessages((previousMessages) => append(previousMessages, element));
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
    selectedFontSize = 1;
    challenger = null;
    opponent = null;
    isGroup = null;
    isChatExist = null;
    newItems = false;
    lastPickedMsgId = '';
    backHandler = null;
    isStickerShowing = false;
    lastPickIndex = -1;
    blockMsg = '';
    inEditMode = false;
    isOpponentMuted = false;
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
    lastOnlineStatus = false;
    imageArray = [];
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
          onEmojiSelected={(emoji) => {
            emojiRef.current.close();
            handleInputChat(1, emoji, 6, '');
          }}
        />
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
                  <View style={[g.bggray, g.oh, {borderRadius: scale(50)}]}>
                    <ProgressImage
                      source={headerImage}
                      containerStyle={styles.imageStyle}
                      mode={'cover'}
                    />
                  </View>
                  <View
                    style={{
                      //backgroundColor: isOpponentOnline ? '#4CD663' : 'gray',
                      backgroundColor: isOpponentOnline ? 'green' : 'gray',
                      height: scale(10),
                      width: scale(10),
                      borderRadius: scale(100),
                      position: 'absolute',
                      bottom: 0,
                      right: -5,
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ChatUserProfile', {
                      userId: opponent._id,
                    });
                  }}
                  style={[grid.col, g.ml5, g.mr5]}>
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
                      {isOpponentTyping ? 'typing...' : subHeader}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <View
                style={[
                  grid.rowrow,
                  grid.alignItems,
                  grid.justifyContent,
                  {height: 30},
                ]}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setFontSize(scale(14));
                    selectedFontSize = 1;
                  }}>
                  <Text
                    style={[
                      selectedFontSize === 1 ? g.colorBlue : g.colordarkGray,
                      selectedFontSize === 1 ? g.textunderline : null,
                      {
                        lineHeight: 18,
                        fontSize: 12,
                      },
                      g.FHNB,
                    ]}>
                    A
                  </Text>
                </TouchableOpacity>
                <View style={{marginHorizontal: scale(4)}} />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setFontSize(scale(18));
                    selectedFontSize = 2;
                  }}>
                  <Text
                    style={[
                      selectedFontSize === 2 ? g.colorBlue : g.colordarkGray,
                      selectedFontSize === 2 ? g.textunderline : null,
                      {lineHeight: 20, fontSize: 15},
                      g.FHNB,
                    ]}>
                    A
                  </Text>
                </TouchableOpacity>
                <View style={{marginHorizontal: scale(3)}} />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setFontSize(scale(22));
                    selectedFontSize = 3;
                  }}>
                  <Text
                    style={[
                      selectedFontSize === 3 ? g.colorBlue : g.colordarkGray,
                      selectedFontSize === 3 ? g.textunderline : null,
                      {lineHeight: 20, fontSize: 20},
                      g.FHNB,
                    ]}>
                    A
                  </Text>
                </TouchableOpacity>
              </View>
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
                });
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
            Remove Message
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
        // height={
        //   selectedChatObject !== null &&
        //   selectedChatObject.user._id === global.userId
        //     ? 280
        //     : 180
        // }
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
                        autoCapitalize="none"
                        underlineColorAndroid="transparent"
                        style={[styles.inputContainer, styles.inputView]}
                        keyboardType="default"
                        value={inputValue}
                        multiline={true}
                        placeholder="Enter text here"
                        onChangeText={(input) => {
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
                        handleInputChat(1, inputValue, 1, '');
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
                <TouchableOpacity
                  onPress={() => blockUser(false)}
                  activeOpacity={1}
                  disabled={!isSenderBlocked}
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
                </TouchableOpacity>
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
        onPickMedia={(media) => {
          if (media !== undefined && media !== null) {
            media.forEach((item) => {
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
              handleInputChat(2, inputValue, mediaType, item.fileName);
            });
          }

          uploadRef.current.close();
        }}
      />
      {emojiList()}
      {chatOptions()}

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

export default ChatScreen;
