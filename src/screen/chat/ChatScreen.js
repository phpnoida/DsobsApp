import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Keyboard,
  BackHandler,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {renderNoDataComponent, showProgess} from '../../component/Common';
import UploadMedia from '../../component/UploadMedia';
import ProgressImage from '../../component/ProgresImage';
import DocViewer from '../../component/DocViewer';
import Player from '../../component/Player/Player';
import {showMediaType, showImageThumb} from './ChatDelegates';

import GlobalInclude from '../../globalInclude/Globalinclude';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {IconType, APP_NAME} from '../../helper/Constants';
import ThreeDotsLoader from '../../helper/ThreeDotsLoader';
import ChatItem from './ChatItem';
import Helper from '../../helper/Helper';
import EmojiSelector from 'react-native-emoji-selector';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import * as Animatable from 'react-native-animatable';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';

// Firestore
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {useCollection} from 'react-firebase-hooks/firestore';

import {
  createSingleChat,
  checkChatExist,
  updateChatObject,
  getChatObject,
  setUserLastSeen,
  sendPushNotification,
} from '../../helper/ChatHelper';

const {height} = Dimensions.get('window');
let selectedFontSize = 1;
let challenger = null,
  opponent = null,
  isGroup = null;
let isChatExist = null;
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

const usersCollection = firestore().collection('Users');
const chatCollection = firestore().collection('Chats');
const reference = database().ref('Messages');

