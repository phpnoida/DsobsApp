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
import {DummyMsg, UserInfo} from './Dummy';

import {doGetGroupMessages} from '../../Actions/GroupActions';

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

let groupId = '',
  groupInfo = null;

let filterObject = {
  index: 0,
  size: 10,
};
const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};

const StartGroupChat = ({route}) => {
  const appState = useRef(AppState.currentState);
  const uploadRef = useRef();
  const emojiRef = useRef();
  const animRef = useRef();
  const searchRef = useRef();
  const chatObjRef = useRef();
  const chatRef = useRef();
  const messageInfoRef = useRef();

  const navigation = useNavigation();

  const transform =
    Platform.OS === 'android'
      ? [{scaleY: -1}, {perspective: 1280}]
      : [{scaleY: -1}];

  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [nextState, setNextState] = useState(appState.current);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
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
  const [showSearch, setShowSearch] = useState(false);

  /**
   *
   * General
   */

  useEffect(() => {
    if (route.params !== undefined && route.params !== null) {
      groupId = route.params.groupId;
      groupInfo = route.params.groupInfo;

      if (groupInfo && groupInfo !== null && groupInfo !== undefined) {
        setupGroupInfo();
      }

      if (groupId && groupId !== undefined && groupId !== null) {
        resetCount();
        filterObject.groupId = groupId;
        getOldMessages();
      }
    }
    return () => {};
  }, [route.params]);

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
    //{"_id":"6144682e9f295339cf4a69c1","name":"Power Rangers","description":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.","profilePicture":"https://dsobs-new.s3.ap-south-1.amazonaws.com/1631873057_649654_1631873055176.jpg","lastMessage":"last message","totalMember":9,"status":1}
    setHeader(groupInfo.name);
    setHeaderImage({uri: groupInfo.profilePicture});
  };

  const resetCount = () => {
    filterObject = {};
    filterObject.index = 0;
    filterObject.size = 10;
  };

  const getOldMessages = () => {
    doGetGroupMessages(
      filterObject,
      groupId,
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let array = data.data;

              let tmpArray = [];
              let objArray = [];
              let counter = 0;
              let authorId = 0;

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
                        authorId: {
                          _id: '602cb54aa1714c5bd91862e0',
                          name: 'Richa Sharma - 2021',
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

              console.log('====================================');
              console.log('Obj Array', JSON.stringify(objArray));
              console.log('====================================');
              setMessages([...data.data]);
            }
          }
        }
        setIsFirstLoad(false);
      },
      (code, error) => {
        console.log('====================================');
        console.log('code', code, error);
        console.log('====================================');
        setIsFirstLoad(false);
        setMessages([]);
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

  const handleInputChat = (type, input, mediaType, media, extraItem) => {};
  /**
   *
   * @PostMessage
   */

  /**
   *
   * @CommonFunctions
   */

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
        // newMessageList.forEach(element => {
        //   setMessages(previousMessages => append(previousMessages, element));
        // });
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
    const previousMessage = messages[index - 1] || {};
    const nextMessage = messages[index + 1] || {};
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
    const found = UserInfo.some(el => el._id === userId);
    if (found) {
      let info = UserInfo.find(el => el._id === userId);
      return info;
    }
    return null;
  };

  const findDeliveredTo = readBy => {
    let members = JSON.parse(JSON.stringify(UserInfo));

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
          {showSearch ? (
            <View
              style={[grid.rowdir, g.bglightGray, {borderRadius: scale(6)}]}>
              <GlobalInclude.BaseIcon
                containerStyle={{
                  height: scale(24),
                  width: scale(24),
                  alignSelf: 'center',
                }}
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
              </View>
              <TouchableOpacity
                style={[grid.alignItems, grid.justifyContentCenter]}
                onPress={() => setShowSearch(false)}>
                <GlobalInclude.BaseIcon
                  containerStyle={{
                    height: scale(24),
                    width: scale(24),
                    alignSelf: 'center',
                    marginEnd: scale(4),
                  }}
                  iconColor={GlobalInclude.Color.ColorPrimary}
                  iconName={'close'}
                  iconSize={scale(24)}
                  iconType={IconType[8]}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fillRow}>
              <View style={GlobalInclude.AppStyle.fillRow}>
                <View style={[grid.alignItems, grid.justifyContentCenter]}>
                  <TouchableOpacity
                    onPress={() => {}}
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
                        {typingUser.length > 0 ? typingUser : subHeader}
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
            // inverted={-1}
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

export default StartGroupChat;
