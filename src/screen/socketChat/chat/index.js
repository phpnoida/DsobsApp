import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  FlatList,
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Alert,
  ScrollView,
  Modal,
  UIManager,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import {showProgess} from '../../../component/Common';
import UploadMedia from '../../../component/UploadMedia';
import ProgressImage from '../../../component/ProgresImage';
import DocViewer from '../../../component/DocViewer';
import AudioPlayer from '../../../component/AudioPlayer';
import ImageViewer from '../../../component/ImageViewer';
import {showImageThumb} from '../../chat/ChatDelegates';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {IconType, APP_NAME} from '../../../helper/Constants';
import ThreeDotsLoader from '../../../helper/ThreeDotsLoader';
import ChatItem from './ChatBubble';
import Helper from '../../../helper/Helper';
import EmojiSelector from 'react-native-emoji-selector';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import * as Animatable from 'react-native-animatable';
import {getScrappedData} from '../../../Actions/CommonActions';
import {
  doAboutGroup,
  doGetGroupMessages,
  doSearchMessage,
  doGetMessageInfo,
} from '../../../Actions/SocketChatActions';
import {_downloadContent} from '../../../helper/mediaHelper';
import {
  KeyboardAccessoryView,
  useComponentSize,
} from '../../../component/keyboardView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import io from 'socket.io-client';
import _ from 'lodash';
import RNBeep from 'react-native-a-beep';
import {SERVER_PATH} from '../../../../config';

const {height, width} = Dimensions.get('window');

let selectedFontSize = 1,
  isBackTap = false,
  responseMessage = '',
  totalPages = 0,
  currentPage = 1,
  fitlerText = '';

let isStickerShowing = false;
let blockMsg = '';
let inEditMode = false;
let documentItem = '';
let playAudio = '';
let extraObjects = null;
let bottomUnread = 0;
let newMessageList = [];
let imageArray = [];
let messagePosition = -1;
let isLoadingEarlier = false;
let chatType = 0;
let userStatusForChat = 1;
let blockUserStatus = -1;
const scrollToBottomOffset = 200;
let timerInterval = null;
let ownTimerInterval = null;
let opponentInfo = null;
let groupId = '';
let isSenderBlocked = false;
let imageUrl = '';
let counter = 0;
let authorId = 0;
let filterObject = {
  page: 1,

  groupId: '',
};
let searchfilterObject = {
  page: 1,
  search: '',
};

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};

var lastTypingTime = 0;
let typing = false;
let typingUserName = '';

