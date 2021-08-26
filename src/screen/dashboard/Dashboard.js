import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  BackHandler,
  AppState,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {CommonActions} from '@react-navigation/native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import Video from 'react-native-video';
import GestureRecognizer from 'react-native-swipe-gestures';
import {APP_NAME} from '../../helper/Constants';
import RBSheetMenus from 'react-native-raw-bottom-sheet';
import RBSheetProfile from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShowPopNotification from '../../component/ShowPopNotification';
import {getPopNotification} from '../../Actions/CommonActions';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {clearNotifications} from '../../reducer/NotificationReducer';
import PushNotification from 'react-native-push-notification';

import {IconType} from '../../helper/Constants';
import {
  setUserLastSeen,
  addUser,
  checkUserExist,
} from '../../helper/ChatHelper';
import {useDocumentDataOnce} from 'react-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';

let deviceHeight = Dimensions.get('screen').height;
let deviceWidth = Dimensions.get('screen').width;
let bottomSheet = null;
let bottomSheetProfile = null;
let bottomSheetExtraMenu = null;
let timer = null;
let currentNotificationIndex = 0;
let backHandler = null;
let profileSheetMenu = [
  {
    title: 'My Profile',
    icon: GlobalInclude.Assets.Profile,
    screenName: 'UserProfile',
  },
  {title: 'My Dashboard', icon: GlobalInclude.Assets.Dashboard, screenName: ''},
  {title: 'My Jobs', icon: GlobalInclude.Assets.Jobs, screenName: ''},
  {title: 'Contact Us', icon: GlobalInclude.Assets.ContactUs, screenName: ''},
  {title: 'Logout', icon: GlobalInclude.Assets.Logout, screenName: ''},
];
let bottomSheetMenu = [
  {title: 'App Videos', screenName: ''},
  {title: 'Old Website', screenName: 'CommonWebPage'},
  {title: `${APP_NAME} Memorandum and Rules`, screenName: 'AppRules'},
  {title: `${APP_NAME} Executive Committee`, screenName: 'AppCommittee'},
  {title: `${APP_NAME} Batch Representatives`, screenName: 'AppRepresentives'},
  {title: `${APP_NAME} Regional Chapter Reps`, screenName: 'AppChapters'},
];

