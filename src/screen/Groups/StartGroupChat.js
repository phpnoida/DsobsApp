import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
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
  Alert,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {showProgess, generateHeader} from '../../component/Common';
import UploadMedia from '../../component/UploadMedia';
import ProgressImage from '../../component/ProgresImage';
import DocViewer from '../../component/DocViewer';
import AudioPlayer from '../../component/AudioPlayer';
import ImageViewer from '../../component/ImageViewer';
import CommonButton from '../../component/CommonButton';
import {showMediaType, showImageThumb} from '../chat/ChatDelegates';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {IconType} from '../../helper/Constants';
import ThreeDotsLoader from '../../helper/ThreeDotsLoader';
import ChatItem from './GroupChatItem';
import Helper from '../../helper/Helper';
import EmojiSelector from 'react-native-emoji-selector';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {getScrappedData} from '../../Actions/CommonActions';
import {
  doGetGroupMessages,
  doReportMessage,
  doHideMessage,
  doGetReportedMessageInfo,
  doSearchMessage,
} from '../../Actions/GroupActions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import io from 'socket.io-client';
import moment from 'moment';
import _ from 'lodash';

const {height, width} = Dimensions.get('window');

let selectedFontSize = 1,
  isOpenPicker = false,
  isBackTap = false,
  isUserConnected = false,
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

const scrollToBottomOffset = 200;

let groupId = '',
  groupInfo = null;

let filterObject = {
  page: 1,
  limit: 10,
};
let searchfilterObject = {
  page: 1,
  search: '',
  limit: 10,
};

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};

