import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Clipboard,
  Alert,
  Modal,
  Linking,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {IconType, APP_NAME, URL_REGX} from '../../helper/Constants';
import {
  getVideos,
  getVideoCategories,
  doPostUserVideo,
} from '../../Actions/VideoActions';
import YoutubeView from '../../component/YoutubeView';
import TopHeaderView from '../../component/TopHeaderView';
import Share, {ShareSheet, Button} from 'react-native-share';
import Helper from '../../helper/Helper';
import CommonButton from '../../component/CommonButton';
import RNFetchBlob from 'rn-fetch-blob';
import CategoryFilter from '../../component/CategoryFilterSheet';
let windowWidth = Dimensions.get('window').width;

let selectedVideo = {};
let videoLink = '',
  videoNotes = '';

const {urlRegex} = URL_REGX;

const Video = ({navigation}) => {
  const refRBFilter = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState([]);
  const [showSharingSheet, setShowSharingSheet] = useState(false);
  const [videoCategories, setVideoCategories] = useState([]);
  const [selectedFilter, setselectedFilter] = useState('');
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAddPostLoader, setShowAddPostLoader] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getVideoCategory();
    getVideoData('');
    return () => {};
  }, []);

  /**
   * ************************************************
   * API Section Start
   * ************************************************
   */

  const getVideoData = (searchQuery) => {
    getVideos(
      searchQuery,
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
              let records = data.data;

              records.map((child) => {
                let videos = child.videos;
                var i = videos.length;
                while (i--) {
                  if (
                    videos[i].videoLink === undefined ||
                    videos[i].videoLink === null ||
                    videos[i].videoLink === ''
                  ) {
                    videos.splice(i, 1);
                  }
                }
                child.isShowing = false;
              });

              records.map((child) => {
                let videos = child.videos;

                if (videos.length > 1) {
                  child.mainVideo = videos[0];
                  child.subVideo = videos.slice(1);
                } else {
                  child.mainVideo = videos[0];
                  child.subVideo = [videos[0]];
                }
              });

              records.map((item) => {
                delete item.videos;
              });

              console.log('records', JSON.stringify(records));

              setPageContent([...records]);
            }
          }
        }
      },
      (error) => {
        setPageContent(null);
        setIsLoading(false);
        console.log('error', error);
      },
    );
  };

  const getVideoCategory = () => {
    getVideoCategories(
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let records = data.data;
              let pushArray = [];
              records.map((child) => {
                pushArray.push({label: child, value: child, isSelected: false});
              });

              setVideoCategories([...pushArray]);
            }
          }
        }
      },
      (error) => {
        console.log('error', error);
      },
    );
  };

  const postVideo = () => {
    let userData = global.userDetails;

    let requestData = {
      senderId: userData._id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      batch: userData.batch,
      phone: userData.phone,
      countryCode: userData.countryCode,
      schoolNumber: userData.schoolNumber,
      link: videoLink,
      notes: videoNotes,
    };

    setShowAddPostLoader(true);
    doPostUserVideo(
      requestData,
      (response) => {
        setShowAddPostLoader(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              videoLink = '';
              videoNotes = '';
              setShowAddPostModal(false);
              setTimeout(() => {
                getVideoData('');
              }, 300);
            }
          }
        }
      },
      (error) => {
        setShowAddPostLoader(false);
        setIsLoading(false);
      },
    );
  };

  /**
   * ************************************************
   * API Section End
   * ************************************************
   */

  const shareImage = (title, subject, attachment, videoLink) => {
    let base64image = '';
    RNFetchBlob.fetch('GET', attachment)
      .then((resp) => {
        base64image = resp.data;
        base64image = 'data:image/png;base64,' + base64image;
      })
      .then(() => {
        selectedVideo = {};
        selectedVideo.title = title;
        selectedVideo.message = subject;
        selectedVideo.attachment = videoLink;
        if (
          base64image !== undefined &&
          base64image !== null &&
          base64image !== ''
        ) {
          selectedVideo.type = 'image/*';
          selectedVideo.url = base64image;
        } else {
          selectedVideo.type = 'text/plain';
        }
        setShowSharingSheet(true);
      })
      .catch((err) => {});
  };

  const resetFilter = () => {
    let pushArray = videoCategories;
    pushArray.map((child) => {
      child.isSelected = false;
    });
    setVideoCategories([...pushArray]);
  };

  const selectFilter = (index) => {
    let oldData = videoCategories;

    oldData.map((child) => {
      child.isSelected = false;
    });
    oldData[index].isSelected = true;
    setVideoCategories([...oldData]);
  };

  const updateChild = (index) => {
    let oldData = pageContent;
    oldData[index].isShowing = !oldData[index].isShowing;
    setPageContent([...oldData]);
  };

  const renderChildVideos = (videos, parent) => {
    let videoArray = [];
    videos.map((child, index) => {
      const video = (
        <View key={index.toString()} style={[grid.c2, g.mb10]}>
          <View
            style={(g.bggray2, {borderRadius: scale(15), overflow: 'hidden'})}>
            <YoutubeView
              link={child.videoLink}
              containerStyle={style.childVideoContainer}
              overlayStyle={style.overlayStyle}
              thumbStyle={style.childThumb}
              playIconstyle={style.playIconstyle}
              playIconContainer={{
                height: scale(14),
                width: scale(14),
              }}
              iconSize={scale(14)}
              showPlay={true}
            />
          </View>
          <View>
            <Text
              style={[g.fs10, g.mt5, g.FHNR, g.colorBlack, g.txtLeft]}
              numberOfLines={1}>
              {child.about}
            </Text>
            <View style={[grid.rowdir, grid.alignItems]}>
              <View
                style={[
                  grid.rowdir,
                  grid.justifyContentRight,
                  grid.alignItems,
                  g.mt5,
                ]}>
                <TouchableOpacity
                  style={[grid.rowrow, grid.alignItems, g.ml15]}
                  onPress={() => {
                    selectedVideo = {};
                    let title =
                      parent.title !== undefined && parent.title !== null
                        ? parent.title
                        : `Hey,Check out The ${APP_NAME}`;

                    let subject =
                      child.about.substring(0, 30) +
                      `\nFind video from below link\n${child.videoLink}`;

                    let youtubeId = Helper.GetYoutubeId(child.videoLink);
                    let attachment =
                      youtubeId !== undefined
                        ? Helper.loadYoutubeThumb(youtubeId)
                        : null;

                    shareImage(title, subject, attachment, child.videoLink);
                  }}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(11), width: scale(11)}}
                    iconColor={GlobalInclude.Color.ColorPrimary}
                    iconName={'share-alt'}
                    iconSize={scale(11)}
                    iconType={IconType[4]}
                  />
                  <Text style={[g.fs10, g.ml10]}>SHARE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
      videoArray.push(video);
    });
    return videoArray;
  };

  const renderVideos = () => {
    return pageContent.map((item, index) => {
      return (
        <View key={index.toString()}>
          {item.mainVideo !== undefined && item.mainVideo !== null ? (
            <View
              style={[
                g.bgWhite,
                g.boxShadow,
                g.mb10,
                g.ml2,
                g.mr2,
                g.mt5,
                {borderRadius: scale(15)},
              ]}>
              <View style={[g.bggray3, {borderRadius: scale(15)}]}>
                <YoutubeView
                  link={item.mainVideo.videoLink}
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
              </View>
              <View style={[g.p15]}>
                <Text style={[g.FHNB, g.fs15, g.colorBlack]}>
                  {item.title ? item.title : ''}
                </Text>
                <Text
                  style={[g.fs14, g.mt5, g.FHNR, g.colorBlack]}
                  numberOfLines={item.isShowing ? undefined : 2}>
                  {item.mainVideo.about}
                </Text>
              </View>

              <View style={[g.pl15, g.pr15, g.pb10, {flexDirection: 'row'}]}>
                <TouchableOpacity
                  onPress={() => {
                    updateChild(index);
                  }}
                  style={[
                    style.seeMore,
                    {marginEnd: scale(3), width: scale(80)},
                  ]}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(14), width: scale(14)}}
                    iconColor={GlobalInclude.Color.ColorPrimary}
                    iconName={item.isShowing ? 'caretdown' : 'caretright'}
                    iconSize={scale(14)}
                    iconType={IconType[10]}
                  />
                  <Text style={[g.fs10, g.FHNR, g.colorBlack, g.ml10]}>
                    {item.isShowing ? 'SEE LESS' : 'SEE MORE'}
                  </Text>
                </TouchableOpacity>
                {item.mainVideo.podcast !== undefined &&
                  item.mainVideo.podcast !== null &&
                  item.mainVideo.podcast !== '' && (
                    <TouchableOpacity
                      onPress={() => {
                        Linking.canOpenURL(item.mainVideo.podcast)
                          .then((supported) => {
                            if (!supported) {
                              Alert.alert('Link not supported');
                            } else {
                              return Linking.openURL(item.mainVideo.podcast);
                            }
                          })
                          .catch(() => console.log(''));
                      }}
                      style={[
                        style.seeMore,
                        {
                          marginEnd: scale(3),
                          marginStart: scale(3),
                          width: scale(125),
                        },
                      ]}>
                      <GlobalInclude.BaseIcon
                        containerStyle={{height: scale(14), width: scale(14)}}
                        iconColor={GlobalInclude.Color.ColorPrimary}
                        iconName={'podcast'}
                        iconSize={scale(14)}
                        iconType={IconType[4]}
                      />
                      <Text style={[g.fs10, g.FHNR, g.colorBlack, g.ml10]}>
                        {'HEAR AS PODCAST'}
                      </Text>
                    </TouchableOpacity>
                  )}

                <TouchableOpacity
                  style={[style.seeMore, {width: scale(130)}]}
                  onPress={() => {
                    let title =
                      item.title !== undefined && item.title !== null
                        ? item.title
                        : `Hey,Check out The ${APP_NAME}`;

                    let subject =
                      item.mainVideo.about.substring(0, 500) +
                      `\nFind video from below link\n${item.mainVideo.videoLink}`;

                    let youtubeId = Helper.GetYoutubeId(
                      item.mainVideo.videoLink,
                    );
                    let attachment =
                      youtubeId !== undefined
                        ? Helper.loadYoutubeThumb(youtubeId)
                        : null;

                    shareImage(
                      title,
                      subject,
                      attachment,
                      item.mainVideo.videoLink,
                    );
                  }}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(11), width: scale(11)}}
                    iconColor={GlobalInclude.Color.ColorPrimary}
                    iconName={'share-alt'}
                    iconSize={scale(11)}
                    iconType={IconType[4]}
                  />
                  <Text style={[g.fs10, g.ml10]}>SHARE</Text>
                </TouchableOpacity>
              </View>

              {item.isShowing && (
                <View style={style.showChildVideo}>
                  <View style={[grid.rowdir, grid.flexwrap]}>
                    {renderChildVideos(item.subVideo, item)}
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View />
          )}
        </View>
      );
    });
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <TopHeaderView
        index={7}
        navigation={navigation}
        label={'Post Video'}
        showLabel={true}
        onLabelPress={() => {
          setShowAddPostModal(true);
        }}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <View
          style={[
            GlobalInclude.AppStyle.fill,
            GlobalInclude.AppStyle.contentSpace,
          ]}>
          <View style={[grid.rowdir, g.mb10, g.mt10]}>
            <View style={[g.br3, grid.col, g.mr5]}>
              <View style={[g.inputNew, grid.rowdir]}>
                <GlobalInclude.BaseIcon
                  containerStyle={style.searchIcon}
                  iconColor={'#dddddd'}
                  iconName={'search'}
                  iconSize={scale(20)}
                  iconType={IconType[4]}
                />
                <TextInput
                  underlineColorAndroid="transparent"
                  style={[
                    g.inputNew,
                    g.fs16,
                    grid.col,
                    grid.justifyContentCenter,
                  ]}
                  keyboardType={'default'}
                  placeholder={'Search by(Title)'}
                  onChangeText={(text) => {
                    getVideoData(text);
                  }}
                />
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (refRBFilter.current !== null) {
                  refRBFilter.current.open();
                }
              }}
              style={[
                g.fliterBtnNew,
                grid.alignItems,
                grid.justifyContentCenter,
              ]}>
              <Image
                source={GlobalInclude.Assets.Filter}
                resizeMode="contain"
                style={{width: 16}}
              />
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator
                size={'small'}
                color={GlobalInclude.Color.ColorPrimary}
              />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              {pageContent === null || pageContent.length === 0 ? (
                <View style={GlobalInclude.AppStyle.center}>
                  <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
                    No Record Found
                  </Text>
                </View>
              ) : (
                <View style={GlobalInclude.AppStyle.fill}>
                  <ScrollView
                    style={[GlobalInclude.AppStyle.fill]}
                    scrollEventThrottle={1000}
                    contentContainerStyle={{paddingBottom: scale(70)}}
                    showsVerticalScrollIndicator={false}>
                    {renderVideos()}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        </View>

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
                  Object.assign(selectedVideo, {
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
                  Object.assign(selectedVideo, {
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
                  Object.assign(selectedVideo, {
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
                  Object.assign(selectedVideo, {
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
                if (typeof selectedVideo.attachment !== undefined) {
                  Clipboard.setString(selectedVideo.attachment);
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
                Share.open(selectedVideo);
              }, 300);
            }}>
            More
          </Button>
        </ShareSheet>

        {/* filter sheet */}
        <CategoryFilter
          refRBSheet={refRBFilter}
          title={'Filter Videos By'}
          buttonText={'Apply'}
          dataList={videoCategories}
          onClose={() => {
            resetFilter();
          }}
          onPress={(item, index) => {
            setselectedFilter(item.label);
            selectFilter(index);
          }}
          onSelect={() => {
            refRBFilter.current.close();

            setTimeout(() => {
              getVideoData(selectedFilter);
            }, 100);
          }}
        />
        {/* filter sheet */}

        {/* post video modal */}
        <Modal
          animationType="slide"
          transparent={true}
          hardwareAccelerated={true}
          visible={showAddPostModal}>
          <View style={style.centeredView}>
            <View style={style.modalView}>
              <View style={style.headerView}>
                <View style={style.closeButton}>
                  <TouchableOpacity
                    style={{alignSelf: 'flex-end'}}
                    activeOpacity={0.8}
                    onPress={() => {
                      setShowAddPostModal(false);
                    }}
                    hitSlop={{
                      top: 15,
                      bottom: 15,
                      left: 15,
                      right: 15,
                    }}>
                    <GlobalInclude.BaseIcon
                      containerStyle={{height: scale(26), width: scale(26)}}
                      iconColor={'#808080'}
                      iconName={'close'}
                      iconSize={scale(26)}
                      iconType={IconType[8]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* content */}
              <View style={style.contentContainer}>
                <View style={g.mb15}>
                  <View style={[grid.rowdir, grid.alignItemsTop]}>
                    <Text style={g.labeltext1}>Paste Link To Video</Text>
                    <Text style={g.colorRed}>*</Text>
                  </View>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={[g.inputWhite]}
                    autoCapitalize={'none'}
                    placeholder={'Paste link here'}
                    onChangeText={(value) => {
                      videoLink = value;
                    }}
                  />
                  {errorMessage !== null &&
                    errorMessage.link !== undefined &&
                    errorMessage.link !== '' && (
                      <Text style={[g.errorMsg, g.fs12]}>
                        {errorMessage.link}
                      </Text>
                    )}
                </View>

                <View style={g.mb15}>
                  <View style={[grid.rowdir, grid.alignItemsTop]}>
                    <Text style={g.labeltext1}>Note to {APP_NAME}</Text>
                  </View>
                  <TextInput
                    underlineColorAndroid="transparent"
                    numberOfLines={6}
                    multiline={true}
                    style={[
                      g.inputWhite,
                      {height: 100, textAlignVertical: 'top'},
                    ]}
                    autoCapitalize={'sentences'}
                    placeholder="Enter your text here"
                    onChangeText={(value) => {
                      videoNotes = value;
                    }}
                  />
                </View>

                <View style={style.submitButton}>
                  <CommonButton
                    showLoader={showAddPostLoader}
                    title={'Submit'}
                    onPress={() => {
                      setErrorMessage({});
                      if (videoLink.trim() === '') {
                        setErrorMessage({link: 'This field is required!'});
                      } else if (!Helper.validateRegex(urlRegex, videoLink)) {
                        setErrorMessage({link: 'This link is not valid!'});
                      } else {
                        videoLink =
                          videoLink.includes('youtube') ||
                          videoLink.includes('youtu.be')
                            ? videoLink.replace('watch?v=', 'embed/')
                            : videoLink.includes('vimeo')
                            ? videoLink.replace(
                                'https://vimeo.com/',
                                'https://player.vimeo.com/video/',
                              )
                            : '';

                        postVideo();
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {/* post video modal */}
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  searchIcon: {
    height: scale(20),
    width: scale(20),
    alignSelf: 'center',
    marginEnd: scale(6),
    marginStart: scale(6),
  },
  mainContainer: {
    backgroundColor: '#ffffff',
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
    marginTop: scale(5),
    marginStart: scale(5),
    marginEnd: scale(5),
    marginBottom: scale(15),
  },
  videoContainer: {
    height: scale(180),
    width: '100%',
    borderRadius: scale(15),
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
    borderRadius: scale(15),
  },
  thumbStyle: {
    borderRadius: scale(15),
    height: scale(180),
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  playIconstyle: {
    position: 'absolute',
    zIndex: 9,
    bottom: 15,
    left: 15,
  },
  childVideoContainer: {
    height: scale(84),
    width: '100%',
    borderRadius: scale(15),
    justifyContent: 'center',
  },
  childThumb: {
    height: scale(84),
    width: '100%',
    borderRadius: scale(15),
  },
  centeredView: {
    flex: 1,
    paddingTop: scale(60),
    alignItems: 'center',
    backgroundColor: 'rgba(62,62,62,0.5)',
  },
  modalView: {
    width: windowWidth - 30,
    backgroundColor: 'white',
    borderRadius: scale(6),
    paddingBottom: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerView: {
    padding: scale(5),
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  seeMore: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  showChildVideo: {
    marginBottom: 5,
    marginLeft: 3,
    marginRight: 3,
    padding: 5,
    paddingBottom: 15,
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
  contentContainer: {
    width: '100%',
    paddingStart: scale(10),
    paddingEnd: scale(10),
    paddingTop: scale(5),
    paddingBottom: scale(10),
  },
  closeButton: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
    flex: 1,
  },
});

export default Video;