const Dashboard = ({props, navigation}) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [showPopNotification, setShowPopNotification] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [userData, loading, error] = useDocumentDataOnce(
    firestore().collection('Users').doc(global.userId),
    {
      snapshotListenOptions: {includeMetadataChanges: true},
    },
  );

  const dispatch = useDispatch();

  const refreshState = useSelector(state => {
    if (state.notification && state.notification !== undefined) {
      let notification = state.notification;
      if (notification.refresh && notification.refresh !== undefined) {
        return true;
      }
    }
    return false;
  }, shallowEqual);

  useEffect(() => {
    timer = setTimeout(() => {
      setShowWelcome(false);
    }, 7000);

    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert('', `Would you like to close the ${APP_NAME} app?`, [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => {
              setUserLastSeen(false, new Date().getTime(), () => {
                BackHandler.exitApp();
              });
            },
          },
        ]);
        return true;
      }
    };

    backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    AppState.addEventListener('change', _handleAppStateChange);

    const unsubscribe = navigation.addListener('focus', () => {
      getPopNotifications();
      /**
       *
       * We check weather we have push notification data or not
       *
       */
      validatePushNotification();

      console.log('global.userDetails.fcmTopic', global.userDetails.fcmTopic);
      //console.log('global.userDetails.fcmTopic', global.accessToken);
    });
    addUser(global.userId, global.userDetails, () => {});

    if (refreshState) {
      dispatch(clearNotifications());
      setTimeout(() => {
        console.log('78');
        validatePushNotification();
      }, 500);
    }
    return () => {
      clearInterval(timer);
      unsubscribe();
      backHandler.remove();
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [
    navigation,
    refreshState,
    _handleAppStateChange,
    dispatch,
    validatePushNotification,
  ]);

  const _handleAppStateChange = useCallback(nextState => {
    console.log('nextState-128', nextState);
    if (nextState === 'active') {
      if (global.isLoggedIn) {
        getPopNotifications();
      }
    }
  }, []);

  const getPopNotifications = () => {
    if (global.isConnected) {
      getPopNotification(
        response => {
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.response !== null
            ) {
              let data = response.data;

              console.log('====================================');
              console.log('PopNotifications', data);
              console.log('====================================');
              if (data.status) {
                if (data.data.length > 0) {
                  setNotificationList([...data.data]);
                  setTimeout(() => {
                    setShowPopNotification(true);
                  }, 100);
                }
              }
            }
          }
        },
        (status, error) => {},
      );
    }
  };

  const validatePushNotification = useCallback(() => {
    if (global.notification !== undefined && global.notification !== null) {
      let data = global.notification.data;
      console.log('validatePushNotification', data);
      let linkUrl = data.linkUrl;
      if (linkUrl && linkUrl !== null && linkUrl !== '') {
        global.notification = null;
        navigation.navigate('CommonWebPage', {
          link: linkUrl,
        });
      } else {
        openSpecificPage(data.eventType, data);
      }
    }
  }, [navigation]);

  const openNotification = notification => {
    if (
      notification.linkUrl &&
      notification.linkUrl !== null &&
      notification.linkUrl !== ''
    ) {
      navigation.navigate('CommonWebPage', {
        link: notification.linkUrl,
      });
    } else {
      let eventType = notification.eventType.toString();
      if (eventType && eventType !== null && eventType !== '') {
        openSpecificPage(eventType, notification);
      }
    }
  };

  const openSpecificPage = (type, data) => {
    global.notification = null;
    switch (parseInt(type, 10)) {
      case 0:
        navigation.navigate('SearchDirectory');
        break;
      case 1:
        navigation.navigate('Magazine');
        break;
      case 2:
        navigation.navigate('Video');
        break;
      case 3:
        navigation.navigate('NewsListing');
        break;
      case 4:
        navigation.navigate('Teachers');
        break;
      case 5:
        navigation.navigate('SocialListing');
        break;
      case 6:
        navigation.navigate('SocialVenture');
        break;
      case 7:
        navigation.navigate('SocialEvents');
        break;
      case 8:
        navigation.navigate('GalleryListing');
        break;
      case 9:
        navigation.navigate('YellowPages');
        break;
      case 201:
        if (
          data.commentId !== undefined &&
          data.commentId !== null &&
          data.commentId !== ''
        ) {
          navigation.navigate('Comments', {
            data: {postId: data.postId, postIndex: -1},
          });
        } else {
          navigation.navigate('MyPreviousPost', {
            userId: data.userId,
            title: data.userName + "'s post",
          });
        }

        break;
      case 1002:
        if (
          data.threadId !== undefined &&
          data.threadId !== null &&
          data.threadId !== ''
        ) {
          setUserLastSeen(true, new Date().getTime(), () => {
            checkUserExist(global.userId, false).then(result => {
              if (result !== undefined && result !== null) {
                let payload = {
                  threadId: data.threadId,
                  challenger: result,
                  isGroup: data.isGroup,
                };
                if (data.isGroup) {
                  console.log('payload', payload);
                  navigation.navigate('GroupChatScreen', payload);
                } else {
                  navigation.navigate('ChatScreen', payload);
                }
              }
            });
          });
        }
        break;
      default:
        break;
    }
  };

  const inflateProfileMenu = item => {
    let index = item.index;
    let styleArray = [];
    styleArray.push(styles.profileMenuContainer);

    if (index !== profileSheetMenu.length - 1) {
      styleArray.push(styles.bottomBorderStyle);
    }
    return (
      <View key={item.index.toString()} style={styleArray}>
        <TouchableOpacity
          style={[
            grid.rowdir,
            grid.alignItems,
            {paddingTop: scale(3), paddingBottom: scale(3)},
          ]}
          onPress={() => {
            if (item.item.title === 'Logout') {
              bottomSheetProfile.close();
              if (
                global.userDetails !== undefined &&
                global.userDetails !== null
              ) {
                let fcmTopic = global.userDetails.fcmTopic;
                AsyncStorage.clear().then(() => {
                  PushNotification.unsubscribeFromTopic(fcmTopic);
                  resetToHome();
                });
              } else {
                AsyncStorage.clear().then(() => {
                  resetToHome();
                });
              }
            } else {
              if (item.item.screenName !== '') {
                bottomSheetProfile.close();
                setTimeout(() => {
                  if (item.item.title === 'My Profile') {
                    navigation.navigate(item.item.screenName, {
                      userId: global.userId,
                    });
                  }
                }, 500);
              } else {
                Alert.alert('Coming soon...');
              }
            }
          }}>
          <Image
            source={item.item.icon}
            resizeMode={'contain'}
            style={{width: scale(22), height: scale(22)}}
            resizeMethod={'auto'}
          />
          <Text style={[g.fs16, g.FHNB, g.colordarkGray, g.ml15]}>
            {item.item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const resetToHome = () => {
    global.userDetails = null;
    global.accessToken = null;
    global.userId = null;
    global.firstName = null;
    global.lastName = null;
    global.isLoggedIn = false;
    global.notification = null;
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  const inflateExtraMenu = item => {
    return (
      <View
        key={item.index.toString()}
        style={[styles.bottomBorderStyle, styles.profileMenuContainer]}>
        <TouchableOpacity
          style={[grid.rowdir, grid.alignItems]}
          onPress={() => {
            bottomSheetExtraMenu.close();
            if (item.item.screenName === '') {
              Alert.alert('Coming soon...');
            } else {
              if (item.item.screenName === 'CommonWebPage') {
                setTimeout(() => {
                  navigation.navigate(item.item.screenName, {
                    link: 'http://m.dsobs.net/',
                  });
                }, 300);
              } else {
                setTimeout(() => {
                  navigation.navigate(item.item.screenName);
                }, 300);
              }
            }
          }}>
          <Text
            style={[
              g.fs16,
              g.FHNB,
              g.colordarkGray,
              {paddingTop: scale(6), paddingBottom: scale(6)},
            ]}>
            {item.item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={{marginTop: scale(10)}}>
        <View style={GlobalInclude.AppStyle.row}>
          <View style={GlobalInclude.AppStyle.fill}>
            <View style={GlobalInclude.AppStyle.appLogo}>
              <Image
                source={GlobalInclude.Assets.AppLogo}
                style={{width: scale(45), height: scale(45)}}
                resizeMode={'contain'}
              />
            </View>
          </View>

          <View style={[GlobalInclude.AppStyle.row]}>
            <TouchableOpacity
              style={styles.headIconContainer}
              onPress={() => {
                navigation.navigate('NotificationListing');
              }}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(20), width: scale(20)}}
                iconColor={'#FFF'}
                iconName={'bell-o'}
                iconSize={scale(20)}
                iconType={IconType[4]}
              />
            </TouchableOpacity>
            <View style={styles.headerIconSpacer} />
            <TouchableOpacity
              style={styles.headIconContainer}
              onPress={() => {
                navigation.navigate('ChatUserList');
                //navigation.navigate('ChatScreen');
              }}>
              <Image
                source={GlobalInclude.Assets.Chat}
                style={styles.headIcon}
                resizeMode={'contain'}
              />

              {userData &&
                userData.isLatestMessages !== undefined &&
                userData.isLatestMessages && (
                  <View
                    style={{
                      position: 'absolute',
                      height: scale(10),
                      width: scale(10),
                      borderRadius: scale(30),
                      backgroundColor: 'green',
                      top: 9,
                      right: 9,
                    }}
                  />
                )}
            </TouchableOpacity>
            <View style={styles.headerIconSpacer} />
            <TouchableOpacity
              style={styles.headIconContainer}
              onPress={() => {
                bottomSheetExtraMenu.open();
              }}>
              <Image
                source={GlobalInclude.Assets.DotMenu}
                style={styles.headIcon}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <View style={styles.headerIconSpacer} />
            <TouchableOpacity
              style={styles.headIconContainer}
              onPress={() => {
                bottomSheetProfile.open();
              }}>
              <Image
                source={GlobalInclude.Assets.User}
                style={styles.headIcon}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* render welcome name  */}
        {showWelcome ? (
          <View style={{padding: scale(15)}}>
            <Text
              style={[
                g.colorWhite,
                g.FHNB,
                g.textShadow,
                g.mb5,
                g.fs32,
                {textTransform: 'capitalize'},
              ]}>
              Hi, {global.firstName}!
            </Text>
            <Text style={[g.colorWhite, g.FHNR, g.fs20, g.textShadow]}>
              Unleash the Power
            </Text>
            <Text style={[g.colorWhite, g.FHNR, g.fs20, g.textShadow]}>
              of the {APP_NAME} Network.
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const renderBlurView = () => {
    if (Platform.OS === 'ios') {
      return (
        <BlurView
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            width: null,
            height: null,
          }}
          blurType="light"
          blurAmount={10}
        />
      );
    }
    return (
      <Image
        source={GlobalInclude.Assets.BlurBackground}
        blurRadius={90}
        style={styles.blurImage}
        resizeMethod={'auto'}
        resizeMode={'cover'}
      />
    );

    // return (
    //   <BlurView
    //     style={{
    //       position: 'absolute',
    //       top: 0,
    //       left: 0,
    //       bottom: 0,
    //       right: 0,
    //     }}
    //     blurType={'regular'}
    //     blurAmount={7}
    //     reducedTransparencyFallbackColor="white"
    //   />
    // );
  };

  const addBottomSheetProfile = () => {
    return (
      <RBSheetProfile
        ref={ref => {
          bottomSheetProfile = ref;
        }}
        onOpen={() => {
          setIsBottomSheetOpen(true);
        }}
        onClose={() => {
          setIsBottomSheetOpen(false);
        }}
        height={390}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingEnd: scale(25),
            paddingStart: scale(25),
            paddingTop: scale(15),
            paddingBottom: scale(15),
          },
        }}>
        <View>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={profileSheetMenu}
            renderItem={inflateProfileMenu}
          />
        </View>
      </RBSheetProfile>
    );
  };

  const addBottomSheetExtraMenu = () => {
    return (
      <RBSheetProfile
        ref={ref => {
          bottomSheetExtraMenu = ref;
        }}
        onOpen={() => {
          setIsBottomSheetOpen(true);
        }}
        onClose={() => {
          setIsBottomSheetOpen(false);
        }}
        height={470}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingEnd: scale(25),
            paddingStart: scale(25),
            paddingTop: scale(15),
            paddingBottom: scale(15),
          },
        }}>
        <View>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={bottomSheetMenu}
            renderItem={inflateExtraMenu}
          />
        </View>
      </RBSheetProfile>
    );
  };

  const addBottomSheetMenu = () => {
    return (
      <RBSheetMenus
        ref={ref => {
          bottomSheet = ref;
        }}
        onOpen={() => {
          setIsBottomSheetOpen(true);
        }}
        onClose={() => {
          setIsBottomSheetOpen(false);
        }}
        height={Platform.OS === 'ios' ? deviceHeight - 100 : deviceHeight - 170}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        keyboardAvoidingViewEnabled={true}
        customStyles={{
          container: {
            backgroundColor: 'transparent',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            height:
              Platform.OS === 'ios' ? deviceHeight - 100 : deviceHeight - 170,
          },
          draggableIcon: {
            backgroundColor: 'transparent',
            height: 0,
            width: 0,
          },
        }}>
        <View style={styles.bottomSheetMenuDesign}>
          {renderBlurView()}
          <View style={[g.p10, grid.rowdir, grid.justifyContentCenter]}>
            <View style={styles.line} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                paddingStart: scale(15),
                paddingEnd: scale(15),
                paddingTop: scale(6),
                paddingBottom: scale(40),
              }}>
              <View style={[grid.rowdir, grid.justifyContentCenter]}>
                <TouchableOpacity
                  style={styles.whiteButton}
                  activeOpacity={1}
                  onPress={() => {
                    bottomSheet.close();
                    setTimeout(() => {
                      navigation.navigate('Magazine');
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Magazine}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={[styles.menuIcon, {marginStart: scale(15)}]}
                  />
                  <View
                    style={[
                      GlobalInclude.AppStyle.fillCenter,
                      {marginStart: -20},
                    ]}>
                    <Text style={styles.menuStyle}>The Rose Bowl</Text>
                  </View>
                </TouchableOpacity>
                <View style={{margin: scale(5)}} />
                <TouchableOpacity
                  style={styles.whiteButton}
                  activeOpacity={1}
                  onPress={() => {
                    bottomSheet.close();
                    setTimeout(() => {
                      navigation.navigate('SearchDirectory');
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Alumini}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={[styles.menuIcon, {marginStart: scale(15)}]}
                  />
                  <View
                    style={[
                      GlobalInclude.AppStyle.fillCenter,
                      {marginStart: -20},
                    ]}>
                    <Text style={styles.menuStyle}>Directory</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* row two */}
              <View style={[grid.rowdir, grid.justifyContentCenter, g.mt8]}>
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    //Alert.alert('Coming soon...');
                    bottomSheet.close();
                    setTimeout(() => {
                      navigation.navigate('NewsListing');
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.News}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Dosco News</Text>
                  </View>
                </TouchableOpacity>
                <View style={{margin: scale(5)}} />
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    bottomSheet.close();
                    setTimeout(() => {
                      navigation.navigate('Video');
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Video}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Videos</Text>
                  </View>
                </TouchableOpacity>
                <View style={{margin: scale(5)}} />
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    bottomSheet.close();
                    setTimeout(() => {
                      navigation.navigate('CommonRoom');
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.CommonRoom}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    tintColor={GlobalInclude.Color.ColorPrimary}
                    style={[
                      styles.menuIcon,
                      {
                        ...Platform.select({
                          ios: {tintColor: GlobalInclude.Color.ColorPrimary},
                        }),
                      },
                    ]}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Common Room</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* row three */}
              <View style={[grid.rowdir, grid.justifyContentCenter, g.mt8]}>
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    bottomSheet.close();
                    setTimeout(() => {
                      navigation.navigate('YellowPages');
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.YellowPage}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    tintColor={GlobalInclude.Color.ColorPrimary}
                    style={[
                      styles.menuIcon,
                      {
                        ...Platform.select({
                          ios: {tintColor: GlobalInclude.Color.ColorPrimary},
                        }),
                      },
                    ]}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Yellow Pages</Text>
                  </View>
                </TouchableOpacity>
                <View style={{margin: scale(5)}} />
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    bottomSheet.close();
                    setTimeout(() => {
                      navigation.navigate('GalleryListing');
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Gallery}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Gallery</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* row five */}
              <View style={[grid.rowdir, grid.justifyContentCenter, g.mt8]}>
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    bottomSheet.close();
                    setTimeout(() => {
                      navigation.navigate('SocialListing');
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Social}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Social Work</Text>
                  </View>
                </TouchableOpacity>
                <View style={{margin: scale(5)}} />
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    bottomSheet.close();
                    setTimeout(() => {
                      navigation.navigate('SocialEvents');
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Events}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Events</Text>
                  </View>
                </TouchableOpacity>
                <View style={{margin: scale(5)}} />
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    bottomSheet.close();
                    setTimeout(() => {
                      navigation.navigate('SocialVenture');
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Venture}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Ventures</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* row five */}
              <View style={[grid.rowdir, grid.justifyContentCenter, g.mt8]}>
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    bottomSheet.close();
                    setTimeout(() => {
                      navigation.navigate('JobListing');
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Jobs}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Jobs</Text>
                  </View>
                </TouchableOpacity>
                <View style={{margin: scale(5)}} />
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    bottomSheet.close();
                    setTimeout(() => {
                      navigation.navigate('CommonWebPage', {
                        link: 'http://store.doonschool.com/',
                      });
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Store}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Store</Text>
                  </View>
                </TouchableOpacity>
                <View style={{margin: scale(5)}} />
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    Alert.alert('Coming soon...');
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Offers}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Offers</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* row six */}
              <View style={[grid.rowdir, grid.justifyContentCenter, g.mt8]}>
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    bottomSheet.close();
                    setTimeout(() => {
                      navigation.navigate('Teachers');
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Teacher}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Masters</Text>
                  </View>
                </TouchableOpacity>
                <View style={{margin: scale(5)}} />
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    Alert.alert('Coming soon...');
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Donation}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Contribution</Text>
                  </View>
                </TouchableOpacity>
                <View style={{margin: scale(5)}} />
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    Alert.alert('Coming soon...');
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Groups}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Groups</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{marginBottom: scale(45)}} />
            </View>
          </ScrollView>
        </View>
      </RBSheetMenus>
    );
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: GlobalInclude.Color.ColorPrimary}}>
      <View style={GlobalInclude.AppStyle.fill}>
        <View style={styles.videoContainerAndroid}>
          {showPopNotification && (
            <ShowPopNotification
              imagelink={notificationList}
              onClose={() => {
                setNotificationList([]);
                currentNotificationIndex = 0;
                setShowPopNotification(false);
              }}
              onButtonPress={selectedItem => {
                setShowPopNotification(false);
                setTimeout(() => {
                  openNotification(selectedItem);
                }, 200);
              }}
            />
          )}

          <Video
            source={require('../../../Assets/Video/homeVideo.mp4')}
            resizeMode={'cover'}
            style={styles.videoContent}
            playInBackground={true}
            playWhenInactive={true}
            controls={false}
            focusable={false}
            repeat={true}
            onError={err => {
              console.log('video errr', err);
            }}
          />
        </View>
        <View
          style={{
            paddingStart: scale(15),
            paddingEnd: scale(15),
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
          }}>
          {/* top header */}
          {renderHeader()}
        </View>
        <GestureRecognizer
          style={styles.bottomContainer}
          onSwipeDown={() => {
            if (isBottomSheetOpen) {
              bottomSheet.close();
            }
          }}
          onSwipeUp={() => {
            if (!isBottomSheetOpen) {
              bottomSheet.open();
            }
          }}>
          <View style={styles.bottomSheetMenu}>
            {renderBlurView()}
            <View style={styles.blurImage} />
            <View style={[g.p10, grid.rowdir, grid.justifyContentCenter]}>
              <TouchableOpacity
                onPress={() => {
                  if (!isBottomSheetOpen) {
                    bottomSheet.open();
                  }
                }}>
                <View style={styles.line} />
              </TouchableOpacity>
            </View>
            <View
              style={[
                grid.rowdir,
                grid.justifyContentCenter,
                {
                  paddingStart: scale(15),
                  paddingEnd: scale(15),
                  paddingTop: scale(6),
                  paddingBottom: scale(25),
                },
              ]}>
              <TouchableOpacity
                style={styles.whiteButton}
                activeOpacity={1}
                onPress={() => {
                  setTimeout(() => {
                    navigation.navigate('Magazine');
                  }, 500);
                }}>
                <Image
                  source={GlobalInclude.Assets.Magazine}
                  resizeMode={'contain'}
                  resizeMethod={'auto'}
                  style={[styles.menuIcon, {marginStart: scale(15)}]}
                />
                <View
                  style={[
                    GlobalInclude.AppStyle.fillCenter,
                    {marginStart: -20},
                  ]}>
                  <Text style={styles.menuStyle}>The Rose Bowl</Text>
                </View>
              </TouchableOpacity>
              <View style={{margin: scale(5)}} />
              <TouchableOpacity
                style={styles.whiteButton}
                activeOpacity={1}
                onPress={() => {
                  navigation.navigate('SearchDirectory');
                }}>
                <Image
                  source={GlobalInclude.Assets.Alumini}
                  resizeMode={'contain'}
                  resizeMethod={'auto'}
                  style={[styles.menuIcon, {marginStart: scale(15)}]}
                />
                <View
                  style={[
                    GlobalInclude.AppStyle.fillCenter,
                    {marginStart: -20},
                  ]}>
                  <Text style={styles.menuStyle}>Directory</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </GestureRecognizer>
        {/* bottom sheet profile */}
        {addBottomSheetProfile()}

        {/* bottom sheet extra menu */}
        {addBottomSheetExtraMenu()}

        {/* bottom sheet menu */}
        {addBottomSheetMenu()}

        {isBottomSheetOpen && renderBlurView()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
  },
  videoContainerAndroid: {
    flex: 1,
  },
  videoContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: deviceWidth,
    minHeight: (deviceWidth / 290) * 542,
    aspectRatio: 300 / 542,
    zIndex: 0,
  },
  headIconContainer: {
    width: scale(38),
    height: scale(38),
    backgroundColor: '#2b325299',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headIcon: {
    width: scale(24),
    height: scale(24),
  },
  headerIconSpacer: {
    marginLeft: scale(4),
    marginRight: scale(4),
  },
  profileMenuContainer: {
    paddingTop: scale(7),
    paddingBottom: scale(7),
    marginBottom: scale(4),
  },
  bottomBorderStyle: {borderBottomColor: '#e5e5e5', borderBottomWidth: 1},
  mainContainer: {
    ...GlobalInclude.AppStyle.parentStyle,
    backgroundColor: 'transparent',
  },
  bottomContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    backgroundColor: 'transparent',
  },
  bottomSheetMenu: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: -6,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  bottomSheetMenuDesign: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  menuStyle: {
    color: GlobalInclude.Color.ColorPrimary,
    fontSize: scale(12.5),
    textAlign: 'center',
    fontFamily: 'Lato-bold',
    flexWrap: 'wrap',
  },
  whiteButton: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    justifyContent: 'center',
    height: scale(85),
    paddingStart: scale(5),
    paddingEnd: scale(5),
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  whiteButtonHorizontal: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: scale(85),
    paddingStart: scale(5),
    paddingEnd: scale(5),
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  whiteButtonNext: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: scale(10),
    width: deviceWidth / 3 - 28,
    height: scale(80),
  },
  blurImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    width: null,
    height: null,
  },
  menuIcon: {
    height: scale(34),
    width: scale(34),
    marginBottom: scale(3),
  },
  menuText: {flexDirection: 'row', flexWrap: 'wrap'},
  line: {
    height: 5,
    width: 36,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dragLine: {
    height: 5,
    width: 36,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: scale(10),
    marginBottom: scale(10),
  },
  bottomSheetMenuParent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    flex: 1,
    paddingBottom: scale(15),
  },
});

export default Dashboard;