const StartGroupChat = ({route}) => {
  const socketRef = useRef();
  const appState = useRef(AppState.currentState);
  const uploadRef = useRef();
  const emojiRef = useRef();
  const animRef = useRef();
  const chatObjRef = useRef();
  const chatRef = useRef();
  const messageReportRef = useRef();
  const reporetedMessageListRef = useRef();

  const navigation = useNavigation();

  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const [isFiltering, setIsFiltering] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterMessage, setFilterMessage] = useState([]);

  const [fontSize, setFontSize] = useState(scale(14));
  const [scaleSize, setScaleSize] = useState(scale(22));

  const [inputValue, setInputValue] = useState('');
  const [header, setHeader] = useState('');
  const [subHeader, setSubHeader] = useState('');
  const [headerImage, setHeaderImage] = useState(null);
  const [isSending, setIsSending] = useState(false);
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

  const [reportContent, setReportContent] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showHideMessageAlert, setShowHideMessageAlert] = useState(false);
  const [reportedMessageData, setReportedMessageData] = useState([]);

  /**
   *
   * General
   */

  useEffect(() => {
    resetOldData();
    if (route.params !== undefined && route.params !== null) {
      groupId = route.params.groupId;
      groupInfo = route.params.groupInfo;

      if (groupInfo && groupInfo !== null && groupInfo !== undefined) {
        setupGroupInfo();
      }

      if (groupId && groupId !== undefined && groupId !== null) {
        resetCount();
        connectSocket();
      }
    }

    const handleAppStateChange = state => {
      if (isOpenPicker) {
        return;
      }

      if (appState.current.match(/inactive|background/) && state === 'active') {
        console.log('App has come to the foreground!');
      } else if (state === 'background' || state === 'inactive') {
        console.log('App gone to the background!');
        if (!isBackTap) {
          isBackTap = true;
          disconnectUser();
        }
      }
      appState.current = state;
    };

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

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if (backHandler !== undefined && backHandler !== null) {
        backHandler.remove();
      }
      AppState.removeEventListener('change', handleAppStateChange);
      disconnectUser();
    };
  }, [route.params, connectSocket, disconnectUser, navigation]);

  const connectSocket = useCallback(() => {
    console.log('====================================');
    console.log('202-event');
    console.log('====================================');

    socketRef.current = io('https://devapi-dsobs.alumbus.com/', {
      reconnectionAttempts: 2,
    });

    socketRef.current.on('connect', () => {
      if (socketRef.current.connected) {
        // console.log(socketRef.current.id); // "G5p5..."
        // console.log('socketRef.current.connected', socketRef.current.connected);
        filterObject.groupId = groupId;
        setIsConnected(true);
        getOldMessages();
        setTimeout(() => {
          joinGroupRequest();
        }, 100);
      }
    });
    socketRef.current.on('error', attempt => {
      console.log('====================================');
      console.log('errror', attempt);
      console.log('====================================');
    });

    socketRef.current.on('disconnect', () => {
      isUserConnected = false;
      console.log('socket disconnected'); // undefined
    });

    socketRef.current.on('reconnect', attempt => {
      console.log('====================================');
      console.log('attempt', attempt);
      console.log('====================================');
    });
    socketRef.current.on('reconnect_error', attempt => {
      console.log('====================================');
      console.log('reconnect_error', attempt);
      console.log('====================================');
      //socketRef.current.disconnect();
      isUserConnected = false;
    });
    socketRef.current.on('reconnect_attempt', attempt => {
      console.log('====================================');
      console.log('reconnect_attempt', attempt);
      console.log('====================================');
    });

    /********************
     * Specific Events
     */
  }, [joinGroupRequest]);

  useEffect(() => {
    /********************
     * Specific Events
     */

    socketRef.current.on('user-connected', event => {
      // console.log('====================================');
      // console.log('connected', event);
      // console.log('connected', event.status);
      // console.log('====================================');
      isUserConnected = JSON.parse(event.status);
    });

    socketRef.current.on('get-message', event => {
      if (event && event !== null && event !== undefined) {
        let message = event.message;
        let author = message.authorId;
        // console.log('====================================');
        // console.log('get-message', message);
        // console.log('====================================');

        if (author._id !== global.userId) {
          if (isFiltering) {
            newMessageList.push(message);
          } else {
            if (author._id !== global.userId) {
              readMessage(message._id);
              if (showScrollToBottom) {
                bottomUnread = bottomUnread + 1;
                setBottomMessages(bottomUnread);
              }
              setMessages(previousMessages =>
                append(previousMessages, message),
              );
            }
          }
        }
      }
    });

    socketRef.current.on('removed-user', event => {
      if (event && event !== null && event !== undefined) {
        if (
          event.userId &&
          event.userId !== null &&
          event.userId !== undefined &&
          event.userId === global.userId
        ) {
          blockMsg = 'Admin removed you from group!';
          setIsConnected(false);
          setTimeout(() => {
            disconnectUser();
          }, 5000);
        }
      }
    });

    socketRef.current.on('removed-admin', event => {
      if (event && event !== null && event !== undefined) {
      }
    });

    socketRef.current.on('removed-user', event => {
      if (event && event !== null && event !== undefined) {
        if (
          event.userId &&
          event.userId !== null &&
          event.userId !== undefined &&
          event.userId === global.userId
        ) {
          blockMsg = 'Admin removed you from group!';
          setIsConnected(false);
          setTimeout(() => {
            disconnectUser();
          }, 5000);
        }
      }
    });

    socketRef.current.on('made-admin', event => {
      if (event && event !== null && event !== undefined) {
        if (
          event.userId &&
          event.userId !== null &&
          event.userId !== undefined &&
          event.userId === global.userId
        ) {
          Alert.alert('Made admin', 'You are now admin!');
        }
      }
    });

    return () => {};
  }, [showScrollToBottom, disconnectUser, isFiltering]);

  useEffect(() => {
    socketRef.current.on('get-edited-message', event => {
      if (event && event !== null && event !== undefined) {
        let message = event.message;
        let _id = message._id;
        // console.log('====================================');
        // console.log('edited', message);
        // console.log('====================================');

        let oldData = messages;
        var index = oldData.findIndex(x => x._id === _id);

        console.log('====================================');
        console.log('index', index);
        console.log('====================================');

        if (index > -1) {
          oldData[index] = message;
          setMessages([...oldData]);
        }
      }
    });
    return () => {};
  }, [messages]);

  const readMessage = useCallback(messageId => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      let payload = {
        groupId: groupId,
        userId: global.userId,
        messageId: messageId,
      };

      console.log('readMessage', payload);
      socketRef.current.emit('read-message', payload);
    }
  }, []);

  const joinGroupRequest = useCallback(() => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      let payload = {
        groupId: groupId,
        userId: global.userId,
      };

      console.log('payload', payload);
      socketRef.current.emit('subscribe-group', payload);
    }
  }, []);

  const postMessage = object => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      setIsSending(true);
      setInputValue('');
      setEmojiIconWidth(scale(40));
      animRef.current.slideInLeft().then(() => {});
      //Keyboard.dismiss();

      console.log('====================================');
      console.log('sendMessage', JSON.stringify(object));
      console.log('====================================');
      socketRef.current.emit('send-message', object);
      object.createdAt = moment().unix();
      object.isHidden = false;
      object.isReported = false;
      if (isReplayEditComment) {
        object.parentMessageId = selectedChatObject;
      }

      inEditMode = false;

      setIsReplayEditComment(false);
      setSelectedChatObject(null);
      setMessages(previousMessages => append(previousMessages, object));
      setIsSending(false);
    }
  };

  const disconnectUser = useCallback(() => {
    if (
      socketRef !== undefined &&
      socketRef !== null &&
      socketRef.current !== undefined &&
      socketRef.current !== null
    ) {
      let payload = {
        groupId: groupId,
        userId: global.userId,
      };

      console.log('disconnectUser', payload);
      socketRef.current.emit('disconnect', payload);

      setTimeout(() => {
        socketRef.current.disconnect();
        socketRef.current = null;
        resetOldData();
        navigation.goBack();
      }, 200);
    }
  }, [navigation]);

  const resetOldData = () => {
    isBackTap = false;
    selectedFontSize = 1;

    isStickerShowing = false;
    blockMsg = '';
    inEditMode = false;
    documentItem = '';
    playAudio = '';
    bottomUnread = 0;
    newMessageList = [];
    imageArray = [];
  };

  const updateReadMessages = messageIds => {
    if (
      messageIds !== undefined &&
      messageIds !== null &&
      messageIds.length > 0
    ) {
      messageIds.forEach(element => {
        if (element !== undefined && element !== null) {
          readMessage(element);
        }
      });
    }
  };

  /**
   *
   * General
   */

  /**
   *
   * @UseEffects
   */

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

  const setupGroupInfo = () => {
    setHeader(groupInfo.name);
    setHeaderImage({uri: groupInfo.profilePicture});
  };

  const resetCount = () => {
    filterObject = {};
    filterObject.page = 1;
    filterObject.limit = 10;
  };

  const getOldMessages = () => {
    setIsRefreshing(true);
    doGetGroupMessages(
      filterObject,
      groupId,
      response => {
        setIsRefreshing(false);
        manageResponse(response);
        setIsFirstLoad(false);
      },
      (code, error) => {
        setIsRefreshing(false);
        setIsFirstLoad(false);
        setMessages([]);
      },
    );
  };

  const searchMessageContent = () => {
    doSearchMessage(
      groupId,
      searchfilterObject,
      response => {
        setIsRefreshing(false);
        manageResponse(response);
        setIsFirstLoad(false);
      },
      (code, error) => {
        console.log('====================================');
        console.log('code ,error', code, error);
        console.log('====================================');
        setIsRefreshing(false);
        setIsFirstLoad(false);
        setMessages([]);
      },
    );
  };

  const manageResponse = response => {
    try {
      if (response && response !== null) {
        if (
          response.data &&
          response.data !== undefined &&
          response.data !== null
        ) {
          let data = response.data;

          // console.log('====================================');
          // console.log('filterData', data);
          // console.log('====================================');

          if (data.status) {
            let array = data.data;

            let unreadIds = _.map(_.filter(array, {isRead: false}), '_id');

            console.log('====================================');
            console.log('unreadIds', unreadIds);
            console.log('====================================');
            if (unreadIds.length > 0) {
              updateReadMessages(unreadIds);
            }

            let tmpArray = [];
            let objArray = [];
            let counter = 0;
            let authorId = 0;

            totalPages = data.totalPages;

            if (array.length === 0) {
              setPaginationStatus(PaginationStatus.allLoaded);
            } else {
              for (let i = 0; i < array.length; i++) {
                const element = array[i];
                let media = element.media;
                let mediaType = media.mediaType;
                let tmpAuthorId = element.authorId._id;

                if (authorId === 0) {
                  authorId = tmpAuthorId;
                }

                if (authorId === tmpAuthorId) {
                  if (mediaType === 'IMAGE') {
                    counter++;
                    tmpArray.push(element);
                  } else {
                    if (counter > 3) {
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
                        createdAt: 1632213401,
                        _id: '61499999b8ddad5e96cc3936',
                        authorId: {
                          _id: tmpArray[0].authorId._id,
                          name: tmpArray[0].authorId.name,
                        },
                      };
                      objArray.push(request);
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
                  counter = 0;
                  tmpArray = [];
                  objArray.push(element);
                }
              }

              if (tmpArray.length > 0) {
                if (counter > 3) {
                  let request = {
                    media: {
                      mediaUrl: '',
                      mediaType: 'IMAGE_GROUP',
                      metaData: {
                        imageArray: tmpArray,
                      },
                    },
                    isHidden: false,
                    messageText: '',
                    isReported: false,
                    createdAt: 1632213401,
                    _id: '61499999b8ddad5e96cc3936',
                    authorId: {
                      _id: tmpArray[0].authorId._id,
                      name: tmpArray[0].authorId.name,
                    },
                  };
                  objArray.push(request);
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

              //let msgList = objArray.reverse();

              if (isFiltering) {
                if (searchfilterObject.page === 1) {
                  setFilterMessage([...objArray]);
                } else {
                  setFilterMessage([...filterMessage, ...objArray]);
                }
              } else {
                if (filterObject.page === 1) {
                  setGroupMembers(data.users);
                  setMessages([...objArray]);
                } else {
                  setMessages([...messages, ...objArray]);
                }
              }
              setPaginationStatus(PaginationStatus.waiting);
            }
          }
        }
      }
    } catch (error) {
      console.log('error in manage', error);
    }
  };

  const setGroupMembers = members => {
    if (members !== undefined && members !== null) {
      let subTitle = '';
      members.forEach(element => {
        if (element._id !== global.userId) {
          subTitle += Helper.capitalize(element.firstName) + ', ';
        }
      });
      subTitle = subTitle.replace(/,\s*$/, '');
      subTitle = subTitle + ', You';
      setSubHeader(subTitle);
    } else {
      setSubHeader('eemre');
    }
  };

  const sendReport = requestObject => {
    global.loader_ref.show_loader(1);
    doReportMessage(
      groupId,
      selectedChatObject._id,
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

            if (data.status) {
              responseMessage = 'Information was successfully updated.';
              setShowErrorMessage(true);

              let oldData = messages;
              oldData[messagePosition].isReported = true;

              setTimeout(() => {
                setMessages([...oldData]);
                setShowErrorMessage(false);
              }, 2500);
            }
            console.log('====================================');
            console.log('data', JSON.stringify(data));
            console.log('====================================');
          }
        }
      },
      (code, error) => {
        console.log('====================================');
        console.log(code, error);
        console.log('====================================');
        global.loader_ref.show_loader(0);
      },
    );
  };

  const hideMessageFromList = () => {
    global.loader_ref.show_loader(1);
    doHideMessage(
      groupId,
      selectedChatObject._id,
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
              responseMessage = 'Message hide successfully!';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
              }, 2500);
            }
            console.log('====================================');
            console.log('data', JSON.stringify(data));
            console.log('====================================');
          }
        }
      },
      (code, error) => {
        console.log('====================================');
        console.log(code, error);
        console.log('====================================');
        global.loader_ref.show_loader(0);
      },
    );
  };

  const getReportedMessageDetail = messageId => {
    global.loader_ref.show_loader(1);
    doGetReportedMessageInfo(
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
              let reported = data.message;

              setReportedMessageData([...reported]);
              if (
                reporetedMessageListRef.current !== undefined &&
                reporetedMessageListRef.current !== null
              ) {
                reporetedMessageListRef.current.open();
              }
              console.log('====================================');
              console.log('Reporeted', JSON.stringify(reported));
              console.log('====================================');
            }
          }
        }
      },
      (code, error) => {
        console.log('====================================');
        console.log(code, error);
        console.log('====================================');
        global.loader_ref.show_loader(0);
      },
    );
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

  /**
   *
   * @ChatMethodAddObject
   *
   */

  /**
   *
   * @PostMessage
   */

  const generateChatObject = (input, media, mediaType, extraItem) => {
    return {
      groupId: groupId,
      authorId: {
        _id: global.userId,
        name: `${Helper.capitalize(Helper.concatName(global.userDetails))} - ${
          global.userDetails.batch
        }`,
        profileImg: global.userDetails.profileImg,
      },
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
      inEditMode = false;
    } else if (isReplayEditComment) {
      let request = generateChatObject(input, media, mediaType, extraItem);
      request.depth = 1;
      request.parentMessageId = selectedChatObject._id;
      postMessage(request);
    } else {
      let request = generateChatObject(input, media, mediaType, extraItem);
      //postMsg(request);
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

  const append = (currentMessages = [], message) => {
    if (!Array.isArray(message)) {
      message = [message];
    }
    let newData = message.concat(currentMessages);

    return newData;
  };

  const handleOnScroll = event => {
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
      setHasScrolled(false);
    }
  };

  const onPaginate = () => {
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
  };

  const onEndReached = ({distanceFromEnd}) => {
    if ((hasScrolled || distanceFromEnd > 0) && distanceFromEnd <= 100) {
      if (totalPages <= currentPage) {
        setPaginationStatus(PaginationStatus.allLoaded);
        return;
      }
      if (paginationStatus === PaginationStatus.waiting) {
        onPaginate();
      }
    }
  };

  const scrollToBottom = () => {
    if (
      chatRef !== undefined &&
      chatRef !== null &&
      chatRef.current !== undefined &&
      chatRef.current !== null
    ) {
      chatRef.current.scrollToEnd({animating: true});
    }
  };

  const keyExtractor = (item, index) => index;

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
      groupMembers: [],
      messageColor: [],
      isGroup: true,
      key: item._id,
      currentMessage: item,
      previousMessage,
      nextMessage,
      customFont,
      position: item.authorId._id === global.userId ? 'right' : 'left',
    };

    return (
      <ChatItem
        {...messageProps}
        onPress={() => {
          if (!item.delete) {
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
            userId: item.user._id,
          });
        }}
        onReportPress={() => {
          setSelectedChatObject(item);
          messagePosition = index;
          getReportedMessageDetail(item._id);
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

  const showReportedContent = () => {
    let componentArray = [];

    reportedMessageData.forEach((item, index) => {
      let isLast = index + 1 === reportedMessageData.length;
      const component = (
        <View key={index} style={[!isLast && [styles.bottomLine, g.pb7]]}>
          <View style={[grid.rowdir, g.mb5, grid.alignItems]}>
            <View
              style={[
                {
                  height: scale(36),
                  width: scale(36),
                  borderRadius: scale(90),
                },
                grid.alignItems,
                grid.justifyContentCenter,
                g.mr5,
              ]}>
              <View
                style={[
                  {
                    height: scale(36),
                    width: scale(36),
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
                  {item.authorId !== null && item.authorId.name.charAt(0)}
                </Text>
              </View>
            </View>
            <View style={grid.col}>
              <Text style={[g.colordarkGray, g.fs16, g.FHNB, g.txtLeft]}>
                {item.authorId !== null && item.authorId.name}
              </Text>
              <Text style={[g.colordarkGray, g.fs12, g.mt5, g.FHNR, g.txtLeft]}>
                {item.reportTxt}
              </Text>
            </View>
          </View>
        </View>
      );
      componentArray.push(component);
    });
    return componentArray;
  };

  const showReportedInfo = () => {
    return (
      <OptionsSheet
        ref={reporetedMessageListRef}
        minClosingHeight={50}
        height={Platform.OS === 'ios' ? height - 100 : height - 64}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View style={[grid.flex1, g.mb10, g.mt15]}>
          {reportedMessageData !== null && (
            <View>
              <Text style={[g.colordarkGray, g.fs20, g.FHNB]}>
                Message Reported By:
              </Text>
              {reportedMessageData.length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={[g.mt10, g.mb10]}>{showReportedContent()}</View>
                </ScrollView>
              ) : (
                <View style={GlobalInclude.AppStyle.fillCenter}>
                  <Text style={[g.colorBlack, g.FHNM, g.fs12, g.txtCenter]}>
                    Currently No Information is available
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
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
              style={[
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
                    g.mb0,
                    {borderTopLeftRadius: 0, borderBottomLeftRadius: 0},
                  ]}
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
                    setTimeout(() => {
                      searchfilterObject = {
                        page: 1,
                        search: fitlerText,
                        limit: 10,
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
                    fitlerText = '';
                    setIsFiltering(false);
                    searchfilterObject = {
                      page: 1,
                      search: '',
                      limit: 10,
                    };
                    setIsConnected(true);
                    setShowSearch(false);

                    if (newMessageList.length > 0) {
                      newMessageList.forEach(element => {
                        setMessages(previousMessages =>
                          append(previousMessages, element),
                        );
                      });
                      newMessageList = [];
                    }
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
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('GroupInfo', {
                        groupId: groupId,
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
                        {subHeader}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View style={grid.rowrow}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
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

  const reportUserMessage = () => {
    return (
      <OptionsSheet
        ref={messageReportRef}
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
              {generateHeader('Report Text', true)}
              <TextInput
                underlineColorAndroid="transparent"
                numberOfLines={6}
                style={styles.commentInput}
                value={reportContent}
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
                  setReportContent(value);
                }}
              />
            </View>
          </View>
          <CommonButton
            title={'Save'}
            showLoader={false}
            onPress={() => {
              if (
                reportContent.trim() === '' ||
                reportContent.trim().length === 0
              ) {
                Alert.alert('Erorr', 'Report content is required');
              } else {
                let requestObject = {
                  reportTxt: reportContent,
                };
                sendReport(requestObject);
              }
              messageReportRef.current.close();
            }}
          />
        </KeyboardAwareScrollView>
      </OptionsSheet>
    );
  };

  const showUserPostOptions = () => {
    return (
      <View>
        {selectedChatObject?.media?.mediaType === '' && (
          <TouchableOpacity
            onPress={() => {
              if (
                chatObjRef.current !== undefined &&
                chatObjRef.current !== null
              ) {
                chatObjRef.current.close();
              }
              inEditMode = true;
              setInputValue(selectedChatObject?.messageText);
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
        height={
          selectedChatObject !== null &&
          selectedChatObject.authorId._id === global.userId
            ? 340
            : 260
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
              selectedChatObject.authorId._id === global.userId
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
            selectedChatObject.authorId._id !== global.userId && (
              <TouchableOpacity
                onPress={() => {
                  if (
                    chatObjRef.current !== undefined &&
                    chatObjRef.current !== null
                  ) {
                    chatObjRef.current.close();
                  }
                  if (
                    messageReportRef.current !== undefined &&
                    messageReportRef.current !== null
                  ) {
                    messageReportRef.current.open();
                  }
                }}
                style={[
                  grid.justifyContentCenter,
                  grid.alignItems,
                  g.p15,
                  selectedChatObject !== null &&
                  selectedChatObject.authorId._id === global.userId
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
                  Report Comment
                </Text>
              </TouchableOpacity>
            )}

          {selectedChatObject !== null &&
            selectedChatObject.authorId._id !== global.userId &&
            groupInfo !== undefined &&
            groupInfo !== null &&
            groupInfo.isUserAdmin && (
              <TouchableOpacity
                onPress={() => {
                  if (
                    chatObjRef.current !== undefined &&
                    chatObjRef.current !== null
                  ) {
                    chatObjRef.current.close();
                  }
                  setShowHideMessageAlert(true);
                }}
                style={[
                  grid.justifyContentCenter,
                  grid.alignItems,
                  g.p15,
                  selectedChatObject !== null &&
                  selectedChatObject.authorId._id === global.userId
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
                  Hide Comment
                </Text>
              </TouchableOpacity>
            )}

          {selectedChatObject !== null &&
            selectedChatObject.authorId._id === global.userId &&
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
      <View>
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
      <View style={GlobalInclude.AppStyle.fill}>
        {isFirstLoad ? (
          <View style={[GlobalInclude.AppStyle.fillCenter]}>
            <ThreeDotsLoader
              size={scale(12)}
              activeBackground={GlobalInclude.Color.ColorPrimary}
            />
          </View>
        ) : isFiltering ? (
          <FlatList
            ref={chatRef}
            inverted={-1}
            data={filterMessage}
            extraData={filterMessage}
            renderItem={renderChatItem}
            removeClippedSubviews={Platform.OS !== 'web'}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.1}
            maintainVisibleContentPosition={true}
            ListEmptyComponent={emptyComponent}
            scrollEventThrottle={100}
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
            onEndReached={onEndReached}
          />
        ) : (
          <FlatList
            ref={chatRef}
            inverted={-1}
            data={messages}
            extraData={messages}
            renderItem={renderChatItem}
            removeClippedSubviews={Platform.OS !== 'web'}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.1}
            maintainVisibleContentPosition={true}
            ListEmptyComponent={emptyComponent}
            scrollEventThrottle={100}
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
            onEndReached={onEndReached}
          />
        )}

        {!isFiltering && (
          <KeyboardAvoidingView
            behavior={Platform.select({android: 'height', ios: 'padding'})}
            style={{marginBottom: scale(10)}}>
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
                                selectedChatObject.authorId.name,
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
                        multiline={true}
                        placeholder="Enter text here"
                        onChangeText={input => {
                          setInputValue(input);

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
                            isOpenPicker = true;
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
                        handleInputChat(1, inputValue, '', '', '');
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
                    {blockMsg === '' ? 'Connecting...' : blockMsg}
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
          isOpenPicker = false;
          if (media !== undefined && media !== null) {
            console.log(';media', media);
            media.forEach(item => {
              if (item.type === 1) {
                global.loader_ref.show_loader(1);
                Image.getSize(item.fileName, (iw, ih) => {
                  console.log('Height/Width', ih, iw);
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
                    'IMAGE',
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
                    'VIDEO',
                    item.fileName,
                    callback,
                  );
                });
              } else if (item.type === 3) {
                handleInputChat(
                  2,
                  inputValue,
                  'AUDIO',
                  item.fileName,
                  item.requestObject,
                );
              } else if (item.type === 4) {
                handleInputChat(
                  2,
                  inputValue,
                  'DOCUMENT',
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
      {chatOptions()}

      {reportUserMessage()}
      {showReportedInfo()}

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

export default StartGroupChat;
