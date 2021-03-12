import React, {useState, useEffect} from 'react';
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
import BottomSheetHeader from '../../component/BottomSheetHeader';
import FilterSheet from 'react-native-raw-bottom-sheet';
import CommonButton from '../../component/CommonButton';

let deviceHeight = Dimensions.get('window').height;
let windowWidth = Dimensions.get('window').width;

let selectedVideo = {};
let filterSheet = null;
let videoLink = '',
  videoNotes = '';

const {urlRegex} = URL_REGX;

const Video = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState([]);
  const [showSharingSheet, setShowSharingSheet] = useState(false);
  const [videoCategories, setVideoCategories] = useState([]);
  const [selectedFilter, setselectedFilter] = useState('');
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
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
    console.log('searchQuery',searchQuery);
    setIsLoading(true);
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

              //console.log('records', JSON.stringify(records));

              records.map((child) => {
                child.isShowing = false;
              });
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

    //console.log('userData', JSON.stringify(userData));

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

    let requestPayload = JSON.stringify(requestData);

    console.log('requestPayload', requestPayload);

    setIsLoading(true);
    doPostUserVideo(
      requestData,
      (response) => {
        setIsLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            console.log('data', JSON.stringify(data));
            if (data.status) {
              videoLink = '';
              videoNotes = '';
              setTimeout(() => {
                getVideoData('');
              }, 300);
            }
          }
        }
      },
      (error) => {
        setIsLoading(false);
      },
    );
  };

  /**
   * ************************************************
   * API Section End
   * ************************************************
   */

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
        <View key={index.toString()} style={[grid.c2, g.mb5]}>
          <View style={g.bggray2}>
            <YoutubeView
              link={child.videoLink}
              containerStyle={style.childVideoContainer}
              overlayStyle={style.overlayStyle}
              thumbStyle={style.childThumb}
              playIconstyle={style.playIconstyle}
              playIconContainer={{
                height: scale(18),
                width: scale(18),
              }}
              iconSize={scale(18)}
            />
          </View>
          <View style={[g.p10]}>
            <Text
              style={[g.fs10, g.mt5, g.FHNR, g.colorBlack]}
              numberOfLines={2}>
              {child.about}
            </Text>
            <View style={[grid.rowdir, grid.alignItems, g.mb10]}>
              <View
                style={[
                  grid.rowdir,
                  grid.justifyContentRight,
                  grid.alignItems,
                  g.mt10,
                ]}>
                <TouchableOpacity
                  style={[grid.rowrow, grid.alignItems, g.ml15]}
                  onPress={() => {
                    selectedVideo = {};
                    let title =
                      parent.title !== undefined && parent.title !== null
                        ? parent.title
                        : `Hey,Check out The ${APP_NAME}`;

                    let subject = child.about.substring(0, 30);
                    let youtubeId = Helper.GetYoutubeId(child.videoLink);
                    let attachment =
                      youtubeId !== undefined
                        ? Helper.loadYoutubeThumb(youtubeId)
                        : null;

                    selectedVideo.title = title;
                    selectedVideo.message = subject;
                    selectedVideo.type =
                      attachment !== null ? 'image/*' : 'text/plain';
                    selectedVideo.url =
                      'https://homepages.cae.wisc.edu/~ece533/images/airplane.png';

                    console.log('selectedVideo', selectedVideo);
                    setShowSharingSheet(true);
                  }}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(20), width: scale(20)}}
                    iconColor={'#2b3252'}
                    iconName={'sharealt'}
                    iconSize={scale(20)}
                    iconType={IconType[10]}
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
        <View>
          {item.videos !== undefined && item.videos.length > 0 ? (
            <View style={[g.bgWhite, g.boxShadow, g.mb15, {margin: scale(5)}]}>
              <View style={g.bggray3}>
                <YoutubeView
                  link={item.videos[0].videoLink}
                  containerStyle={style.videoContainer}
                  overlayStyle={style.overlayStyle}
                  thumbStyle={style.thumbStyle}
                  playIconstyle={style.playIconstyle}
                />
              </View>
              <View style={[g.p15]}>
                <Text style={[g.FHNB, g.fs15, g.colorBlack]}>
                  {item.title ? item.title : ''}
                </Text>
                <Text
                  style={[g.fs14, g.mt5, g.FHNR, g.colorBlack]}
                  numberOfLines={2}>
                  {item.videos[0].about}
                </Text>
              </View>
              <View style={[g.pl15, g.pr15, g.pb15]}>
                <TouchableOpacity
                  onPress={() => {
                    updateChild(index);
                  }}
                  style={{
                    flexDirection: 'row',
                    width: scale(80),
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(20), width: scale(20)}}
                    iconColor={'#2b3252'}
                    iconName={item.isShowing ? 'caretdown' : 'caretright'}
                    iconSize={scale(20)}
                    iconType={IconType[10]}
                  />
                  <Text style={[g.fs14, g.FHNR, g.colorBlack, g.ml10]}>
                    {'See More'}
                  </Text>
                </TouchableOpacity>
              </View>
              {item.isShowing && (
                <View
                  style={{
                    marginBottom: 5,
                    marginTop: 10,
                    marginLeft: 5,
                    marginRight: 5,
                    padding: 5,
                    paddingBottom: 15,
                  }}>
                  <View style={[grid.rowdir, grid.flexwrap]}>
                    {renderChildVideos(item.videos, item)}
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
      <SafeAreaView
        style={[
          GlobalInclude.AppStyle.parentStyle,
          {paddingHorizontal: scale(10)},
        ]}>
        <View style={{paddingHorizontal: scale(5)}}>
          <TopHeaderView
            index={11}
            navigation={navigation}
            label={'Post Video'}
            showLabel={true}
            onLabelPress={() => {
              setShowAddPostModal(true);
            }}
          />
        </View>
        <View style={[grid.rowdir, g.mb15, g.mt10, g.ml5, g.mr5]}>
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
                  g.fs18,
                  grid.col,
                  grid.justifyContentCenter,
                ]}
                keyboardType={'default'}
                placeholder={'Search'}
                onChangeText={(text) => {
                  getVideoData(text);
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              filterSheet.open();
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
            <ActivityIndicator size={'small'} color={'#2b3252'} />
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
                  showsVerticalScrollIndicator={false}>
                  {renderVideos()}
                </ScrollView>
              </View>
            )}
          </View>
        )}

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
                if (typeof selectedVideo.url !== undefined) {
                  Clipboard.setString(selectedVideo.url);
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
        <FilterSheet
          ref={(ref) => {
            filterSheet = ref;
          }}
          onClose={() => {
            resetFilter();
          }}
          height={deviceHeight / 2 + 70}
          minClosingHeight={50}
          duration={350}
          closeOnDragDown={true}
          customStyles={{
            container: {
              backgroundColor: '#fff',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingStart: scale(15),
              paddingEnd: scale(15),
              paddingBottom: scale(20),
              paddingTop: scale(10),
            },
          }}>
          <BottomSheetHeader
            titleStyle={[g.txtLeft, g.colorBlue]}
            title={'Filter Videos By'}
            showSearch={false}
            onSeachQuery={(query) => {}}
          />
          <View style={grid.flex1}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {videoCategories.map((item, index) => {
                return (
                  <View key={index}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={[
                        g.mb15,
                        grid.rowdir,
                        grid.alignItems,
                        grid.justifyContent,
                      ]}
                      onPress={() => {
                        setselectedFilter(item.label);
                        selectFilter(index);
                      }}>
                      <Text
                        style={[
                          g.fs12,
                          g.FHNB,
                          g.colorBlack,
                          item.isSelected ? g.colorBlue : g.colorGray5,
                        ]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: scale(150),
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            <CommonButton
              showLoader={false}
              title={'Go'}
              onPress={() => {
                filterSheet.close();
                setTimeout(() => {
                  getVideoData(selectedFilter);
                }, 100);
              }}
            />
          </View>
        </FilterSheet>
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
                <View
                  style={{
                    justifyContent: 'flex-end',
                    alignSelf: 'flex-end',
                    alignContent: 'flex-end',
                    flex: 1,
                  }}>
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
              <View
                style={{
                  width: '100%',
                  paddingStart: scale(10),
                  paddingEnd: scale(10),
                  paddingTop: scale(5),
                  paddingBottom: scale(10),
                }}>
                <View style={g.mb15}>
                  <View style={[grid.rowdir, grid.alignItemsTop]}>
                    <Text style={g.labeltext1}>Paste Link To Video</Text>
                    <Text style={g.colorRed}>*</Text>
                  </View>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={[g.inputWhite]}
                    autoCapitalize="words"
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
                    autoCapitalize="words"
                    placeholder="Enter your text here"
                    onChangeText={(value) => {
                      videoNotes = value;
                    }}
                  />
                </View>

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: scale(150),
                    alignContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <CommonButton
                    showLoader={false}
                    title={'Submit'}
                    onPress={() => {
                      console.log(
                        '!Helper.validateRegex(urlRegex, videoLink)',
                        !Helper.validateRegex(urlRegex, videoLink),
                      );
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
                        setShowAddPostModal(false);
                        setTimeout(() => {
                          postVideo();
                        }, 100);
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
    height: scale(200),
    width: '100%',
    borderRadius: scale(6),
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
  },
  thumbStyle: {
    height: scale(200),
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
    height: scale(100),
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
  },
  childThumb: {
    height: scale(100),
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
});

export default Video;