const MakeChat = ({route, navigation}) => {
  const socketRef = useRef();
  const uploadRef = useRef();
  const emojiRef = useRef();
  const animRef = useRef();
  const chatObjRef = useRef();
  const chatRef = useRef();
  const messageInfoRef = useRef();
  const {onLayout} = useComponentSize();
  const insets = useSafeAreaInsets();

  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [allDone, setAllDone] = useState(false); //this will hide ui until all data come
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterMessage, setFilterMessage] = useState([]);

  const [fontSize, setFontSize] = useState(scale(14));
  const [scaleSize, setScaleSize] = useState(scale(22));

  const [isDownloading, setIsDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [header, setHeader] = useState('');
  const [subHeader, setSubHeader] = useState('');
  const [headerImage, setHeaderImage] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChatObject, setSelectedChatObject] = useState(null);
  const [isReplayEditComment, setIsReplayEditComment] = useState(false);
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [emojiIconWidth, setEmojiIconWidth] = useState(scale(40));
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [bottomMessages, setBottomMessages] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [freshSearch, setFreshSearch] = useState(true);
  const [messageInfo, setMessageInfo] = useState(null);

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showHideMessageAlert, setShowHideMessageAlert] = useState(false);
  const [showRemoveMessageAlert, setShowRemoveMessageAlert] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    resetOldData();
    resetCount();

    if (route.params !== undefined && route.params !== null) {
      groupId = route.params.groupId;
      filterObject.groupId = groupId;
      chatType = route.params.chatType;
    }
    getGroupData().then(() => {
      getOldMessages();
    });

    // const unsubscribe = navigation.addListener('focus', () => {
    //   if (route.params !== undefined && route.params !== null) {
    //     groupId = route.params.groupId;
    //     filterObject.groupId = groupId;
    //     chatType = route.params.chatType;
    //   }
    //   getGroupData().then(() => {
    //     getOldMessages();
    //   });
    // });

    const backAction = () => {
      if (!isBackTap) {
        isBackTap = true;
        disconnectUser();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      if (backHandler !== undefined && backHandler !== null) {
        backHandler.remove();
      }

      // unsubscribe();
    };
  }, [navigation, getGroupData, route.params, disconnectUser, getOldMessages]);

  /**
   * Socket
   */
  useEffect(() => {
    if (
      socketRef == null ||
      socketRef.current === null ||
      socketRef.current === undefined
    ) {
      socketRef.current = io(SERVER_PATH, {
        reconnectionAttempts: 2,
      });
    }

    socketRef.current.on('connect', () => {
      if (socketRef.current.connected) {
        setIsConnected(true);
        setTimeout(() => {
          checkOwnStatus();
          joinGroupRequest();
        }, 100);

        socketRef?.current?.removeListener('chat-removed-user');
        socketRef.current.on('chat-removed-user', event => {
          if (event && event !== null && event !== undefined) {
            if (
              event.userId &&
              event.userId !== null &&
              event.userId !== undefined
            ) {
              var isExist = event.userId.findIndex(x => x === global.userId);
              if (isExist > -1) {
                blockMsg = 'Admin removed you from group!';
                setIsConnected(false);
                setTimeout(() => {
                  disconnectUser();
                }, 5000);
              }
            }
          }
        });

        socketRef?.current?.removeListener('chat-updated');
        socketRef.current.on('chat-updated', event => {
          if (event && event !== null && event !== undefined) {
            if (event.status) {
              getGroupData();
            }
          }
        });

        socketRef?.current?.removeListener('chat-check-online-user-ack');
        socketRef.current.on('chat-check-online-user-ack', event => {
          if (event && event !== null && event !== undefined) {
            if (event.userId === opponentInfo?._id) {
              setIsOnline(event.status);
            }
          }
        });

        socketRef?.current?.removeListener('typing-ack');
        socketRef.current.on('typing-ack', event => {
          if (event && event !== null && event !== undefined) {
            if (event.status) {
              let data = event.data;
              typingUserName = data.userName;
              setIsTyping(data.status);
            }
          }
        });
      }
    });
  }, [joinGroupRequest, disconnectUser, getGroupData, checkOwnStatus]);

  useEffect(() => {
    socketRef?.current?.removeListener('chat-get-message');
    socketRef?.current?.on('chat-get-message', event => {
      if (event && event !== null && event !== undefined) {
        let message = event.message;
        let author = message.authorId;
        let oldData = messages;
        var index = oldData.findIndex(x => x._id === message._id);
        if (index < 0) {
          if (author._id !== global.userId) {
            playBeep();
            readMessage([message._id]);
          }
          if (showScrollToBottom) {
            bottomUnread = bottomUnread + 1;
            setBottomMessages(bottomUnread);
          }
          setMessages(previousMessages => append(previousMessages, message));
        }
      }
    });

    socketRef?.current?.removeListener('chat-get-edited-message');
    socketRef?.current?.on('chat-get-edited-message', event => {
      if (event && event !== null && event !== undefined) {
        let message = event.message;
        let _id = message._id;
        let oldData = messages;
        var index = oldData.findIndex(x => x._id === _id);
        if (index > -1) {
          oldData[index] = message;
          setMessages([...oldData]);
        }
      }
    });

    socketRef?.current?.removeListener('chat-message-hidden');
    socketRef?.current?.on('chat-message-hidden', event => {
      if (event && event !== null && event !== undefined) {
        let message = event.messageId;
        let oldData = messages;
        var index = oldData.findIndex(x => x._id === message);
        if (index > -1) {
          oldData[index].isHidden = true;
          setMessages([...oldData]);
        }
      }
    });

    socketRef?.current?.removeListener('chat-message-removed');
    socketRef?.current?.on('chat-message-removed', event => {
      if (event && event !== null && event !== undefined) {
        let message = event.messageId;
        let isDeleted = event.isDeleted;
        let oldData = messages;
        var index = oldData.findIndex(x => x._id === message);
        if (index > -1) {
          oldData[index].isDeleted = isDeleted;
          setMessages([...oldData]);
        }
      }
    });

    socketRef?.current?.removeListener('chat-blocked-user');
    socketRef.current.on('chat-blocked-user', event => {
      if (event && event !== null && event !== undefined) {
        if (event.status) {
          let blockedUser = event.blockUserId;
          if (
            blockedUser &&
            blockedUser !== null &&
            blockedUser === global.userId
          ) {
            blockMsg = `${Helper.capitalize(
              opponentInfo?.firstName,
            )} blocked this chat!`;
            setIsConnected(false);
          }
        }
      }
    });

    socketRef?.current?.removeListener('chat-unblocked-user');
    socketRef.current.on('chat-unblocked-user', event => {
      if (event && event !== null && event !== undefined) {
        if (event.status) {
          let blockedUser = event.blockedUser;
          let blockedUserBy = event.blockedUserBy;
          if (
            (blockedUser &&
              blockedUser !== null &&
              blockedUser === global.userId) ||
            (blockedUserBy &&
              blockedUserBy !== null &&
              blockedUserBy === global.userId)
          ) {
            setIsConnected(true);
          }
        }
      }
    });

    socketRef?.current?.removeListener('chat-read-message-ack');
    socketRef.current.on('chat-read-message-ack', event => {
      if (event && event !== null && event !== undefined) {
        if (event.status) {
          let anyFound = false;
          let message = event.messages;
          let oldData = messages;

          message.forEach(element => {
            let msgId = element._id;
            var index = oldData.findIndex(x => x._id === msgId);
            if (index > -1) {
              anyFound = true;
              oldData[index].messageRead = element.messageRead;
            }
          });

          if (anyFound) {
            setMessages([...oldData]);
          }
        }
      }
    });
  }, [messages, isFiltering, readMessage, showScrollToBottom, playBeep]);

  const playBeep = useCallback(() => {
    //RNBeep.PlaySysSound(24);
    RNBeep.beep();
  }, []);

  const readMessage = useCallback(messageId => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      let payload = {
        chatId: groupId,
        userId: global.userId,
        messageId: messageId,
      };
      socketRef.current.emit('chat-read-message', payload);
    }
  }, []);

  const removeMessageEvent = useCallback(messageId => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      let payload = {
        chatId: groupId,
        messageId: messageId,
        authorId: global.userId,
      };
      socketRef.current.emit('chat-remove-message', payload);
    }
  }, []);

  const hideMessageEvent = useCallback(messageId => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      let payload = {
        chatId: groupId,
        messageId: messageId,
      };
      socketRef.current.emit('chat-hide-message', payload);
    }
  }, []);

  const joinGroupRequest = useCallback(() => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      let payload = {
        chatId: groupId,
        userId: global.userId,
      };
      socketRef.current.emit('chat-subscribe-chat', payload);
    }
  }, []);

  const sendUserTyping = useCallback(status => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      let payload = {
        userName: Helper.capitalize(global.userDetails.firstName),
        chatId: groupId,
        status: status,
      };
      socketRef.current.emit('typing', payload);
    }
  }, []);

  const sendTyping = () => {
    if (!typing) {
      typing = true;
      sendUserTyping(true);
    }
    lastTypingTime = new Date().getTime();

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var diff = timeNow - lastTypingTime;

      if (diff >= 3000 && typing) {
        sendUserTyping(false);
        typing = false;
      }
    }, 3000);
  };

  const checkOpponentStatus = useCallback(opponent => {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }
    timerInterval = setInterval(() => {
      if (socketRef.current !== undefined && socketRef.current !== null) {
        if (opponent !== '') {
          let payload = {
            userId: opponent,
            checkingUserId: global.userId,
          };
          socketRef?.current?.emit('chat-check-online-user', payload);
        }
      }
    }, 2500);
  }, []);

  const checkOwnStatus = useCallback(opponent => {
    if (ownTimerInterval !== null) {
      clearInterval(ownTimerInterval);
    }
    ownTimerInterval = setInterval(() => {
      if (socketRef.current !== undefined && socketRef.current !== null) {
        let pingPayload = {
          userId: global.userId,
        };

        socketRef?.current?.emit('chat-user-ping', pingPayload);
      }
    }, 2500);
  }, []);

  const blockUser = useCallback(isBlocked => {
    if (socketRef?.current !== undefined && socketRef?.current !== null) {
      let payload = {
        blockUserId: opponentInfo?._id,
        blockByUserId: global.userId,
      };
      if (isBlocked) {
        socketRef.current.emit('chat-block-user', payload);
      } else {
        socketRef.current.emit('chat-unblock-user', payload);
      }
    }
  }, []);

  const updateReadMessages = useCallback(
    messageIds => {
      if (
        messageIds !== undefined &&
        messageIds !== null &&
        messageIds.length > 0
      ) {
        readMessage(messageIds);
      }
    },
    [readMessage],
  );

  const disconnectUser = useCallback(() => {
    if (
      socketRef !== undefined &&
      socketRef !== null &&
      socketRef.current !== undefined &&
      socketRef.current !== null
    ) {
      let payload = {
        chatId: groupId,
        userId: global.userId,
      };

      socketRef.current.emit('chat-user-disconnect', payload);

      setTimeout(() => {
        disconnectAllEvents();
        socketRef?.current?.disconnect();
        socketRef.current = null;
        resetOldData();
        navigation.goBack();
      }, 200);
    }
  }, [navigation]);

  const disconnectAllEvents = () => {
    socketRef?.current?.removeListener('chat-user-connected');
    socketRef?.current?.removeListener('chat-get-message');
    socketRef?.current?.removeListener('chat-get-edited-message');
    socketRef?.current?.removeListener('chat-made-admin');
    socketRef?.current?.removeListener('chat-removed-admin');
    socketRef?.current?.removeListener('chat-removed-user');
    socketRef?.current?.removeListener('chat-updated');
    socketRef?.current?.removeListener('chat-message-hidden');
    socketRef?.current?.removeListener('chat-message-removed');
    socketRef?.current?.removeListener('chat-unblocked-user');
    socketRef?.current?.removeListener('chat-status-ack');
    socketRef?.current?.removeListener('chat-check-online-user-ack');
    socketRef?.current?.removeListener('chat-read-message-ack');
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }
    if (ownTimerInterval !== null) {
      clearInterval(ownTimerInterval);
    }
  };

  /**
   * Socket
   */

  const postMessage = object => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      setIsSending(true);
      setInputValue('');
      setEmojiIconWidth(scale(40));
      // animRef.current.slideInLeft().then(() => {});
      // Keyboard.dismiss();
      socketRef?.current?.emit('chat-send-message', object);
      sendUserTyping(false);
      if (isReplayEditComment) {
        object.parentMessageId = selectedChatObject;
      }

      if (inEditMode && selectedChatObject !== null) {
        let oldData = messages;
        var index = oldData.findIndex(x => x._id === selectedChatObject._id);
        if (index > -1) {
          oldData[index] = object;
          setMessages([...oldData]);
        }
      }

      inEditMode = false;
      setIsReplayEditComment(false);
      setSelectedChatObject(null);
      setIsSending(false);
    }
  };

  const setGroupMembers = members => {
    if (members !== undefined && members !== null) {
      let subTitle = '';
      let found = false;
      members.forEach(element => {
        if (element._id !== global.userId) {
          found = true;
          subTitle += Helper.capitalize(element.firstName) + ', ';
        }
      });

      if (found) {
        subTitle = subTitle.replace(/,\s*$/, '');
        subTitle = subTitle + ', You';
        setSubHeader(subTitle);
      } else {
        setSubHeader('You');
      }
    } else {
      setSubHeader(APP_NAME);
    }
  };

  const getGroupData = useCallback(() => {
    return new Promise((resolve, reject) => {
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
              try {
                if (data.status) {
                  let info = data.data;
                  setGroupInfo(info);
                  if (info.chatType === 1) {
                    let superAdmin = info.superAdmins;
                    let members = info.users;
                    let merged = [...members, ...superAdmin];
                    setHeader(info.name);
                    setHeaderImage({uri: info.profilePicture});
                    setGroupMembers([...merged]);
                  } else if (info.chatType === 0) {
                    let user = info.users;
                    let index = user.findIndex(x => x.id._id !== global.userId);
                    if (index > -1) {
                      opponentInfo = user[index].id;
                      setHeader(
                        `${opponentInfo?.firstName} ${opponentInfo?.lastName} `,
                      );
                      setSubHeader(opponentInfo?.profession);
                      setHeaderImage({uri: opponentInfo?.profileImg});
                    }
                  }
                  resolve(true);
                } else {
                  resolve(true);
                }
              } catch (error) {
                resolve(true);
              }
            } else {
              resolve(true);
            }
          }
        },
        (code, error) => {
          resolve(true);
        },
      );
    });
  }, []);

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
        onDone(null);
      },
    );
  };

  const getOldMessages = useCallback(() => {
    isLoadingEarlier = true;
    setIsRefreshing(true);
    setIsLoadData(true);
    if (filterObject.page > 1) {
      global.loader_ref.show_loader(1);
    } else {
      setAllDone(false);
    }
    doGetGroupMessages(
      filterObject,
      groupId,
      response => {
        setIsRefreshing(false);
        setAllDone(true);
        manageResponse(response).then(() => {
          setIsLoadData(false);
          global.loader_ref.show_loader(0);
          setIsFirstLoad(false);
          isLoadingEarlier = false;
        });
      },
      (code, error) => {
        setIsLoadData(false);
        global.loader_ref.show_loader(0);
        setIsRefreshing(false);
        setIsFirstLoad(false);
        setAllDone(true);
        setMessages([]);
        isLoadingEarlier = false;
      },
    );
  }, [manageResponse]);

  const searchMessageContent = useCallback(() => {
    setIsLoadData(true);
    isLoadingEarlier = true;
    doSearchMessage(
      groupId,
      searchfilterObject,
      response => {
        setFreshSearch(false);
        setIsRefreshing(false);
        manageSearchResults(response).then(() => {
          setIsLoadData(false);
          setIsFirstLoad(false);
          isLoadingEarlier = false;
        });
      },
      (code, error) => {
        setIsLoadData(false);
        setIsRefreshing(false);
        setIsFirstLoad(false);
        setFilterMessage([]);
      },
    );
  }, [manageSearchResults]);

  const manageResponse = useCallback(
    response => {
      return new Promise((resolve, reject) => {
        try {
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.data !== null
            ) {
              let data = response.data;
              if (data.status) {
                chatType = data.chatType;
                let array = data.data;
                let tmpArray = [];
                let objArray = [];

                let unreadIds = _.map(_.filter(array, {isRead: false}), '_id');
                totalPages = data.totalPages;
                currentPage = data.currentPage;

                if (chatType === 0) {
                  if (filterObject.page === 1) {
                    let userDetails = data.users;
                    let index = userDetails.findIndex(
                      x => x._id !== global.userId,
                    );
                    if (index > -1) {
                      opponentInfo = userDetails[index];
                    }

                    blockUserStatus = data.blockUserStatus;
                    if (blockUserStatus === 2) {
                      blockMsg = `${Helper.capitalize(
                        opponentInfo.firstName,
                      )} blocked this chat!`;
                      setIsConnected(false);
                    } else if (blockUserStatus === 1) {
                      isSenderBlocked = true;
                      blockMsg = 'You blocked this chat. Tap to unblock';
                      setIsConnected(false);
                    } else if (blockUserStatus === 0) {
                      blockMsg = 'This chat has been blocked!';
                      setIsConnected(false);
                    }
                  }
                  if (opponentInfo !== undefined && opponentInfo !== null) {
                    checkOpponentStatus(opponentInfo._id);
                  }
                } else {
                  userStatusForChat = data.userStatusForChat;
                  if (userStatusForChat === 0) {
                    blockMsg = 'You left';
                    setIsConnected(false);
                  } else if (userStatusForChat === 2) {
                    blockMsg = 'You have been removed by admin!';
                    setIsConnected(false);
                  }
                  checkOpponentStatus(''); //this is for group
                }

                if (unreadIds.length > 0) {
                  updateReadMessages(unreadIds);
                }

                if (array.length === 0) {
                  if (currentPage === 1) {
                    setPaginationStatus(PaginationStatus.allLoaded);
                    setMessages([]);
                  }
                  setTimeout(() => {
                    resolve(true);
                  }, 200);
                } else {
                  for (let i = 0; i < array.length; i++) {
                    let element = array[i];
                    let media = element?.media ?? null;
                    let mediaType = media?.mediaType ?? null;
                    let tmpAuthorId = element?.authorId?._id ?? null;

                    if (authorId === 0) {
                      authorId = tmpAuthorId;
                    }

                    if (authorId === tmpAuthorId) {
                      if (mediaType === 'IMAGE') {
                        counter++;
                        tmpArray.push(element);
                      } else {
                        if (counter > 3) {
                          objArray.push(imageGroupRequest(tmpArray));
                          tmpArray = [];
                          counter = 0;
                        } else {
                          tmpArray.forEach(child => {
                            objArray.push(child);
                          });
                          tmpArray = [];
                          counter = 0;
                        }
                        objArray.push(element);
                      }
                    } else {
                      if (counter > 3) {
                        objArray.push(imageGroupRequest(tmpArray));
                        tmpArray = [];
                        counter = 0;
                      } else {
                        tmpArray.forEach(child => {
                          objArray.push(child);
                        });
                        tmpArray = [];
                        counter = 0;
                      }
                      authorId = tmpAuthorId;

                      if (mediaType === 'IMAGE') {
                        counter++;
                        tmpArray.push(element);
                      } else {
                        if (counter > 3) {
                          objArray.push(imageGroupRequest(tmpArray));
                          tmpArray = [];
                          counter = 0;
                        } else {
                          tmpArray.forEach(child => {
                            objArray.push(child);
                          });
                          tmpArray = [];
                          counter = 0;
                        }
                        objArray.push(element);
                      }
                    }
                  }

                  if (tmpArray.length > 0) {
                    if (counter > 3) {
                      objArray.push(imageGroupRequest(tmpArray));
                      tmpArray = [];
                      counter = 0;
                    } else {
                      tmpArray.forEach(child => {
                        objArray.push(child);
                      });
                      tmpArray = [];
                      counter = 0;
                    }
                  }
                  if (filterObject.page === 1) {
                    setMessages([...objArray]);
                    setTimeout(() => {
                      setPaginationStatus(PaginationStatus.waiting);
                      resolve(true);
                    }, 250);
                  } else {
                    setMessages(old => [...old, ...objArray]);
                    setTimeout(() => {
                      setPaginationStatus(PaginationStatus.waiting);
                      resolve(true);
                    }, 250);
                  }
                }
              }
            }
          }
        } catch (error) {}
      });
    },
    [checkOpponentStatus, updateReadMessages],
  );

  const imageGroupRequest = tmpArray => {
    let author = tmpArray[1].authorId;
    let request = {
      media: {
        mediaType: 'IMAGE_GROUP',
        metaData: {
          imageArray: tmpArray,
        },
      },
      isHidden: false,
      messageText: '',
      isReported: false,
      createdAt: tmpArray[0].createdAt,
      _id: tmpArray[0]._id,
      authorId: {
        _id: author._id,
        profileImg: author.profileImg,
        lastName: author.lastName,
        profession: author.profession,
        batch: author.batch,
        firstName: author.firstName,
      },
    };
    return request;
  };

  const manageSearchResults = useCallback(
    response => {
      return new Promise((resolve, reject) => {
        try {
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.data !== null
            ) {
              let data = response.data;
              if (data.status) {
                chatType = data.chatType;
                let array = data.data;
                checkOpponentStatus(''); //this is for group
                if (array.length === 0) {
                  if (currentPage === 1) {
                    setFilterMessage([]);
                  }
                  setTimeout(() => {
                    resolve(true);
                  }, 200);
                } else {
                  if (searchfilterObject.page === 1) {
                    setFilterMessage([...array]);
                    setTimeout(() => {
                      setPaginationStatus(PaginationStatus.waiting);
                      resolve(true);
                    }, 250);
                  } else {
                    setFilterMessage(old => [...old, ...array]);
                    setTimeout(() => {
                      setPaginationStatus(PaginationStatus.waiting);
                      resolve(true);
                    }, 250);
                  }
                }
              }
            }
          }
        } catch (error) {}
      });
    },
    [checkOpponentStatus],
  );

  const removeMessageFromList = () => {
    removeMessageEvent(selectedChatObject._id);
    responseMessage = 'Message removed successfully!';
    setShowErrorMessage(true);
    let oldData = messages;
    oldData[messagePosition].isDeleted = 0;
    setTimeout(() => {
      setMessages([...oldData]);
      setShowErrorMessage(false);
    }, 2500);
  };

  const hideMessageFromList = () => {
    hideMessageEvent(selectedChatObject._id);
    responseMessage = 'Message hidden successfully!';
    let oldData = messages;
    oldData[messagePosition].isHidden = true;
    setShowErrorMessage(true);
    setTimeout(() => {
      setMessages([...oldData]);
      setShowErrorMessage(false);
    }, 2500);
  };

  const getMessageInfo = messageId => {
    global.loader_ref.show_loader(1);
    doGetMessageInfo(
      groupId,
      messageId,
      response => {
        global.loader_ref.show_loader(0);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              let message = data.message;
              let sendToData = message.sendTo;
              let readData = message.read;

              let messageInfoPayload = {
                sendTo: [],
                read: [],
              };

              if (readData !== undefined && readData !== null) {
                let filteredRead = readData.filter(
                  item => item._id !== global.userId,
                );
                messageInfoPayload.read = filteredRead;
              }
              if (sendToData !== undefined && sendToData !== null) {
                let filteredSend = sendToData.filter(
                  item => item._id !== global.userId,
                );
                filteredSend = filteredSend.filter(item => {
                  return (
                    messageInfoPayload.read.findIndex(
                      obj2 => obj2._id === item._id,
                    ) === -1
                  );
                });
                messageInfoPayload.sendTo = filteredSend;
              }

              setMessageInfo(prevState => ({
                ...prevState,
                ...messageInfoPayload,
              }));
              setTimeout(() => {
                if (
                  messageInfoRef.current !== undefined &&
                  messageInfoRef.current !== null
                ) {
                  messageInfoRef.current.open();
                }
              }, 220);
            }
          }
        }
      },
      (code, error) => {
        global.loader_ref.show_loader(0);
        setIsRefreshing(false);
        setIsFirstLoad(false);
        setMessages([]);
        isLoadingEarlier = false;
      },
    );
  };

  const downloadImage = async () => {
    setShowImageModal(false);
    if (!isDownloading) {
      setIsDownloading(true);
      let result = await _downloadContent(imageUrl);
      if (result) {
        responseMessage = 'Image Downloaded Successfully!';
      } else {
        responseMessage = 'Error while downloading content!';
      }
      setIsDownloading(false);

      if (showImageModal) {
        Alert.alert('', responseMessage);
      } else {
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      }
    }
  };

  /**
   *
   * @PostMessage
   */

  const generateChatObject = (input, media, mediaType, extraItem) => {
    return {
      chatId: groupId,
      authorId: {
        _id: global.userId,
        lastName: global.userDetails.lastName,
        firstName: global.userDetails.firstName,
        batch: global.userDetails.batch,
        profileImg: global.userDetails.profileImg,
      },
      chatName:
        chatType === 0
          ? Helper.capitalize(global.userDetails.firstName)
          : header,
      chatType: chatType,
      messageText: input,
      depth: 0,
      media: {
        mediaUrl: media,
        mediaType: mediaType,
        extraObjects: extraItem,
      },
      parentMessageId: '',
    };
  };

  const handleInputChat = (type, input, mediaType, media, extraItem) => {
    if (inEditMode) {
      let request = generateChatObject(input, media, mediaType, extraItem);
      request.isEdited = true;
      request.messageId = selectedChatObject._id;
      postMessage(request);
    } else if (isReplayEditComment) {
      let request = generateChatObject(input, media, mediaType, extraItem);
      request.depth = 1;
      request.parentMessageId = selectedChatObject._id;
      postMessage(request);
    } else {
      let request = generateChatObject(input, media, mediaType, extraItem);
      postMessage(request);
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

  const resetOldData = () => {
    isBackTap = false;
    selectedFontSize = 1;
    counter = 0;
    authorId = 0;
    isStickerShowing = false;
    blockMsg = '';
    inEditMode = false;
    documentItem = '';
    playAudio = '';
    bottomUnread = 0;
    newMessageList = [];
    imageArray = [];
    isSenderBlocked = false;
    responseMessage = '';
    totalPages = 0;
    currentPage = 1;
    fitlerText = '';
    extraObjects = null;
    messagePosition = -1;
    isLoadingEarlier = false;
    chatType = 0;
    userStatusForChat = 1;
    blockUserStatus = -1;
    timerInterval = null;
    ownTimerInterval = null;
    opponentInfo = null;
    groupId = '';
    lastTypingTime = 0;
    typing = false;
    typingUserName = '';

    filterObject = {
      page: 1,

      groupId: '',
    };
    searchfilterObject = {
      page: 1,
      search: '',
    };
  };

  const resetCount = () => {
    totalPages = 0;
    currentPage = 1;

    filterObject = {};
    filterObject.page = 1;
  };

  const resetSearch = () => {
    setFilterQuery('');
    setFreshSearch(true);
    fitlerText = '';
    resetCount();
    setIsFiltering(false);
    searchfilterObject = {
      page: 1,
      search: '',
    };
    // setIsConnected(true);
    setShowSearch(false);
  };

  const append = (currentMessages = [], message) => {
    if (!Array.isArray(message)) {
      message = [message];
    }
    let newData = message.concat(currentMessages);

    return newData;
  };

  const handleOnScroll = useCallback(event => {
    const {
      nativeEvent: {
        contentOffset: {y: contentOffsetY},
      },
    } = event;
    if (contentOffsetY > scrollToBottomOffset) {
      setShowScrollToBottom(true);
      setHasScrolled(true);
    } else {
      if (contentOffsetY === 0) {
        newMessageList.forEach(element => {
          setMessages(previousMessages => append(previousMessages, element));
        });
      }
      bottomUnread = 0;
      setBottomMessages(0);
      setShowScrollToBottom(false);
      setHasScrolled(true);
    }
  }, []);

  const onPaginate = useCallback(() => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      setPaginationStatus(PaginationStatus.waiting);
      if (isFiltering) {
        searchfilterObject.page = searchfilterObject.page + 1;
        currentPage = currentPage + 1;
        searchMessageContent();
      } else {
        filterObject.page = filterObject.page + 1;
        currentPage = currentPage + 1;
        getOldMessages();
      }
    }
  }, [
    getOldMessages,
    isFiltering,
    isRefreshing,
    paginationStatus,
    searchMessageContent,
  ]);

  const onEndReached = useCallback(
    ({distanceFromEnd}) => {
      if (
        (hasScrolled || distanceFromEnd > 0) &&
        distanceFromEnd <= 100 &&
        !isLoadingEarlier
      ) {
        if (totalPages <= currentPage) {
          setPaginationStatus(PaginationStatus.allLoaded);
          return;
        }
        if (paginationStatus === PaginationStatus.waiting) {
          onPaginate();
        }
      }
    },
    [hasScrolled, onPaginate, paginationStatus],
  );

  const scrollToBottom = () => {
    if (
      chatRef !== undefined &&
      chatRef !== null &&
      chatRef.current !== undefined &&
      chatRef.current !== null
    ) {
      chatRef.current.scrollToOffset({offset: 0, animated: true});
    }
  };

  const keyExtractor = (item, index) => index;

  /**
   *
   * @CommonFunctions
   */

  /**
   *
   * @UIMethods
   *
   */

  const chatOptions = () => {
    let lineStyle = {borderBottomWidth: 2, borderBottomColor: '#ebebe4'};
    let isNormalUser = groupInfo !== null && !groupInfo.isAdmin;
    let ownMessage =
      selectedChatObject !== null &&
      selectedChatObject.authorId._id === global.userId;

    return (
      <OptionsSheet
        ref={chatObjRef}
        minClosingHeight={50}
        height={340}
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
            paddingHorizontal: scale(5),
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
              Reply
            </Text>
          </TouchableOpacity>

          {isNormalUser ? (
            <>
              {ownMessage && (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        chatObjRef.current !== undefined &&
                        chatObjRef.current !== null
                      ) {
                        chatObjRef.current.close();
                      }
                      setTimeout(() => {
                        setShowRemoveMessageAlert(true);
                      }, 220);
                    }}
                    style={[
                      grid.justifyContentCenter,
                      grid.alignItems,
                      g.p15,
                      {
                        borderBottomWidth: 2,
                        borderBottomColor: '#ebebe4',
                        borderTopWidth: 2,
                        borderTopColor: '#ebebe4',
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
                      getMessageInfo(selectedChatObject._id);
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
                </>
              )}
            </>
          ) : (
            <>
              {ownMessage ? (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        chatObjRef.current !== undefined &&
                        chatObjRef.current !== null
                      ) {
                        chatObjRef.current.close();
                      }
                      setTimeout(() => {
                        setShowRemoveMessageAlert(true);
                      }, 220);
                    }}
                    style={[
                      grid.justifyContentCenter,
                      grid.alignItems,
                      g.p15,
                      {
                        borderBottomWidth: 2,
                        borderBottomColor: '#ebebe4',
                        borderTopWidth: 2,
                        borderTopColor: '#ebebe4',
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
                      getMessageInfo(selectedChatObject._id);
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
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        chatObjRef.current !== undefined &&
                        chatObjRef.current !== null
                      ) {
                        chatObjRef.current.close();
                      }
                      setTimeout(
                        () => {
                          setShowHideMessageAlert(true);
                        },
                        Platform.OS === 'ios' ? 200 : 0,
                      );
                    }}
                    style={[
                      grid.justifyContentCenter,
                      grid.alignItems,
                      g.p15,
                      {borderTopWidth: 2, borderTopColor: '#ebebe4'},
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
                      Hide Comment
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
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

  const showReadByUsers = (userTag, isRead) => {
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
                  {item !== null &&
                  item.profileImg !== null &&
                  item.profileImg !== undefined &&
                  item.profileImg !== '' ? (
                    <ProgressImage
                      source={{uri: item.profileImg}}
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
                        {item !== null
                          ? item.firstName.charAt(0)
                          : item.fullName.charAt(0)}
                      </Text>
                    </View>
                  )}
                </View>
                <View>
                  <Text style={[g.colordarkGray, g.fs14, g.FHNR, g.txtLeft]}>
                    {item !== null
                      ? Helper.capitalize(Helper.concatName(item))
                      : item.fullName}
                  </Text>
                  {item !== null && (
                    <View>
                      <View style={[g.mt2, g.mb2]} />
                      <Text
                        style={[g.colordarkGray, g.fs14, g.FHNR, g.txtLeft]}>
                        Batch {item.batch}
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
        {messageInfo !== undefined && messageInfo !== null && (
          <>
            <Text style={[g.colordarkGray, g.fs20, g.FHNB]}>Message Info</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {messageInfo?.read &&
                messageInfo.read !== undefined &&
                messageInfo.read !== null &&
                messageInfo.read.length > 0 && (
                  <>
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
                      {showReadByUsers(messageInfo.read, true)}
                    </View>
                  </>
                )}

              {messageInfo?.sendTo &&
                messageInfo.sendTo !== undefined &&
                messageInfo.sendTo !== null &&
                messageInfo.sendTo.length > 0 && (
                  <>
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
                      {showReadByUsers(messageInfo.sendTo, false)}
                    </View>
                  </>
                )}
            </ScrollView>
          </>
        )}
      </OptionsSheet>
    );
  };

  const renderChatItem = useCallback(
    ({item, index}) => {
      const previousMessage = messages[index + 1] || {};
      const nextMessage = messages[index - 1] || {};
      const customFont = {fontSize: fontSize};

      const messageProps = {
        groupMembers: [],
        messageColor: [],
        isGroup: chatType === 1,
        key: item._id,
        currentMessage: item,
        previousMessage,
        nextMessage,
        customFont,
        position: item.isSystem
          ? 'center'
          : item.authorId._id === global.userId
          ? 'right'
          : 'left',
      };

      return (
        <ChatItem
          {...messageProps}
          playVideo={() => {}}
          onPress={() => {
            if (!item.isHidden) {
              let mediaContent = '';
              let messageType = '';

              if (item.media !== undefined && item.media !== null) {
                mediaContent = item.media.mediaUrl;
                messageType = item.media.mediaType;

                if (messageType === 'IMAGE') {
                  imageArray = [];
                  imageUrl = '';
                  imageUrl = mediaContent;
                  imageArray.push({
                    url: mediaContent,
                  });
                  setShowImageModal(true);
                } else if (messageType === 'AUDIO') {
                  playAudio = mediaContent;
                  extraObjects = item.media.extraObjects;
                  setShowPlayer(!showPlayer);
                } else if (messageType === 'DOCUMENT') {
                  documentItem = mediaContent;
                  setShowDocViewer(true);
                }
              }
            }
          }}
          onLongPress={() => {
            if (!item.isHidden) {
              setSelectedChatObject(item);
              messagePosition = index;
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
              userId: item.authorId._id,
            });
          }}
          onReportPress={() => {
            setSelectedChatObject(item);
            messagePosition = index;
          }}
        />
      );
    },
    [fontSize, navigation, messages, showPlayer],
  );

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
            animRef.current.slideInLeft().then(() => {});
            handleInputChat(1, emoji, 'EMOJI', '', null);
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
          {showSearch ? (
            <View
              style={[grid.rowdir, grid.alignItems, {borderRadius: scale(6)}]}>
              <TouchableOpacity
                style={headerStyle.closeIcon}
                onPress={() => {
                  resetSearch();
                }}>
                <GlobalInclude.BaseIcon
                  containerStyle={headerStyle.searchIcon}
                  iconColor={GlobalInclude.Color.ColorPrimary}
                  iconName={'arrow-back'}
                  iconSize={scale(24)}
                  iconType={IconType[6]}
                />
              </TouchableOpacity>
              <View
                style={[
                  grid.col,
                  grid.rowdir,
                  g.bglightGray,
                  grid.alignItems,
                  {borderRadius: scale(6)},
                ]}>
                <GlobalInclude.BaseIcon
                  containerStyle={headerStyle.searchIcon}
                  iconColor={GlobalInclude.Color.ColorPrimary}
                  iconName={'search'}
                  iconSize={scale(24)}
                  iconType={IconType[8]}
                />
                <View style={[grid.col]}>
                  <TextInput
                    autoCapitalize={'sentences'}
                    underlineColorAndroid="transparent"
                    style={[
                      g.inputWhite,
                      {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      },
                    ]}
                    textAlignVertical={'center'}
                    keyboardType={'default'}
                    value={filterQuery}
                    multiline={false}
                    placeholder="Enter text here"
                    onChangeText={input => {
                      fitlerText = input;
                      setFilterQuery(input);
                      setIsFiltering(input.length > 0);
                    }}
                    placeholderTextColor={'#b2b2b2'}
                  />
                </View>
                {filterQuery.length > 0 ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setFilterMessage([]);
                      setTimeout(() => {
                        searchfilterObject = {
                          page: 1,
                          search: fitlerText,
                        };
                        searchMessageContent();
                      }, 200);
                    }}
                    style={[
                      g.br3,
                      grid.alignItems,
                      grid.justifyContentCenter,
                      g.bgBlue,
                      g.pl5,
                      g.pr5,
                      {height: scale(30)},
                    ]}>
                    <Text style={[g.colorWhite, g.FHNM, g.fs16]}>Search</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[grid.alignItems, grid.justifyContentCenter]}
                    onPress={() => {
                      resetSearch();
                    }}>
                    <GlobalInclude.BaseIcon
                      containerStyle={headerStyle.closeIcon}
                      iconColor={GlobalInclude.Color.ColorPrimary}
                      iconName={'close'}
                      iconSize={scale(24)}
                      iconType={IconType[8]}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fillRow}>
              <View style={GlobalInclude.AppStyle.fillRow}>
                <View style={[grid.alignItems, grid.justifyContentCenter]}>
                  <TouchableOpacity
                    onPress={() => {
                      disconnectUser();
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
                    {chatType === 0 && (
                      <View
                        style={{
                          backgroundColor: isOnline ? 'green' : 'gray',
                          height: scale(10),
                          width: scale(10),
                          borderRadius: scale(100),
                          position: 'absolute',
                          bottom: 0,
                          right: -5,
                        }}
                      />
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      if (chatType === 1) {
                        navigation.navigate('GroupChatInfo', {
                          groupId: groupId,
                          socket: socketRef?.current,
                          userStatusForChat: userStatusForChat,
                        });
                      } else {
                        navigation.navigate('UserProfileInfo', {
                          groupId: groupId,
                          socket: socketRef?.current,
                        });
                      }
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
                    {isTyping ? (
                      <Text
                        style={[
                          g.fs11,
                          g.FHNB,
                          g.colordarkGray,
                          g.txtLeft,
                          g.mt2,
                        ]}
                        numberOfLines={1}>
                        {typingUserName} is typing...
                      </Text>
                    ) : (
                      <>
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
                            {subHeader}
                          </Text>
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View style={grid.rowrow}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setFreshSearch(true);
                    setFilterMessage([]);
                    setShowSearch(true);
                  }}
                  style={{
                    height: scale(24),
                    width: scale(24),
                    marginEnd: scale(7),
                    alignSelf: 'center',
                  }}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(24), width: scale(24)}}
                    iconColor={GlobalInclude.Color.ColorPrimary}
                    iconName={'search'}
                    iconSize={scale(24)}
                    iconType={IconType[5]}
                  />
                </TouchableOpacity>

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
            </View>
          )}
        </View>

        <View style={headerStyle.shadowView} />
      </View>
    );
  };

  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          transform: [{scaleY: -1}],
        }}>
        <View style={[GlobalInclude.AppStyle.fillCenter]}>
          <Text
            style={[
              g.colorBlack,
              g.FHNM,
              g.fs12,
              g.txtCenter,
              grid.alignItems,
              grid.justifyContentCenter,
            ]}>
            No Record Found
          </Text>
        </View>
      </View>
    );
  };

  const emptySearchComponent = useCallback(() => {
    if (freshSearch) {
      return <></>;
    }
    return (
      <View
        style={{
          flex: 1,
          transform: [{scaleY: -1}],
        }}>
        <View style={[GlobalInclude.AppStyle.fillCenter]}>
          <Text
            style={[
              g.colorBlack,
              g.FHNM,
              g.fs12,
              g.txtCenter,
              grid.alignItems,
              grid.justifyContentCenter,
            ]}>
            No Record Found
          </Text>
        </View>
      </View>
    );
  }, [freshSearch]);

  /**
   *
   * UI Methods
   *
   */

  const renderScrollable = useCallback(
    panHandlers => (
      <View style={grid.flex1}>
        {isFirstLoad ? (
          <View style={[GlobalInclude.AppStyle.fillCenter]}>
            <ThreeDotsLoader
              size={scale(12)}
              activeBackground={GlobalInclude.Color.ColorPrimary}
            />
          </View>
        ) : showSearch ? (
          <FlatList
            ref={chatRef}
            inverted={-1}
            data={filterMessage}
            extraData={filterMessage}
            renderItem={renderChatItem}
            keyExtractor={keyExtractor}
            enableEmptySections
            automaticallyAdjustContentInsets={false}
            style={{flex: 1}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: messages.length !== 0 ? undefined : 'center',
              paddingTop: insets.bottom,
            }}
            onScroll={handleOnScroll}
            scrollEventThrottle={100}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
            ListEmptyComponent={emptySearchComponent}
            showsVerticalScrollIndicator={false}
            bounces={false}
            {...panHandlers}
          />
        ) : (
          <FlatList
            ref={chatRef}
            inverted={-1}
            data={messages}
            extraData={messages}
            renderItem={renderChatItem}
            keyExtractor={keyExtractor}
            enableEmptySections
            automaticallyAdjustContentInsets={false}
            style={{flex: 1}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: messages.length !== 0 ? undefined : 'center',
              paddingTop: insets.bottom,
            }}
            scrollEnabled={!isLoadData}
            onScroll={handleOnScroll}
            scrollEventThrottle={100}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
            removeClippedSubviews={Platform.OS !== 'web'}
            showsVerticalScrollIndicator={false}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
            }}
            ListEmptyComponent={emptyComponent}
            bounces={false}
            initialNumToRender={10}
            maxToRenderPerBatch={8}
            updateCellsBatchingPeriod={100}
            initialListSize={10}
            pageSize={1}
            {...panHandlers}
          />
        )}
      </View>
    ),
    [
      insets.bottom,
      emptySearchComponent,
      renderChatItem,
      filterMessage,
      showSearch,
      handleOnScroll,
      onEndReached,
      isFirstLoad,
      isLoadData,
      messages,
    ],
  );

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bggray3]} onLayout={onLayout}>
      {renderHeader()}
      {showProgess(isFirstLoad)}
      {showScrollToBottom ? renderScrollToBottomWrapper() : null}
      {allDone && (
        <KeyboardAccessoryView
          {...{
            renderScrollable,
            style: {
              borderTopLeftRadius: scale(15),
              borderTopRightRadius: scale(15),
            },
          }}>
          {!showSearch && (
            <View>
              {isConnected ? (
                <View style={styles.footer}>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      flexDirection: 'row',
                      flex: 1,
                      borderRadius: isReplayEditComment ? scale(10) : scale(30),
                    }}>
                    <View
                      style={[
                        grid.flex1,
                        isReplayEditComment && [g.pt5, g.pb5],
                      ]}>
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
                                  selectedChatObject.authorId.firstName,
                                )}
                              </Text>
                              <View style={[g.mt2, g.mb2]} />
                              <Text
                                numberOfLines={1}
                                style={[g.fs12, g.FHNR, g.colorBlack]}>
                                {selectedChatObject.media.mediaType === 1
                                  ? selectedChatObject.message
                                  : selectedChatObject.media.mediaType}
                              </Text>
                            </View>
                          </View>
                          <View style={[g.mt2, g.mr5]}>
                            {showImageThumb(
                              selectedChatObject.media.mediaUrl,
                              selectedChatObject.media.mediaType === 'IMAGE'
                                ? 2
                                : selectedChatObject.media.mediaType === 'VIDEO'
                                ? 3
                                : 4,
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
                          textAlignVertical={'center'}
                          multiline={true}
                          placeholder="Enter text here"
                          onChangeText={input => {
                            setInputValue(input);
                            sendTyping();

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
                            containerStyle={{
                              height: scale(20),
                              width: scale(20),
                            }}
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
                          animRef.current.slideInLeft().then(() => {});
                          handleInputChat(1, inputValue, '', '', '');
                        }}>
                        {isSending ? (
                          <ActivityIndicator size={'small'} color={'#fff'} />
                        ) : (
                          <GlobalInclude.BaseIcon
                            containerStyle={{
                              height: scale(20),
                              width: scale(20),
                            }}
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
                      {blockMsg === '' ? 'Connecting...' : blockMsg}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </KeyboardAccessoryView>
      )}

      <UploadMedia
        hideTagInVideo={true}
        refRBSheet={uploadRef}
        media={{image: false, video: false, document: false, audio: false}}
        supportMultiple={true}
        onPickMedia={media => {
          if (media !== undefined && media !== null) {
            media.forEach(item => {
              if (item.type === 1) {
                global.loader_ref.show_loader(1);
                Image.getSize(item.fileName, (iw, ih) => {
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
                  if (media.length > 1) {
                    setTimeout(() => {
                      handleInputChat(
                        2,
                        inputValue,
                        'IMAGE',
                        item.fileName,
                        element,
                      );
                    }, 100);
                  } else {
                    handleInputChat(
                      2,
                      inputValue,
                      'IMAGE',
                      item.fileName,
                      element,
                    );
                  }
                });
              } else if (item.type === 2) {
                global.loader_ref.show_loader(1);
                doScrapping(item.fileName, callback => {
                  global.loader_ref.show_loader(0);
                  handleInputChat(
                    2,
                    inputValue,
                    'VIDEO',
                    item.fileName,
                    callback,
                  );
                });
              } else if (item.type === 3) {
                handleInputChat(
                  2,
                  inputValue,
                  'DOCUMENT',
                  item.fileName,
                  item.requestObject,
                );
              } else if (item.type === 4) {
                handleInputChat(
                  2,
                  inputValue,
                  'AUDIO',
                  item.fileName,
                  item.requestObject,
                );
              }
            });
          }
          uploadRef.current.close();
        }}
      />
      {emojiList()}
      {selectedChatObject !== null && chatOptions()}
      {messageInfo !== null && messageInfoSheet()}
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
          download={true}
          downloadImage={downloadImage}
        />
      )}

      {showErrorMessage && (
        <GlobalInclude.ModalAlert
          status={showErrorMessage}
          header={responseMessage}
          okButton={'Okay'}
          okAction={() => {
            setShowErrorMessage(!showErrorMessage);
          }}
          closeAction={() => {
            setShowErrorMessage(!showErrorMessage);
          }}
        />
      )}

      {showHideMessageAlert && (
        <GlobalInclude.ModalAlert
          status={showHideMessageAlert}
          header={'Hide message'}
          subHeader={'Are you sure you want to hide this message?'}
          okButton={'Yes'}
          cancelButton={'No'}
          okAction={() => {
            setShowHideMessageAlert(false);
            hideMessageFromList();
          }}
          cancelAction={() => {
            setShowHideMessageAlert(false);
          }}
          closeAction={() => {
            setShowHideMessageAlert(false);
          }}
        />
      )}

      {showRemoveMessageAlert && (
        <GlobalInclude.ModalAlert
          status={showRemoveMessageAlert}
          header={'Remove message'}
          subHeader={'Are you sure you want to remove this message?'}
          okButton={'Yes'}
          cancelButton={'No'}
          okAction={() => {
            setShowRemoveMessageAlert(false);
            removeMessageFromList();
          }}
          cancelAction={() => {
            setShowRemoveMessageAlert(false);
          }}
          closeAction={() => {
            setShowRemoveMessageAlert(false);
          }}
        />
      )}

      <Modal
        animationType={'fade'}
        transparent={true}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
        hardwareAccelerated={true}
        visible={showModal}>
        <View style={styles.centeredView}>
          <View style={styles.responseMessage}>
            <Text style={styles.headerText}>{responseMessage}</Text>
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
    padding: scale(10),
    minHeight: scale(40),
    flex: 1,
    borderRadius: scale(30),
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  inputView: {
    fontSize: scale(15),
    fontFamily: 'Lato-Regular',
    justifyContent: 'center',
    textAlignVertical: 'center',
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
    marginBottom: scale(5),
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
  searchIcon: {
    height: scale(24),
    width: scale(24),
    alignSelf: 'center',
  },
  closeIcon: {
    height: scale(24),
    width: scale(24),
    alignSelf: 'center',
    marginRight: scale(5),
  },
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

export default MakeChat;
