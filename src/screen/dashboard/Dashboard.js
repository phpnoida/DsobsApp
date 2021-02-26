import React, {useState, useEffect} from 'react';
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
import AsyncStorage from '@react-native-community/async-storage';
import ShowPopNotification from '../../component/ShowPopNotification';
import {getPopNotification} from '../../Actions/CommonActions';

let deviceHeight = Dimensions.get('screen').height;
let deviceWidth = Dimensions.get('screen').width;
let bottomSheet = null;
let bottomSheetProfile = null;
let bottomSheetExtraMenu = null;
let timer = null;
let notificationList = [];
let currentNotificationIndex = 0;

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

const Dashboard = (props) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [showPopNotification, setShowPopNotification] = useState(false);

  useEffect(() => {
    timer = setTimeout(() => {
      setShowWelcome(false);
    }, 7000);

    if (global.isConnected) {
      getPopNotification(
        (response) => {
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.response !== null
            ) {
              let data = response.data;

              console.log('getPopNotification', data);

              notificationList = [
                {
                  __v: 0,
                  _id: '60378499dd690d0ccc7fe49c',
                  body: '',
                  createdAt: '2021-02-25T11:06:01.960Z',
                  date: '19 Jan 1970',
                  eventType: 10,
                  extra: 'extra',
                  imagelink:
                    'https://quorumbucket2.s3.ap-south-1.amazonaws.com/How+To+Q+Images/HTQ-01.jpg',
                  isPopUpShow: false,
                  linkUrl:
                    'https://express-validator.github.io/docs/check-api.html',
                  notification_id: '60378499dd690d0ccc7fe497',
                  notification_type: 'pop',
                  senderId: '5ff46ff5f355165c488012d7',
                  senderName: 'Amit Singh',
                  sent_date: 1614251161,
                  time: '04:24 pm',
                  timestamp: 1614251243,
                  title: '',
                  type: 0,
                  updatedAt: '2021-02-25T11:06:01.960Z',
                  userId: '602a65dca1714c5bd918612e',
                },
              ];
              setShowPopNotification(true);

              // if (data.status) {
              //   if (data.data.length > 0) {
              //     notificationList = data.data;
              //     setShowPopNotification(true);
              //   }
              // }
            }
          }
        },
        (status, error) => {},
      );
    }

    return () => {
      clearInterval(timer);
    };
  }, []);

  const openNotification = (notification) => {
    console.log('notification', notification);
    if (
      notification.linkUrl &&
      notification.linkUrl !== null &&
      notification.linkUrl !== ''
    ) {
      props.navigation.navigate('CommonWebPage', {
        link: notification.linkUrl,
      });
    } else {
      if (
        notification.eventType &&
        notification.eventType !== null &&
        notification.eventType !== ''
      ) {
        switch (parseInt(notification.eventType, 10)) {
          case 1:
            props.navigation.navigate('Magazine');
            break;
          case 2:
            props.navigation.navigate('SearchDirectory');
            break;
          default:
            break;
        }
      }
    }
  };

  const inflateProfileMenu = (item) => {
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
              AsyncStorage.clear().then(() => {
                props.navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Login'}],
                  }),
                );
              });
            } else {
              if (item.item.screenName !== '') {
                bottomSheetProfile.close();
                setTimeout(() => {
                  if (item.item.title === 'My Profile') {
                    props.navigation.navigate(item.item.screenName, {
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

  const inflateExtraMenu = (item) => {
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
                  props.navigation.navigate(item.item.screenName, {
                    link: 'http://m.dsobs.net/',
                  });
                }, 300);
              } else {
                setTimeout(() => {
                  props.navigation.navigate(item.item.screenName);
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
            <TouchableOpacity>
              <View style={styles.headIconContainer}>
                <Image
                  source={GlobalInclude.Assets.Chat}
                  style={styles.headIcon}
                  resizeMode={'contain'}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconSpacer}
              onPress={() => {
                bottomSheetExtraMenu.open();
              }}>
              <View style={styles.headIconContainer}>
                <Image
                  source={GlobalInclude.Assets.DotMenu}
                  style={styles.headIcon}
                  resizeMode={'contain'}
                />
              </View>
            </TouchableOpacity>
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
        blurRadius={15}
        style={styles.blurImage}
        resizeMethod={'auto'}
        resizeMode={'cover'}
      />
    );
  };

  const addBottomSheetProfile = () => {
    return (
      <RBSheetProfile
        ref={(ref) => {
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
        ref={(ref) => {
          bottomSheetExtraMenu = ref;
        }}
        onOpen={() => {
          setIsBottomSheetOpen(true);
        }}
        onClose={() => {
          setIsBottomSheetOpen(false);
        }}
        height={430}
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
        ref={(ref) => {
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
                      props.navigation.navigate('Magazine');
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Magazine}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={[styles.menuIcon, {marginStart: scale(5)}]}
                  />
                  <View style={GlobalInclude.AppStyle.fillCenter}>
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
                      props.navigation.navigate('SearchDirectory');
                    }, 200);
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Alumini}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={[styles.menuIcon, {marginStart: scale(5)}]}
                  />
                  <View style={GlobalInclude.AppStyle.fillCenter}>
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
                    Alert.alert('Coming soon...');
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
                    Alert.alert('Coming soon...');
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
                    Alert.alert('Coming soon...');
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Groups}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
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
                    Alert.alert('Coming soon...');
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
                    source={GlobalInclude.Assets.Gallery}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Melaram Gallery</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* row four */}
              <View style={[grid.rowdir, grid.justifyContentCenter, g.mt8]}>
                <TouchableOpacity
                  style={[styles.whiteButton]}
                  activeOpacity={1}
                  onPress={() => {
                    Alert.alert('Coming soon...');
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Jobs}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={[styles.menuIcon, {marginStart: scale(20)}]}
                  />
                  <View style={GlobalInclude.AppStyle.fillCenter}>
                    <Text style={styles.menuStyle}>Jobs</Text>
                  </View>
                </TouchableOpacity>
                <View style={{margin: scale(5)}} />
                <TouchableOpacity
                  style={styles.whiteButton}
                  activeOpacity={1}
                  onPress={() => {
                    Alert.alert('Coming soon...');
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Offers}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={[styles.menuIcon, {marginStart: scale(20)}]}
                  />
                  <View style={GlobalInclude.AppStyle.fillCenter}>
                    <Text style={styles.menuStyle}>Offers</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* row five */}
              <View style={[grid.rowdir, grid.justifyContentCenter, g.mt8]}>
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    Alert.alert('Coming soon...');
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Social}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Footsteps</Text>
                  </View>
                </TouchableOpacity>
                <View style={{margin: scale(5)}} />
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    bottomSheet.close();
                    setTimeout(() => {
                      props.navigation.navigate('Video');
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
                    Alert.alert('Coming soon...');
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

              {/* row six */}
              <View style={[grid.rowdir, grid.justifyContentCenter, g.mt8]}>
                <TouchableOpacity
                  style={styles.whiteButtonHorizontal}
                  activeOpacity={1}
                  onPress={() => {
                    Alert.alert('Coming soon...');
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
                    source={GlobalInclude.Assets.Magazine}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuText}>
                    <Text style={styles.menuStyle}>Ticker</Text>
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
    <SafeAreaView style={{flex: 1, backgroundColor: '#2b3252'}}>
      <View style={GlobalInclude.AppStyle.fill}>
        <View style={styles.videoContainerAndroid}>
          {showPopNotification && (
            <ShowPopNotification
              imagelink={notificationList[currentNotificationIndex].imagelink}
              onClose={() => {
                if (notificationList.length > 1) {
                  currentNotificationIndex++;
                  setShowPopNotification(false);
                  setTimeout(() => {
                    setShowPopNotification(true);
                  }, 200);
                } else {
                  notificationList = [];
                  currentNotificationIndex = 0;
                  setShowPopNotification(false);
                }
              }}
              onButtonPress={() => {
                setShowPopNotification(false);
                setTimeout(() => {
                  openNotification(notificationList[currentNotificationIndex]);
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
            onError={(err) => {
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
                  paddingBottom: scale(15),
                },
              ]}>
              <TouchableOpacity
                style={styles.whiteButton}
                activeOpacity={1}
                onPress={() => {
                  setTimeout(() => {
                    props.navigation.navigate('Magazine');
                  }, 500);
                }}>
                <Image
                  source={GlobalInclude.Assets.Magazine}
                  resizeMode={'contain'}
                  resizeMethod={'auto'}
                  style={[styles.menuIcon, {marginStart: scale(5)}]}
                />
                <View style={GlobalInclude.AppStyle.fillCenter}>
                  <Text style={styles.menuStyle}>The Rose Bowl</Text>
                </View>
              </TouchableOpacity>
              <View style={{margin: scale(5)}} />
              <TouchableOpacity
                style={styles.whiteButton}
                activeOpacity={1}
                onPress={() => {
                  props.navigation.navigate('SearchDirectory');
                }}>
                <Image
                  source={GlobalInclude.Assets.Alumini}
                  resizeMode={'contain'}
                  resizeMethod={'auto'}
                  style={[styles.menuIcon, {marginStart: scale(5)}]}
                />
                <View style={GlobalInclude.AppStyle.fillCenter}>
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
    width: deviceWidth,
    minHeight: (deviceWidth / 305) * 542,
    aspectRatio: 305 / 542,
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
    marginLeft: scale(8),
    marginRight: scale(8),
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
    color: '#2b3252',
    fontSize: scale(13),
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
    height: scale(36),
    width: scale(36),
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
