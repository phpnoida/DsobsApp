import React, {useState, useCallback, useEffect, useRef} from 'react';
import {GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
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
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {renderNoDataComponent, showProgess} from '../../component/Common';
import UploadMedia from '../../component/UploadMedia';
import ProgressImage from '../../component/ProgresImage';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {IconType, APP_NAME} from '../../helper/Constants';
import ChatItem from './ChatItem';
import Helper from '../../helper/Helper';
import moment from 'moment';
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

let selectedFontSize = 1;
let challenger = null,
  opponent = null,
  isGroup = null;
let isChatExist = null;

const usersCollection = firestore().collection('Users');
const chatCollection = firestore().collection('Chats');
const reference = database().ref('Messages');

const ChatScreen = ({route, navigation}) => {
  const uploadRef = useRef();
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
  const [lastSeen, setLastSeen] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [messageThreadId, setMessageThreadId] = useState('');
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
  }, [route]);

  useEffect(() => {
    if (snapshot !== undefined && snapshot !== null) {
      if (
        snapshot.docs !== undefined &&
        snapshot.docs !== null &&
        snapshot.docs.length > 0
      ) {
        let data = snapshot.docs[0].data();
        if (data && data !== null && data !== undefined) {
          console.log('====================================');
          console.log('data', data);
          console.log('====================================');
          setLastSeen(data.lastseen);
          setIsOpponentOnline(data.isOnline);
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
          updateChatMsg(nextMsg);
        } else {
          setMessages((previousMessages) =>
            append(previousMessages, child.val()),
          );
        }
      }
    };

    const onValue = (snapshots) => {
      if (snapshots && snapshots !== undefined) {
        let msgList = snapshots.reverse();
        setMessages([...msgList]);
      }
    };

    const onChildChanged = (childChanged) => {
      console.log('====================================');
      console.log('snapshots-onChildChanged', childChanged);
      console.log('====================================');
    };

    const onInitialLoad = (objectValue) => {
      const snapshotVal = objectValue.val();
      let childrenToProcess = snapshotVal
        ? Object.keys(objectValue.val()).length
        : 0;

      if (childrenToProcess === 0) {
        childAddedHandler = mainRef.on('child_added', onChildAdded, onError);
        onValue([]);
        setIsFirstLoad(false);
      } else {
        //
        const children = [];
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
        childAddedHandler = mainRef.on(
          'child_added',
          onChildAddedWithoutInitialLoad,
          onError,
        );
      }
    };

    mainRef.once('value', onInitialLoad, onError);
    const childChangedHandler = mainRef.on(
      'child_changed',
      onChildChanged,
      onError,
    );

    return () => {
      mainRef.off('child_added', childAddedHandler);
      mainRef.off('child_changed', childChangedHandler);
    };
  }, [messageThreadId, updateChatMsg]);

  const updateAllChilds = useCallback(
    (childs) => {
      let updateArray = [];

      var rv = {};
      for (var i = 0; i < childs.length; ++i) {
        const element = childs[i];
        if (element.user._id !== global.userId) {
          element.isRead = true;
          element.isSent = true;
          updateArray.push(element);
          rv[element._id] = element;
        }
      }
      reference
        .child(messageThreadId)
        .update(rv)
        .then(() => {
          getChatObject(messageThreadId, (response) => {
            if (response && response !== null && response !== undefined) {
              let unreadCount = response.unreadCount;

              unreadCount.forEach((element) => {
                if (element.userId !== global.userId) {
                  element.count = 0;
                }
              });

              const request = {
                unreadCount: unreadCount,
              };
              updateChatObject(messageThreadId, request, () => {});
            }
          });
        });
    },
    [messageThreadId],
  );

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
    (updateObject) => {
      reference
        .child(messageThreadId)
        .child(updateObject._id)
        .update(updateObject)
        .then(() => {
          setMessages((previousMessages) =>
            append(previousMessages, updateObject),
          );
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

  const setHeaderBar = () => {
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
        setLastSeen(opponent.lastseen);
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
  };

  const sendUserTyping = (typing) => {
    const request = {
      isTyping: [
        {userId: global.userId, status: typing},
        {userId: opponent._id, status: false},
      ],
    };
    updateChatObject(messageThreadId, request, () => {});
  };

  const generateSingleChat = async () => {
    if (isChatExist === null) {
      createSingleChat(opponent, (chatId) => {
        if (chatId !== undefined && chatId !== null) {
          isChatExist = chatId;
          setMessageThreadId(chatId);
          addMessageToThread(chatId);
        }
      });
    } else {
      addMessageToThread(messageThreadId);
    }
  };

  const setLastMessage = () => {
    const request = {
      lastMessage: inputValue.trim() === '' ? 'Shared Media' : inputValue,
      lastMessageTime: new Date().getTime(),
    };
    updateChatObject(messageThreadId, request, () => {});
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

  const addMessageToThread = (inputObject) => {
    let request = {
      message: inputValue,
      createdAt: new Date().getTime(),
      messageType: 1,
      media: '',
      user: getUserObject(),
      isRead: isOpponentOnline,
      isSent: true,
      replay: {},
      removedBy: [],
    };
    addObjectToChat(request, inputObject);
  };

  const addObjectToChat = (request, inputObject) => {
    let childRef = reference.child(inputObject);
    childRef.push().then((snap) => {
      const _id = snap.key;
      request._id = _id;
      snap.set(request).then(() => {
        if (!isGroup && !isOpponentOnline) {
          setUnreadCount();
        }
        setLastMessage();
        setIsSending(false);
        setInputValue('');
        sendUserTyping(false);
        Keyboard.dismiss();
      });
    });
  };

  const renderHeader = () => {
    return (
      <View style={headerStyle.headerContainer}>
        <View style={headerStyle.topContainer} />
        <View style={headerStyle.container}>
          <View style={[grid.alignItems, grid.justifyContentCenter]}>
            <TouchableOpacity
              onPress={() => {
                setUserLastSeen(false, new Date().getTime(), () => {
                  navigation.goBack();
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
                  backgroundColor: isOpponentOnline ? 'green' : 'red',
                  height: scale(12),
                  width: scale(12),
                  borderRadius: scale(100),
                  position: 'absolute',
                  bottom: 3,
                  right: -3,
                }}
              />
            </View>
            <View style={[grid.col, grid.justifyContentCenter, g.ml5, g.mr5]}>
              <Text
                style={[g.fs14, g.FHNB, g.colordarkGray, g.txtLeft]}
                numberOfLines={1}>
                {header}
              </Text>
              {isOpponentOnline ? (
                <Text
                  style={[g.fs11, g.FHNB, g.colordarkGray, g.txtLeft, g.mt1]}
                  numberOfLines={1}>
                  {isOpponentTyping ? 'Typing...' : subHeader}
                </Text>
              ) : (
                <Text
                  style={[g.fs11, g.FHNB, g.colordarkGray, g.txtLeft, g.mt1]}
                  numberOfLines={1}>
                  LastSeen: {moment(lastSeen).fromNow()}
                </Text>
              )}
            </View>
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
      key: item._id,
      currentMessage: item,
      previousMessage,
      nextMessage,
      customFont,
      position: item.user._id === global.userId ? 'right' : 'left',
    };

    return <ChatItem {...messageProps} />;
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

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      {renderHeader()}
      {showProgess(isFirstLoad)}
      <View style={[GlobalInclude.AppStyle.fill]}>
        <FlatList
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
        <KeyboardAvoidingView
          behavior={Platform.select({android: 'height', ios: 'padding'})}
          style={{marginBottom: scale(10)}}>
          <View style={styles.footer}>
            <View
              style={{
                backgroundColor: '#eee',
                flexDirection: 'row',
                flex: 1,
                borderRadius: scale(10),
              }}>
              <TextInput
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                style={styles.inputView}
                keyboardType="default"
                value={inputValue}
                placeholder="Enter text here"
                onChangeText={(value) => {
                  setInputValue(value);
                  sendUserTyping(value.length > 0 ? true : false);
                }}
                placeholderTextColor={'#b2b2b2'}
              />
              {inputValue.trim().length === 0 && (
                <TouchableOpacity
                  onPress={() => {
                    if (uploadRef.current !== null) {
                      uploadRef.current.open();
                    }
                  }}
                  style={[styles.commentButton, styles.enableButton]}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(20), width: scale(20)}}
                    iconColor={'#FFF'}
                    iconName={'attach-file'}
                    iconSize={scale(20)}
                    iconType={IconType[0]}
                  />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={() => {
                sendPushNotification();
                setIsSending(true);
                if (isChatExist === null) {
                  generateSingleChat();
                } else {
                  addMessageToThread(messageThreadId);
                }
              }}
              style={[
                g.ml10,
                styles.commentButton,
                inputValue.trim().length > 0
                  ? styles.enableButton
                  : styles.disbleButton,
              ]}>
              {isSending ? (
                <ActivityIndicator size={'small'} color={'#fff'} />
              ) : (
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(20), width: scale(20)}}
                  iconColor={'#FFF'}
                  iconName={'send-o'}
                  iconSize={scale(20)}
                  iconType={IconType[4]}
                />
              )}
            </TouchableOpacity>
          </View>
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

              let request = {
                message: inputValue,
                createdAt: new Date().getTime(),
                messageType: mediaType,
                media: item.fileName,
                user: getUserObject(),
                isRead: false,
                isSent: true,
                replay: {},
                removedBy: [],
              };
              addObjectToChat(request, messageThreadId);
            });
          }

          uploadRef.current.close();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    width: scale(30),
    height: scale(30),
    padding: scale(4),
    alignSelf: 'flex-end',
  },
  inputView: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    minHeight: scale(40),
    flex: 1,
    fontSize: scale(15),
    fontFamily: 'Lato-Regular',
    borderRadius: scale(10),
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
