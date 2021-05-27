import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Clipboard,
  Platform,
} from 'react-native';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import {IconType} from '../../../helper/Constants';
import ProgressImage from '../../../component/ProgresImage';
import YoutubeView from '../../../component/YoutubeView';
import Helpers from '../../../helper/Helper';
import HeaderBar from '../../../component/HeaderBar';
import {APP_NAME, URL_REGX} from '../../../helper/Constants';
import Description from './Description';
import TheTeam from './TheTeam';
import PitchDocument from './PitchDocument';
import Tags from './Tags';
import Comments from './Comments';
import Location from './Location';
import {
  doFitlerSocialWork,
  updateEvent,
} from '../../../Actions/SocialEventsActions';
import Share, {ShareSheet, Button} from 'react-native-share';
import NumberFormat from 'react-number-format';
import SharingSheet from '../../../component/SharingSheet';
import RNFetchBlob from 'rn-fetch-blob';

const {urlRegex} = URL_REGX;
let filterObject = {};
let shareContent = {};

const EventDetails = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState(null);
  const [showSharingSheet, setShowSharingSheet] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (route.params && route.params !== undefined && route.params !== null) {
      filterObject = route.params.data;

      console.log('====================================');
      console.log('data', filterObject);
      console.log('====================================');
    }
    if (filterObject !== undefined && filterObject !== null) {
      getSocialWork();
    }
    return () => {};
  }, [route]);

  /****
   *
   * API Section
   *
   */

  const getSocialWork = () => {
    setIsLoading(true);
    doFitlerSocialWork(
      filterObject,
      (response) => {
        setIsLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              if (
                data.data !== undefined &&
                data.data !== null &&
                data.data.length > 0
              ) {
                setPageContent(data.data[0]);

                setTimeout(() => {
                  createShareContent(data.data[0]);
                }, 200);
              }
            }
          }
        }
      },
      (code, error) => {
        setPageContent(null);
        console.log('error->', error);
      },
    );
  };

  const manageRSVP = (remove) => {
    if (pageContent !== undefined && pageContent !== null) {
      let attendees = JSON.parse(
        JSON.stringify(
          pageContent.attendees && pageContent.attendees !== null
            ? pageContent.attendees
            : [],
        ),
      );

      if (remove) {
        for (let i = 0; i < attendees.length; i++) {
          const element = attendees[i];
          if (
            element._id &&
            element._id !== undefined &&
            element._id !== null &&
            element._id !== ''
          ) {
            if (element._id === global.userId) {
              attendees.splice(i, 1);
              break;
            }
          }
        }
      } else {
        let addMember = {
          fromSchool: true,
          name:
            global.userDetails.firstName + ' ' + global.userDetails.lastName,
          batch: `Batch: ${global.userDetails.batch}`,
          profilePic: global.userDetails.profileImg,
          _id: global.userDetails._id,
        };

        attendees.push(addMember);
      }
      return attendees;
    }
    return [];
  };

  const updateRSVP = (wantRemove) => {
    let requestObject = {
      attendees: manageRSVP(wantRemove),
    };

    updateEvent(
      requestObject,
      filterObject.id,
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              setTimeout(() => {
                getSocialWork();
              }, 200);
            } else {
            }
          }
        }
      },
      (code, error) => {
        Alert.alert('Something went wrong', error);
      },
    );
  };

  /****
   *
   * API Section
   *
   */

  const createShareContent = (content) => {
    shareContent = {};
    shareContent.title = `Event : ${
      content !== null &&
      content.title &&
      content.title !== undefined &&
      content.title !== null
        ? content.title
        : APP_NAME
    }`;
    shareContent.message = `Hey,\nthought you might find this interesting Check out this event in the ${APP_NAME}.\n ${
      shareContent.title
    }\n${Helpers.showFormatedDate(content.eventTime, true)}`;

    let attachment =
      content.eventVideo !== undefined &&
      content.eventVideo !== null &&
      content.eventVideo !== ''
        ? Helpers.loadYoutubeThumb(Helpers.GetYoutubeId(content.eventVideo))
        : content.eventImage;

    getEventImage(attachment);

    shareContent.attachment = attachment;
    shareContent.subject = shareContent.title;
    shareContent.type = 'image/*';
  };

  const getEventImage = (attachment) => {
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', attachment)
      .then((resp) => {
        return resp.readFile('base64');
      })
      .then((base64Data) => {
        let attachementFile =
          Platform.OS === 'ios'
            ? shareContent.attachment
            : base64Data !== null &&
              base64Data !== undefined &&
              base64Data !== ''
            ? 'data:image/png;base64,' + base64Data
            : '';
        shareContent.url = attachementFile;
      });
  };

  const checkForRSVP = () => {
    if (pageContent !== undefined && pageContent !== null) {
      let attendees = pageContent.attendees;
      for (let i = 0; i < attendees.length; i++) {
        const element = attendees[i];

        if (
          element._id &&
          element._id !== undefined &&
          element._id !== null &&
          element._id !== ''
        ) {
          if (element._id === global.userId) {
            return true;
          }
        }
      }
      return false;
    }
    return false;
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.parentStyle}>
          {isLoading ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator
                size={'small'}
                color={GlobalInclude.Color.ColorPrimary}
              />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              <HeaderBar
                title={
                  pageContent !== null &&
                  pageContent.title &&
                  pageContent.title !== undefined &&
                  pageContent.title !== null
                    ? pageContent.title
                    : APP_NAME
                }
                navigation={navigation}
                customIcon={{
                  containerStyle: {height: scale(30), width: scale(30)},
                  iconColor: GlobalInclude.Color.ColorPrimary,
                  iconName: 'keyboard-backspace',
                  size: scale(30),
                  type: IconType[1],
                }}
                customIconPress={() => {
                  navigation.goBack();
                }}
              />
              {pageContent !== null ? (
                <View style={GlobalInclude.AppStyle.fill}>
                  <View
                    style={[
                      g.bggray3,
                      style.backgroundBorder,
                      g.mt15,
                      g.ml10,
                      g.mr10,
                    ]}>
                    {pageContent.eventVideo !== undefined &&
                    pageContent.eventVideo !== null &&
                    pageContent.eventVideo !== '' &&
                    Helpers.validateRegex(urlRegex, pageContent.eventVideo) ? (
                      <YoutubeView
                        link={pageContent.eventVideo}
                        containerStyle={style.videoContainer}
                        overlayStyle={style.overlayStyle}
                        thumbStyle={style.thumbStyle}
                        playIconstyle={style.playIconstyle}
                        playIconContainer={{
                          height: scale(20),
                          width: scale(20),
                        }}
                        iconSize={scale(20)}
                        showPlay={true}
                      />
                    ) : pageContent.eventImage !== undefined &&
                      pageContent.eventImage !== null &&
                      pageContent.eventImage !== '' &&
                      Helpers.validateRegex(
                        urlRegex,
                        pageContent.eventImage,
                      ) ? (
                      <ProgressImage
                        source={{uri: pageContent.eventImage}}
                        containerStyle={style.imageStyle}
                        imageStyle={style.imageStyle}
                        mode={'cover'}
                      />
                    ) : (
                      <ProgressImage
                        source={GlobalInclude.Assets.DefaultImage}
                        containerStyle={style.imageStyle}
                        imageStyle={style.imageStyle}
                        mode={'cover'}
                      />
                    )}
                  </View>

                  <View style={[g.p15, g.pt10]}>
                    <View style={[grid.rowdir]}>
                      <View style={grid.flex1}>
                        <Text
                          style={[g.fs14, g.FHNR, g.colorGray1]}
                          numberOfLines={2}>
                          {pageContent.category &&
                          pageContent.category !== undefined &&
                          pageContent.category !== null
                            ? pageContent.category
                            : 'N/A'}
                        </Text>
                      </View>
                      {pageContent.financialType === 0 ? (
                        <Text style={[g.FHNR, g.fs14, g.colorGray1]}>
                          {'Free'}
                        </Text>
                      ) : (
                        <Text style={[g.FHNB, g.fs14, g.colorBlue]}>
                          {pageContent.amount}
                        </Text>
                      )}
                    </View>
                    <View style={[grid.rowrow, grid.alignItems, g.mt8]}>
                      <GlobalInclude.BaseIcon
                        containerStyle={{height: scale(17), width: scale(17)}}
                        iconColor={GlobalInclude.Color.ColorPrimary}
                        iconName={'map-marker'}
                        iconSize={scale(17)}
                        iconType={IconType[4]}
                      />
                      <Text
                        style={[
                          g.fs14,
                          g.FHNB,
                          GlobalInclude.AppStyle.transform,
                          g.colorBlue,
                        ]}
                        numberOfLines={1}>
                        {pageContent.city &&
                        pageContent.city !== undefined &&
                        pageContent.city !== null
                          ? pageContent.city
                          : 'N/A'}
                      </Text>
                    </View>
                    <View style={[grid.rowdir, g.mt8]}>
                      <View style={grid.flex1}>
                        <Text style={[g.FHNR, g.fs14, g.colorGray1]}>
                          {Helpers.showFormatedDate(
                            pageContent.eventTime,
                            true,
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <ScrollableTabView
                    underlineColor={'#ffffff'}
                    initialPage={0}
                    tabBarActiveTextColor={GlobalInclude.Color.ColorPrimary}
                    tabBarInactiveTextColor={'#bababa'}
                    tabBarTextStyle={style.tabTextStyle}
                    tabBarUnderlineStyle={style.tabBarUnderlineStyle}
                    onChangeTab={(tab) => {
                      //console.log('tab', tab);
                    }}
                    renderTabBar={() => (
                      <ScrollableTabBar style={style.tabBarStyle} />
                    )}>
                    <TheTeam
                      tabLabel={'Attendees'}
                      content={pageContent}
                      navigation={navigation}
                    />
                    <Description
                      tabLabel={'Description'}
                      content={pageContent}
                    />
                    <Tags tabLabel={'Tags'} content={pageContent} />
                    <PitchDocument tabLabel={'Media'} content={pageContent} />
                    <Location tabLabel={'Location'} content={pageContent} />
                    <Comments
                      tabLabel={'Comments'}
                      eventId={filterObject.id}
                      navigation={navigation}
                    />
                  </ScrollableTabView>
                </View>
              ) : (
                <View style={GlobalInclude.AppStyle.fillCenter}>
                  <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
                    No Record Found
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        {pageContent !== null ? (
          <View style={style.buttonContainer}>
            <View style={grid.flex1}>
              <TouchableOpacity
                activeOpacity={1}
                style={style.button}
                onPress={() => {
                  setShowSharingSheet(true);
                }}>
                <Text style={[g.fs16, g.FHNB, g.colorBlack, grid.textCenter]}>
                  Share
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{marginHorizontal: scale(10)}} />
            <View style={grid.flex1}>
              <TouchableOpacity
                activeOpacity={1}
                style={[style.button, g.bgBlue]}
                onPress={() => {
                  setShowModal(!showModal);
                }}>
                <Text
                  style={[
                    g.fs16,
                    g.FHNB,
                    g.colorWhite,
                    grid.textCenter,
                    g.mr5,
                  ]}>
                  RSVP
                </Text>
                <GlobalInclude.BaseIcon
                  containerStyle={{
                    height: scale(17),
                    width: scale(17),
                  }}
                  iconColor={'#fff'}
                  iconName={checkForRSVP() ? 'check-circle-o' : 'plus-circle'}
                  iconSize={scale(17)}
                  iconType={IconType[4]}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </SafeAreaView>
      <ShareSheet
        visible={showSharingSheet}
        onCancel={() => {
          setShowSharingSheet(false);
        }}>
        <Button
          iconSrc={GlobalInclude.Assets.ShareTwitter}
          onPress={() => {
            setShowSharingSheet(false);
            setTimeout(() => {
              Share.shareSingle(
                Object.assign(shareContent, {
                  social: 'twitter',
                }),
              );
            }, 300);
          }}>
          Twitter
        </Button>
        <Button
          iconSrc={GlobalInclude.Assets.ShareFacebook}
          onPress={() => {
            setShowSharingSheet(false);
            setTimeout(() => {
              Share.shareSingle(
                Object.assign(shareContent, {
                  social: 'facebook',
                }),
              );
            }, 300);
          }}>
          Facebook
        </Button>
        <Button
          iconSrc={GlobalInclude.Assets.ShareWhatsApp}
          onPress={() => {
            setShowSharingSheet(false);
            setTimeout(() => {
              Share.shareSingle(
                Object.assign(shareContent, {
                  social: 'whatsapp',
                }),
              );
            }, 300);
          }}>
          Whatsapp
        </Button>
        <Button
          iconSrc={GlobalInclude.Assets.ShareEmail}
          onPress={() => {
            setShowSharingSheet(false);
            setTimeout(() => {
              Share.shareSingle(
                Object.assign(shareContent, {
                  social: 'email',
                }),
              );
            }, 300);
          }}>
          Email
        </Button>
        <Button
          iconSrc={GlobalInclude.Assets.ShareClipboard}
          onPress={() => {
            setShowSharingSheet(false);
            setTimeout(() => {
              if (typeof shareContent.attachment !== undefined) {
                Clipboard.setString(shareContent.attachment);
                Alert.alert('Link Copied');
              }
            }, 300);
          }}>
          Copy Link
        </Button>
        <Button
          iconSrc={GlobalInclude.Assets.ShareMore}
          onPress={() => {
            setShowSharingSheet(false);
            setTimeout(() => {
              Share.open(shareContent);
            }, 300);
          }}>
          More
        </Button>
      </ShareSheet>

      {showModal && (
        <GlobalInclude.ModalAlert
          status={showModal}
          header={'Would You Like To Attend This Event?'}
          okButton={'Yes'}
          cancelButton={'No'}
          okAction={() => {
            setShowModal(!showModal);

            if (!checkForRSVP()) {
              updateRSVP(false);
            }
          }}
          cancelAction={() => {
            if (checkForRSVP()) {
              updateRSVP(true);
            }
            setShowModal(!showModal);
          }}
          closeAction={() => {
            setShowModal(!showModal);
          }}
        />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  videoContainer: {
    aspectRatio: 16 / 9,
    width: '100%',
    borderRadius: scale(10),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
  },
  overlayStyle: {
    backgroundColor: '#00000066',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: scale(10),
  },
  thumbStyle: {
    borderRadius: scale(10),
    aspectRatio: 16 / 9,
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  playIconstyle: {
    position: 'absolute',
    zIndex: 9,
    bottom: 12,
    left: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {borderBottomWidth: 0, margin: 0},
  tabBarUnderlineStyle: {
    borderBottomColor: 'transparent',
    backgroundColor: 'white',
  },
  imageStyle: {
    aspectRatio: 16 / 9,
    borderRadius: scale(10),
  },
  grayColorText: {color: '#bababa'},
  backgroundBorder: {
    borderRadius: scale(10),
    overflow: 'hidden',
  },
  tabTextStyle: {
    fontSize: scale(15),
    fontFamily: 'Lato-Regular',
    margin: -5,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#f8f8f8',
    borderRadius: scale(8),
    flex: 1,
    height: scale(38),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
});

export default EventDetails;