const ChatScreen = ({route, navigation}) => {
  const uploadRef = useRef();
  const emojiRef = useRef();
  const animRef = useRef();
  const chatObjRef = useRef();
  const chatRef = useRef();
  const playbackState = usePlaybackState();

  const transform =
    Platform.OS === 'android'
      ? [{scaleY: -1}, {perspective: 1280}]
      : [{scaleY: -1}];

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [messages, setMessages] = useState([]);
  const [fontSize, setFontSize] = useState(scale(12));
  const [inputValue, setInputValue] = useState('');
  const [header, setHeader] = useState(APP_NAME);
  const [subHeader, setSubHeader] = useState(APP_NAME);
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

  const [animatedWidth] = useState(new Animated.Value(0));
  const [animatedOpacity] = useState(new Animated.Value(0));

  const [snapshot] = useCollection(
    usersCollection.where('_id', '==', route.params.opponent._id),
  );
  const [isTyping] = useCollection(
    chatCollection.where('_id', '==', messageThreadId),
  );

  useEffect(() => {
    if (
      route !== undefined &&
      route.params !== undefined &&
      route.params !== null
    ) {
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
    }
    setHeaderBar();
    const appFunction = async () => {
      isChatExist = await checkChatExist(opponent._id, 1);

      if (isChatExist !== null) {
        setMessageThreadId(isChatExist._id);
      } else {
        setIsFirstLoad(false);
      }
    };
    appFunction();

    const backAction = () => {
      if (navigation.isFocused()) {
        setUserLastSeen(false, new Date().getTime(), () => {
          navigation.replace('ChatUserList');
        });
        return true;
      }
    };

    backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  }, [route, navigation, setHeaderBar]);

  useEffect(() => {
    if (snapshot !== undefined && snapshot !== null) {
      if (
        snapshot.docs !== undefined &&
        snapshot.docs !== null &&
        snapshot.docs.length > 0
      ) {
        let data = snapshot.docs[0].data();
        if (data && data !== null && data !== undefined) {
          setChatEnabled(true);
          setIsOpponentOnline(data.isOnline);
          checkOpponentBlocked(data.blockedUser, data.blockedBy);
        }
      }
    }
    return () => {};
  }, [snapshot]);

  useEffect(() => {
    if (isTyping !== undefined && isTyping !== null) {
      if (
        isTyping.docs !== undefined &&
        isTyping.docs !== null &&
        isTyping.docs.length > 0
      ) {
        let data = isTyping.docs[0].data();
        if (data && data !== null && data !== undefined) {
          let isMuted = data.mutedBy.filter((item) => global.userId === item);
          isOpponentMuted = isMuted.length > 0 ? true : false;
          let typingUser = data.isTyping;
          for (let i = 0; i < typingUser.length; i++) {
            const element = typingUser[i];
            if (element.userId !== global.userId) {
              setIsOpponentTyping(element.status);
              break;
            }
          }
        }
      }
    }
    return () => {};
  }, [isTyping]);

  useEffect(() => {
    if (messageThreadId === '') {
      return;
    }
    console.log('====================================');
    console.log('useEffect-129', messageThreadId);
    console.log('====================================');
    const mainRef = reference.child(messageThreadId).ref;
    let childAddedHandler;

    const onError = (error) => {
      console.log('====================================');
      console.log('firebase error', error);
      console.log('====================================');
    };

    const onChildAdded = (child, previousKey) => {
      if (!newItems || lastPickedMsgId === child.val()._id) {
        return;
      }

      console.log('====================================');
      console.log('childAdded', child, previousKey);
      console.log('====================================');
      if (child && child !== null && child !== undefined) {
        let nextMsg = JSON.parse(JSON.stringify(child.val()));

        let msgUser = nextMsg.user;
        if (
          msgUser._id !== undefined &&
          msgUser._id !== null &&
          msgUser._id !== global.userId
        ) {
          nextMsg.isRead = true;
          updateChatMsg(nextMsg, true);
        } else {
          setMessages((previousMessages) =>
            append(previousMessages, child.val()),
          );
        }
      }
    };

    const onValue = (snapshots) => {
      if (snapshots && snapshots !== undefined) {
        console.log('====================================');
        console.log('onValue');
        console.log('====================================');
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
        /**
         * 
         * const children = [];
        const onChildAddedWithoutInitialLoad = (addedChild, previousKey) => {
          if (childrenToProcess > 0) {
            childrenToProcess--;
            children.push(addedChild.val());
            if (childrenToProcess === 0) {
              onValue(children);
              updateAllChilds(children);
              setIsFirstLoad(false);
            }
            return;
          }
          onChildAdded(addedChild, previousKey);
        };
        childAddedHandler = mainRef
          .limitToLast(1)
          .on('child_added', onChildAddedWithoutInitialLoad, onError);
         * 
         */
        const children = [];
        let unreadPosition = -1;
        let unreadCount = 0;

        try {
          objectValue.forEach((item, index, array) => {
            const element = item.val();
            childrenToProcess--;
            if (!isGroup) {
              if (!element.isRead && element.user._id !== global.userId) {
                unreadCount++;
                if (unreadPosition === -1) {
                  unreadPosition = index;
                }
              }
            }

            children.push(element);
            if (childrenToProcess === 0) {
              lastPickedMsgId = element._id;

              let systemMsg = {
                system: true,
                message: `(${unreadCount}) Unread Messages`,
                createdAt: new Date().getTime(),
                messageType: 1,
                media: '',
                user: getUserObject(),
                isRead: true,
                isSent: true,
                replay: {},
                removedBy: [],
              };
              if (unreadPosition > -1) {
                children.splice(unreadPosition, 0, systemMsg);
              }
              onValue(children);
              updateAllChilds(children, messageThreadId);
            }
          });
        } catch (error) {
          console.log('====================================');
          console.log('error', error);
          console.log('====================================');
        }
      }
    };

    mainRef.once('value', onInitialLoad, onError);

    return () => {
      mainRef.off('child_added', childAddedHandler);
      //mainRef.off('child_changed', childChangedHandler);
      backHandler.remove();
    };
  }, [messageThreadId, updateChatMsg, updateAllChilds]);

  useEffect(() => {
    if (messageThreadId === '') {
      return;
    }

    const mainRef = reference.child(messageThreadId).ref;

    const onError = (error) => {
      console.log('====================================');
      console.log('firebase error', error);
      console.log('====================================');
    };

    const onChildChanged = (childChanged) => {
      console.log('====================================');
      console.log('snapshots-onChildChanged', childChanged);
      console.log('====================================');
      if (childChanged && childChanged !== null && childChanged !== undefined) {
        let nextMsg = JSON.parse(JSON.stringify(childChanged.val()));
        let msgUser = nextMsg.user;
        if (
          msgUser._id !== undefined &&
          msgUser._id !== null &&
          msgUser._id === global.userId
        ) {
          nextMsg.isRead = true;
          setTimeout(() => {
            refreshChildrens(nextMsg);
          }, 200);
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
  }, [messages, messageThreadId, refreshChildrens]);

  const refreshChildrens = useCallback(
    (child) => {
      let oldData = messages;
      let isFound = false;

      for (let i = 0; i < oldData.length; i++) {
        const item = oldData[i];
        if (item._id === child._id) {
          oldData[i] = child;
          isFound = true;
          break;
        }
      }
      if (isFound) {
        updateChatMsg(child, false);
        setMessages([...oldData]);
      }
    },
    [messages, updateChatMsg],
  );

  const updateAllChilds = useCallback((childs, messageId) => {
    let updateArray = [];
    let isFound = false;
    var rv = {};
    for (var i = 0; i < childs.length; ++i) {
      const element = childs[i];
      if (element.user._id !== global.userId) {
        if (!element.isRead || !element.isSent) {
          isFound = true;
          element.isRead = true;
          element.isSent = true;
          updateArray.push(element);
          rv[element._id] = element;
        }
      }
    }

    if (isFound) {
      reference
        .child(messageId)
        .update(rv)
        .then(() => {
          getChatObject(messageId, (response) => {
            if (response && response !== null && response !== undefined) {
              let unreadCount = response.unreadCount;
              unreadCount.forEach((element) => {
                if (element.userId === global.userId) {
                  element.count = 0;
                }
              });
              const request = {
                unreadCount: unreadCount,
              };
              updateChatObject(messageId, request, () => {});
            }
          });
        });
    }
  }, []);

  const setUnreadCount = () => {
    getChatObject(messageThreadId, (response) => {
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
        updateChatObject(messageThreadId, request, () => {});
      }
    });
  };

  const updateChatMsg = useCallback(
    (updateObject, appendMsg) => {
      reference
        .child(messageThreadId)
        .child(updateObject._id)
        .update(updateObject)
        .then(() => {
          if (appendMsg) {
            setMessages((previousMessages) =>
              append(previousMessages, updateObject),
            );
          }
        });
    },
    [messageThreadId],
  );

  const append = (currentMessages = [], message) => {
    if (!Array.isArray(message)) {
      message = [message];
    }
    return message.concat(currentMessages);
  };

  const checkOpponentBlocked = (blockedList, blockedBy) => {
    if (
      blockedList !== undefined &&
      blockedList !== null &&
      blockedList !== ''
    ) {
      let isBlocked = blockedList.filter((user) => global.userId === user);
      blockMsg = `${opponent.firstName} has blocked this chat.`;
      setChatEnabled(isBlocked.length === 0);
    }
    if (blockedBy !== undefined && blockedBy !== null && blockedBy !== '') {
      let isBlocked = blockedBy.filter((user) => global.userId === user);
      blockMsg = `${challenger.firstName} has blocked this chat.`;
      setChatEnabled(isBlocked.length === 0);
    }
  };

  const setHeaderBar = useCallback(() => {
    if (!isGroup) {
      if (opponent !== undefined && opponent !== null) {
        if (
          opponent.profileImg !== undefined &&
          opponent.profileImg !== null &&
          opponent.profileImg !== ''
        ) {
          setHeaderImage({uri: opponent.profileImg});
        }
        setHeader(Helper.concatName(opponent) + ' - ' + opponent.batch);
        setSubHeader(opponent.profession);
        checkOpponentBlocked(opponent.blockedUser, opponent.blockedBy);
      }
    } else {
      // if (
      //   chatDetail.profileImg !== undefined &&
      //   chatDetail.profileImg !== null &&
      //   chatDetail.profileImg !== ''
      // ) {
      //   itemImage = {uri: chatDetail.profileImg};
      // }
      // setHeader(chatDetail.groupName);
    }
  }, []);

  const sendUserTyping = (typing) => {
    const request = {
      isTyping: [
        {userId: global.userId, status: typing},
        {userId: opponent._id, status: false},
      ],
    };
    updateChatObject(messageThreadId, request, () => {});
  };

  const generateSingleChat = async (callback) => {
    createSingleChat(opponent, (chatId) => {
      if (chatId !== undefined && chatId !== null) {
        isChatExist = chatId;
        setMessageThreadId(chatId);
        callback(chatId);
      }
    });
  };

  const generateChatObject = (message, media, mediaType) => {
    return {
      message: message,
      createdAt: new Date().getTime(),
      messageType: mediaType,
      media: media,
      user: getUserObject(),
      isRead: isOpponentOnline,
      isSent: true,
      replay: {},
      removedBy: [],
    };
  };

  const addObjectToChat = (request, chatId) => {
    let childRef = reference.child(chatId);
    childRef.push().then((snap) => {
      const _id = snap.key;
      request._id = _id;
      snap.set(request).then(() => {
        if (!isGroup && !isOpponentOnline) {
          setUnreadCount();
          if (!isOpponentMuted) {
            sendPushNotification(
              opponent,
              request.message.trim() === '' ? 'Shared Media' : request.message,
            );
          }
        }
        setLastMessage(
          request.message.trim() === '' ? 'Shared Media' : request.message,
          chatId,
        );
        setIsSending(false);
        setInputValue('');
        //Keyboard.dismiss();
        if (isReplayEditComment) {
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
          setIsReplayEditComment(false);
          setSelectedChatObject(null);
        }
      });
    });
  };

  const setLastMessage = (lastMsg, chatId) => {
    const request = {
      lastMessage: lastMsg,
      lastMessageTime: new Date().getTime(),
      isTyping: [
        {userId: global.userId, status: false},
        {userId: opponent._id, status: false},
      ],
    };

    updateChatObject(chatId, request, () => {});
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

  const postMsg = (request) => {
    setIsSending(true);
    if (isChatExist === null) {
      generateSingleChat((chatId) => {
        addObjectToChat(request, chatId);
      });
    } else {
      addObjectToChat(request, messageThreadId);
    }
  };

  const editMessageInThread = () => {
    let selectedMsg = selectedChatObject;
    selectedMsg.message = inputValue;
    reference
      .child(messageThreadId)
      .child(selectedMsg._id)
      .update(selectedMsg)
      .then(() => {
        let oldData = messages;
        oldData[lastPickIndex] = selectedMsg;
        setMessages([...oldData]);
        setIsSending(false);
        setInputValue('');
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

  /**
   *
   * Player
   *
   */
  const start = async () => {
    // Set up the player
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
      ],
    });

    // Add a track to the queue
    await TrackPlayer.add({
      id: 'trackId',
      url: playAudio,
      title: 'Play Audio',
      artist: 'Track Artist',
    });

    // Start playing it
    await TrackPlayer.play();
  };

  async function togglePlayback() {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack == null) {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'trackId',
        url: playAudio,
        title: 'Play Audio',
        artist: 'Track Artist',
      });
      await TrackPlayer.play();
    } else {
      if (playbackState === TrackPlayer.STATE_PAUSED) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  }
  /**
   *
   * Player
   *
   */

  const renderHeader = () => {
    return (
      <View style={headerStyle.headerContainer}>
        <View style={headerStyle.topContainer} />
        <View style={headerStyle.container}>
          <View style={[grid.alignItems, grid.justifyContentCenter]}>
            <TouchableOpacity
              onPress={() => {
                setUserLastSeen(false, new Date().getTime(), () => {
                  navigation.replace('ChatUserList');
                });
              }}
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
                  backgroundColor: isOpponentOnline ? 'green' : 'gray',
                  height: scale(12),
                  width: scale(12),
                  borderRadius: scale(100),
                  position: 'absolute',
                  bottom: 3,
                  right: -3,
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChatUserProfile', {userId: opponent._id});
              }}
              style={[grid.col, g.ml5, g.mr5]}>
              <Text
                style={[g.fs14, g.FHNB, g.colordarkGray, g.txtLeft]}
                numberOfLines={1}>
                {header}
              </Text>
              <Text
                style={[g.fs11, g.FHNB, g.colordarkGray, g.txtLeft, g.mt2]}
                numberOfLines={1}>
                {isOpponentTyping ? 'typing...' : subHeader}
              </Text>
              {/* {isOpponentOnline ? (
                <Text
                  style={[g.fs11, g.FHNB, g.colordarkGray, g.txtLeft, g.mt1]}
                  numberOfLines={1}>
                  {isOpponentTyping ? 'typing...' : subHeader}
                </Text>
              ) : (
                <Text
                  style={[g.fs11, g.FHNB, g.colordarkGray, g.txtLeft, g.mt1]}
                  numberOfLines={1}>
                  LastSeen: {moment(lastSeen).fromNow()}
                </Text>
              )} */}
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
                setFontSize(scale(12));
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
                setFontSize(scale(16));
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
                setFontSize(scale(20));
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
        <View style={headerStyle.shadowView} />
      </View>
    );
  };

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
            if (item.messageType === 5) {
              documentItem =
                item.fileName &&
                item.fileName !== undefined &&
                item.fileName !== null
                  ? item.fileName
                  : item.thumbnail;
              setShowDocViewer(true);
            } else if (item.messageType === 4) {
              playAudio = item.thumbnail;
              setShowPlayer(!showPlayer);
              start();
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
            let request = generateChatObject(emoji, '', 6);
            postMsg(request);
          }}
        />
      </OptionsSheet>
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
                .child(messageThreadId)
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

  const showOtherPostOptions = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            if (
              chatObjRef.current !== undefined &&
              chatObjRef.current !== null
            ) {
              chatObjRef.current.close();
            }
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
            Report Comment
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const postComments = () => {
    return (
      <OptionsSheet
        ref={chatObjRef}
        minClosingHeight={50}
        height={
          selectedChatObject !== null &&
          selectedChatObject.user._id === global.userId
            ? 260
            : 210
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
              {borderBottomWidth: 2, borderBottomColor: '#ebebe4'},
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
          selectedChatObject.user._id === global.userId
            ? showUserPostOptions()
            : showOtherPostOptions()}
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

  const keyExtractor = (item, index) => index;

  const interpolatedHeight = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [isStickerShowing ? 0 : 45, !isStickerShowing ? 45 : 0],
  });

  const interpolatedOpacity = animatedOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [!isStickerShowing ? 1.0 : 0.0, isStickerShowing ? 0.0 : 1.0],
  });

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bggray3]}>
      {renderHeader()}
      {showProgess(isFirstLoad)}
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
            // onEndReached={onEndReached}
            // refreshing={isRefreshing}
            // onRefresh={handleRefresh}
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
            // style={{transform: [{scaleY: -1}]}}
          />
        )}

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
                              backgroundColor: GlobalInclude.Color.ColorPrimary,
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
                            {Helper.concatName(selectedChatObject.user)}
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
                  <View style={[g.pb5, grid.rowdir]}>
                    <Animated.View
                      useNativeDriver={true}
                      style={[
                        {
                          width: interpolatedHeight,
                          opacity: interpolatedOpacity,
                          height: scale(40),
                          borderRadius: scale(10),
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                        },
                      ]}>
                      <TouchableOpacity
                        onPress={() => {
                          if (emojiRef !== undefined && emojiRef !== null) {
                            emojiRef.current.open();
                          }
                        }}
                        style={[styles.commentButton]}>
                        <GlobalInclude.BaseIcon
                          containerStyle={{height: scale(20), width: scale(20)}}
                          iconColor={GlobalInclude.Color.ColorPrimary}
                          iconName={'sticker-emoji'}
                          iconSize={scale(20)}
                          iconType={IconType[1]}
                        />
                      </TouchableOpacity>
                    </Animated.View>
                    <TextInput
                      autoCapitalize="none"
                      underlineColorAndroid="transparent"
                      style={[styles.inputContainer, styles.inputView]}
                      keyboardType="default"
                      value={inputValue}
                      placeholder="Enter text here"
                      onChangeText={(input) => {
                        setInputValue(input);
                        sendUserTyping(input.length > 0 ? true : false);

                        if (input.length > 0 && !isStickerShowing) {
                          isStickerShowing = true;
                          //animRef.current.slideOutLeft().then(() => {});
                          Animated.parallel(
                            [
                              Animated.timing(animatedWidth, {
                                toValue: 1,
                                duration: 1000,
                              }),
                              Animated.timing(animatedOpacity, {
                                toValue: 1,
                                duration: 500,
                              }),
                            ],
                            {
                              stopTogether: false,
                            },
                          ).start();
                        } else if (input.length === 0 && isStickerShowing) {
                          isStickerShowing = false;
                          //animRef.current.slideInLeft().then(() => {});
                          Animated.parallel(
                            [
                              Animated.timing(animatedWidth, {
                                toValue: 0,
                                duration: 500,
                              }),
                              Animated.timing(animatedOpacity, {
                                toValue: 0,
                                duration: 500,
                              }),
                            ],
                            {
                              stopTogether: false,
                            },
                          ).start();
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
                      setIsSending(true);
                      if (inEditMode) {
                        editMessageInThread();
                      } else if (isReplayEditComment) {
                        postUserCommentInThread(inputValue, '', 1);
                      } else {
                        let request = generateChatObject(inputValue, '', 1);
                        postMsg(request);
                      }
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
                    g.fs16,
                    g.FHNB,
                    g.txtCenter,
                    g.txtCenterVertical,
                  ]}>
                  {blockMsg === '' ? 'This chat has been blocked' : blockMsg}
                </Text>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
      <UploadMedia
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

              console.log('====================================');
              console.log('mediaType', mediaType);
              console.log('====================================');

              if (isReplayEditComment) {
                postUserCommentInThread(inputValue, item.fileName, mediaType);
              } else {
                let request = generateChatObject(
                  inputValue,
                  item.fileName,
                  mediaType,
                );
                postMsg(request);
              }
            });
          }

          uploadRef.current.close();
        }}
      />
      {emojiList()}
      {postComments()}

      {showDocViewer && (
        <DocViewer
          mediaContent={documentItem}
          onClose={() => {
            setShowDocViewer(false);
          }}
        />
      )}

      <Modal
        transparent={true}
        onRequestClose={() => {
          TrackPlayer.stop().then(() => {
            setShowPlayer(!showPlayer);
          });
        }}
        visible={showPlayer}>
        <View style={styles.modalView}>
          <View style={styles.centeredView}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 15,
                shadowColor: '#333333',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 5,
                padding: 8,
                width: '90%',
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                height: scale(130),
              }}>
              <TouchableOpacity
                onPress={() => {
                  TrackPlayer.stop().then(() => {
                    setShowPlayer(!showPlayer);
                  });
                }}
                style={{
                  width: scale(32),
                  height: scale(32),
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  alignSelf: 'flex-end',
                }}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(30), width: scale(30)}}
                  iconColor={'#000'}
                  iconName={'close'}
                  iconSize={scale(30)}
                  iconType={IconType[8]}
                />
              </TouchableOpacity>
              <View style={{flex: 1}}>
                <Player onTogglePlayback={togglePlayback} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
