import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Platform,
  ScrollView,
  Modal,
  TextInput,
  Keyboard,
  Alert,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import HeaderBar from '../../component/HeaderBar';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import {renderNoDataComponent, showProgess} from '../../component/Common';
import CommonButton from '../../component/CommonButton';
import {APP_NAME, IconType} from '../../helper/Constants';
import ImageViewer from 'react-native-image-zoom-viewer';
import GalleryImageCard from '../../component/GalleryImageCard';
import Helper from '../../helper/Helper';
import Orientation, {
  OrientationLocker,
  PORTRAIT,
} from 'react-native-orientation-locker';
import grid from '../../theme/grid';
import {
  doFilterGallery,
  doUpdateImageInformation,
  getSingleImageFromAlbum,
} from '../../Actions/GalleryActions';
import {showUser} from '../../component/Common';
import {_downloadContent} from '../../helper/mediaHelper';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {clearUpdateImage} from '../../reducer/NotificationReducer';

const {height, width} = Dimensions.get('window');

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
  fetching: 3,
};
let totalCount = 0;
let filterObject = {
  index: 0,
  size: 10,
};

let pickedIndex = 0;
let pageTitle = '';
let requestType = '';
let currentOriantation = '';
let responseMessage = '';
let reportText = '';
let imageArray = [];
let imageId = '';
let selectedImageLink = '';
let tmpArray = [];
let eventData = {};

const ImageList = ({route, navigation}) => {
  const flatList = useRef();
  const aboutPhotoRef = useRef();
  const showTagUserRef = useRef();
  const optionRef = useRef();
  const dispatch = useDispatch();

  const [title, setTitle] = useState(APP_NAME);
  const [imageData, setImageData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageViewerArray, setImageViewerArray] = useState([]);
  const [imageDetail, setImageDetail] = useState(null);
  const [oriantation, setOriantation] = useState('');

  useEffect(() => {
    imageId = '';
    clearFields();
    resetFilter();
    if (route !== undefined && route !== null) {
      pageTitle = route.params.title;
      filterObject = route.params.filterObject;
      pickedIndex = route.params.index;

      setTitle(pageTitle);
      getGalleryData();
    }

    currentOriantation = Orientation.getInitialOrientation();
    setOriantation(currentOriantation);
    Orientation.addOrientationListener(_orientationDidChange);

    return () => {
      Orientation.removeOrientationListener(_orientationDidChange);
    };
  }, [route]);

  const refreshState = useSelector(state => {
    if (state.notification && state.notification !== undefined) {
      let notification = state.notification;
      if (notification.update && notification.update !== undefined) {
        eventData = notification.eventData;
        return true;
      }
    }
    return false;
  }, shallowEqual);

  useEffect(() => {
    if (refreshState) {
      dispatch(clearUpdateImage());
      setTimeout(() => {
        if (eventData && eventData !== {}) {
          if (eventData.update) {
            pickedIndex = eventData.selectedIndex;
            var tagged = eventData.totalTagged;
            let oldData = imageData;
            if (oldData.length > pickedIndex) {
              oldData[pickedIndex].userTag = tagged;
            }
            setImageData([...oldData]);
          }
          eventData = {};
        }
      }, 200);
    }
    return () => {};
  }, [refreshState]);

  const clearFields = () => {
    pageTitle = '';
    reportText = '';
    imageArray = [];
  };

  const _orientationDidChange = orientation => {
    currentOriantation = orientation;
  };

  /**
   *
   * API Section
   *
   *
   */
  const getGalleryData = () => {
    doFilterGallery(
      filterObject,
      response => {
        if (
          response &&
          response !== null &&
          response.data &&
          response.data !== undefined &&
          response.data !== null
        ) {
          let responseData = response.data;
          if (responseData.status) {
            _processImages(responseData);
          } else {
            setPaginationStatus(PaginationStatus.allLoaded);
            setIsFetching(false);
          }
        } else {
          setPaginationStatus(PaginationStatus.allLoaded);
          setIsFetching(false);
        }
      },
      (error, message) => {
        setIsFetching(false);
        if (error === 404) {
          setPaginationStatus(PaginationStatus.allLoaded);
          if (filterObject.index === 0) {
            setImageData([]);
          }
        }
        console.log('error', message);
      },
    );
  };

  const getSize = (url, element) => {
    return new Promise(function (resolve, reject) {
      Image.getSize(
        url,
        (iw, ih) => {
          let windowWidth = 0,
            windowHeight = 0;
          if (ih > iw) {
            windowWidth = width - 30;
            windowHeight = height - 30;
          } else {
            windowWidth = width;
            windowHeight = height;
          }
          let ratio = Math.min(windowWidth / iw, windowHeight / ih);
          let iWidth = Math.ceil(iw * ratio);
          let iHeight = Math.ceil(ih * ratio);
          element.iw = iWidth;
          element.ih = iHeight;
          resolve(element);
        },
        () => reject(element),
      );
    });
  };

  const _processImages = async arrayItems => {
    let results = arrayItems.data;

    let arrayList = [];
    for (let i = 0; i < results.length; i++) {
      const element = results[i];
      arrayList.push(getSize(element.imagesLink, element));
    }
    Promise.all(arrayList)
      .then(finalList => {
        if (filterObject.index === 0) {
          filterObject.size = 10;
          totalCount = arrayItems.totalCount;
        }
        tmpArray = tmpArray.concat(finalList);
        setImageData([...imageData, ...finalList]);
      })
      .finally(() => {
        setIsFetching(false);
        setPaginationStatus(PaginationStatus.waiting);
        // setTimeout(() => {
        //   if (flatList !== null && flatList.current !== null) {
        //     flatList.current.scrollToIndex({
        //       index: pickedIndex,
        //       animated: false,
        //     });
        //   }
        // }, 1000);
        // //flatList.current.scrollToIndex({animated: true, index: 4});
      });
  };

  const getImageDetail = itemId => {
    global.loader_ref.show_loader(1);
    getSingleImageFromAlbum(
      {id: itemId},
      response => {
        global.loader_ref.show_loader(0);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let responseData = response.data;

            if (responseData.status) {
              if (
                responseData.data !== null &&
                responseData.data !== undefined &&
                responseData.data.length > 0
              ) {
                let itemObject = responseData.data[0];

                itemObject.userTag.sort((a, b) =>
                  a.firstName > b.firstName
                    ? 1
                    : b.firstName > a.firstName
                    ? -1
                    : 0,
                );

                itemObject.userTag.sort((a, b) =>
                  a.batch > b.batch ? 1 : b.batch > a.batch ? -1 : 0,
                );

                setImageDetail(itemObject);

                selectedImageLink = itemObject.imagesLink;

                if (requestType === 'tagging') {
                  if (showTagUserRef.current !== null) {
                    showTagUserRef.current.open();
                  }
                } else if (requestType === 'about') {
                  if (aboutPhotoRef.current !== null) {
                    aboutPhotoRef.current.open();
                  }
                } else if (requestType === 'reportPhoto') {
                  setShowReportModal(true);
                } else if (requestType === 'detail') {
                  imageArray = [];
                  imageArray.push({
                    url: itemObject.imagesLink,
                  });
                  selectedImageLink = itemObject.imagesLink;
                  setImageViewerArray([...imageArray]);

                  setShowImageModal(true);
                }
              }
            }
          }
        }
      },
      error => {
        global.loader_ref.show_loader(0);
        setImageDetail(null);
        console.log('error', error);
      },
    );
  };

  const onSubmitReport = () => {
    if (reportText.trim() === '') {
      setErrorMessage({reportContent: 'This field is required'});
    } else {
      let reportedData = [];
      reportedData = imageDetail.reported;
      let user = global.userDetails;
      reportedData.push({
        id: global.userId,
        note: reportText,
        firstName: user.firstName,
        lastName: user.lastName,
        batch: user.batch,
        schoolNumber: user.schoolNumber,
        house: user.house,
        section: user.section,
        phone: user.phone,
        countryCode: user.countryCode,
      });

      let requestData = {
        imageKey: imageDetail.imageKey,
        reported: reportedData,
        isReported: true,
      };
      setIsReporting(true);
      doUpdateImageInformation(
        imageDetail._id,
        requestData,
        response => {
          setIsReporting(false);
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.data !== null
            ) {
              let responseData = response.data;
              if (responseData.status) {
                responseMessage = 'Image reported successfully!';
              } else {
                responseMessage = 'Error while reporting!';
              }
              setShowReportModal(false);

              if (showImageModal) {
                Alert.alert('', responseMessage);
              } else {
                setShowModal(true);
                setTimeout(() => {
                  setShowModal(false);
                }, 2000);
              }
            }
          }
        },
        error => {
          responseMessage = 'Error while reporting!';
          setShowModal(true);
          setIsReporting(false);
          setTimeout(() => {
            setShowModal(false);
          }, 2000);
        },
      );
    }
  };

  /**
   *
   * API Section
   *
   *
   */

  /**
   *
   * Pagination
   *
   */
  const callNextBatch = () => {
    filterObject.index = filterObject.index + 1;
    getGalleryData();
  };
  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      console.log('onPaginate()');
      setPaginationStatus(PaginationStatus.fetching);
      callNextBatch();
    }
  };

  const onEndReached = () => {
    console.log('onEndReached()');
    if (imageData.length === totalCount || imageData.length < 10) {
      setPaginationStatus(PaginationStatus.allLoaded);
      return;
    }
    if (paginationStatus === PaginationStatus.waiting) {
      onPaginate();
    }
  };

  const handleRefresh = () => {
    resetFilter();
    setIsRefreshing(false);
    getGalleryData();
  };

  const resetFilter = () => {
    totalCount = 0;
    filterObject.index = 0;
    filterObject.size = 10;
  };

  const downloadImage = async () => {
    if (!isDownloading) {
      setIsDownloading(true);
      let result = await _downloadContent(selectedImageLink);
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

  const showTaggedUsers = userTag => {
    let componentArray = [];
    for (let i = 0; i < userTag.length; i++) {
      let item = userTag[i];
      const component = (
        <View key={i}>
          {showUser(
            item.profileImg,
            Helper.concatName(item),
            `Batch ${item.batch}`,
            null,
            () => {
              showTagUserRef.current.close();

              setTimeout(() => {
                navigation.navigate('UserProfile', {
                  userId: item._id,
                });
              }, 350);
            },
          )}
        </View>
      );

      componentArray.push(component);
    }
    return componentArray;
  };

  const generateSliderOptions = (type, icon, onPress) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[style.buttonCircle, {marginHorizontal: scale(8)}]}>
        <GlobalInclude.BaseIcon
          containerStyle={{height: scale(22), width: scale(22)}}
          iconColor={'#FFF'}
          iconName={icon}
          iconSize={scale(22)}
          iconType={IconType[type]}
        />
      </TouchableOpacity>
    );
  };

  const showTagedUser = () => {
    return (
      <OptionsSheet
        ref={showTagUserRef}
        minClosingHeight={50}
        height={Platform.OS === 'ios' ? height - 100 : height - 64}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingStart: scale(15),
            paddingEnd: scale(15),
            paddingTop: scale(10),
          },
        }}>
        <View style={grid.flex1}>
          {imageDetail !== null &&
          imageDetail.userTag !== undefined &&
          imageDetail.userTag !== null &&
          imageDetail.userTag.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[grid.row, g.mt10, grid.flexwrap]}>
                {showTaggedUsers(imageDetail.userTag)}
              </View>
            </ScrollView>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              <View style={GlobalInclude.AppStyle.fillCenter}>
                <Text style={[g.colorBlack, g.FHNM, g.fs12, g.txtCenter]}>
                  Currently No People Tagged in This Photo
                </Text>
                <Text
                  style={[g.colorBlack, g.FHNM, g.fs12, g.txtCenter, g.mt5]}>
                  Please click on the Tag People Button below
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: scale(150),
                  paddingTop: scale(10),
                  paddingBottom: scale(10),
                  alignContent: 'center',
                  alignSelf: 'center',
                  marginBottom: scale(20),
                }}>
                <CommonButton
                  showLoader={false}
                  title={'Tag People'}
                  onPress={() => {
                    console.log('pickedIndex', pickedIndex);
                    let payload = {
                      id: imageDetail._id,
                      imageKey: imageDetail.imageKey,
                      about: imageDetail.about,
                      category: imageDetail.category,
                      userTag: imageDetail.userTag,
                      year: imageDetail.year,
                      index: pickedIndex,
                      filterObject: filterObject,
                    };
                    showTagUserRef.current.close();
                    setTimeout(() => {
                      navigation.navigate('TagUser', payload);
                    }, 230);
                  }}
                />
              </View>
            </View>
          )}
        </View>
      </OptionsSheet>
    );
  };

  const showAboutPhoto = () => {
    return (
      <OptionsSheet
        ref={aboutPhotoRef}
        minClosingHeight={50}
        height={Platform.OS === 'ios' ? height - 100 : height - 64}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingStart: scale(15),
            paddingEnd: scale(15),
            paddingTop: scale(10),
          },
        }}>
        <View style={[grid.flex1, g.mb10, g.mt15]}>
          {(imageDetail !== null &&
            imageDetail.year !== undefined &&
            imageDetail.year !== null &&
            imageDetail.year !== '') ||
          (imageDetail !== null &&
            imageDetail.category !== undefined &&
            imageDetail.category !== null &&
            imageDetail.category !== '') ||
          (imageDetail !== null &&
            imageDetail.about !== undefined &&
            imageDetail.about !== null &&
            imageDetail.about !== '') ? (
            <View>
              <View style={[grid.rowrow, g.ml10, g.mr10, g.mb10]}>
                <View
                  style={[
                    grid.flex1,
                    grid.alignItems,
                    grid.justifyContentLeft,
                    grid.rowrow,
                  ]}>
                  <Text style={[g.fs16, g.FHNB, g.colorBlue]}>
                    {imageDetail !== null &&
                    imageDetail.year !== undefined &&
                    imageDetail.year !== null &&
                    imageDetail.year !== ''
                      ? imageDetail.year
                      : 'Year Not Found'}
                  </Text>
                </View>

                <View style={[grid.flex1, grid.justifyContentRight]}>
                  <Text
                    style={[
                      g.fs16,
                      g.FHNB,
                      g.colorBlue,
                      grid.justifyContentCenter,
                      g.txtCenter,
                    ]}>
                    {imageDetail !== null &&
                    imageDetail.category !== undefined &&
                    imageDetail.category !== null &&
                    imageDetail.category !== ''
                      ? imageDetail.category
                      : 'Category Not Found'}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  g.fs14,
                  g.FHNB,
                  g.colorGray,
                  grid.justifyContentCenter,
                  g.txtLeft,
                ]}>
                {'About the Photo'}
              </Text>
              <Text
                style={[
                  g.fs12,
                  g.FHNM,
                  g.colorBlack,
                  grid.justifyContentCenter,
                  g.textJustify,
                ]}>
                {imageDetail !== null &&
                imageDetail.about !== undefined &&
                imageDetail.about !== null &&
                imageDetail.about !== ''
                  ? imageDetail.about
                  : 'Category Not Found'}
              </Text>
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              <View style={GlobalInclude.AppStyle.fillCenter}>
                <Text style={[g.colorBlack, g.FHNM, g.fs12, g.txtCenter]}>
                  Currently No Information is available for this Photo
                </Text>
                <Text
                  style={[g.colorBlack, g.FHNM, g.fs12, g.txtCenter, g.mt5]}>
                  Please click on the About Photo Button below
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: scale(150),
                  paddingTop: scale(10),
                  paddingBottom: scale(10),
                  alignContent: 'center',
                  alignSelf: 'center',
                  marginBottom: scale(20),
                }}>
                <CommonButton
                  showLoader={false}
                  title={'About Photo'}
                  onPress={() => {
                    let payload = {
                      id: imageDetail._id,
                      imageKey: imageDetail.imageKey,
                      about: imageDetail.about,
                      category: imageDetail.category,
                      userTag: imageDetail.userTag,
                      year: imageDetail.year,
                      index: pickedIndex,
                      filterObject: filterObject,
                    };
                    aboutPhotoRef.current.close();
                    setTimeout(() => {
                      navigation.navigate('AboutPhoto', payload);
                    }, 230);
                  }}
                />
              </View>
            </View>
          )}
        </View>
      </OptionsSheet>
    );
  };

  const generateMenuOption = (menuTitle, type, icon, onPress) => {
    return (
      <View
        style={[
          g.bb1,
          {borderBottomColor: '#e5e5e5', padding: 15, paddingLeft: 0},
        ]}>
        <TouchableOpacity
          activeOpacity={1}
          style={[grid.rowdir, grid.alignItems]}
          onPress={onPress}>
          <GlobalInclude.BaseIcon
            containerStyle={{height: scale(20), width: scale(20)}}
            iconColor={GlobalInclude.Color.ColorPrimary}
            iconName={icon}
            iconSize={scale(20)}
            iconType={IconType[type]}
          />
          <Text
            style={[{marginLeft: 15, fontSize: 16}, g.FHNR, g.colordarkGray]}>
            {menuTitle}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const showOptionsList = () => {
    return (
      <OptionsSheet
        ref={optionRef}
        minClosingHeight={50}
        height={270}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingStart: scale(15),
            paddingEnd: scale(15),
            paddingTop: scale(10),
          },
        }}>
        <View stylre={[grid.flex1, g.mb10]}>
          {generateMenuOption('People In This Image', 4, 'tag', () => {
            optionRef.current.close();
            setTimeout(() => {
              requestType = 'tagging';
              getImageDetail(imageId);
            }, 200);
          })}

          {generateMenuOption('About The Photo', 4, 'info-circle', () => {
            optionRef.current.close();
            setTimeout(() => {
              requestType = 'about';
              getImageDetail(imageId);
            }, 200);
          })}

          {generateMenuOption('Download Photo', 4, 'download', () => {
            optionRef.current.close();
            setTimeout(() => {
              downloadImage();
            }, 200);
          })}

          {generateMenuOption('Report Photo', 10, 'exclamationcircleo', () => {
            optionRef.current.close();
            setTimeout(() => {
              reportText = '';
              requestType = 'reportPhoto';
              getImageDetail(imageId);
            }, 200);
          })}
        </View>
      </OptionsSheet>
    );
  };

  const renderFooter = () => {
    return (
      <View style={style.footerView}>
        {imageData.length === totalCount ? (
          <View />
        ) : (
          <View style={{height: scale(30)}}>
            {paginationStatus === PaginationStatus.waiting ? (
              <View style={g.p10}>
                <ActivityIndicator
                  size={'small'}
                  color={GlobalInclude.Color.ColorPrimary}
                />
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  const renderItem = ({item, index}) => (
    <GalleryImageCard
      index={index}
      item={item}
      showTaggedUser={() => {
        pickedIndex = index;
        requestType = 'tagging';
        getImageDetail(item._id);
      }}
      showAboutPhoto={() => {
        imageId = item._id;
        selectedImageLink = item.imagesLink;
        pickedIndex = index;
        if (optionRef.current !== null) {
          optionRef.current.open();
        }
      }}
      onTouchImage={() => {
        requestType = 'detail';
        pickedIndex = index;
        getImageDetail(item._id);
      }}
    />
  );

  const keyExtractor = (item, index) => index;

  const closeImageViewer = () => {
    Orientation.lockToPortrait();
    setShowImageModal(false);
  };

  const openAboutPhoto = screenName => {
    closeImageViewer();
    setTimeout(() => {
      let payload = {
        id: imageDetail._id,
        imageKey: imageDetail.imageKey,
        about: imageDetail.about,
        category: imageDetail.category,
        userTag: imageDetail.userTag,
        year: imageDetail.year,
        index: pickedIndex,
        filterObject: filterObject,
      };
      navigation.navigate(screenName, payload);
    }, 200);
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar navigation={navigation} showBack={true} title={title} />
      {showProgess(paginationStatus === PaginationStatus.fetching)}
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        {isFetching ? (
          <View style={GlobalInclude.AppStyle.fillCenter}>
            <ActivityIndicator
              size={'small'}
              color={GlobalInclude.Color.ColorPrimary}
            />
          </View>
        ) : (
          <View style={GlobalInclude.AppStyle.fill}>
            <OrientationLocker orientation={PORTRAIT} />
            <FlatList
              ref={flatList}
              removeClippedSubviews={Platform.OS !== 'web'}
              showsVerticalScrollIndicator={false}
              extraData={imageData}
              data={imageData}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              onEndReachedThreshold={0.1}
              onEndReached={onEndReached}
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              ListEmptyComponent={renderNoDataComponent}
              scrollEventThrottle={16}
              bounces={false}
              // contentContainerStyle={{
              //   paddingBottom: imageData.length > 0 ? scale(130) : 0,
              //   flexGrow: 1,
              // }}
              initialNumToRender={10}
              maxToRenderPerBatch={8}
              updateCellsBatchingPeriod={100}
              // getItemLayout={(data, index) => {
              //   return {
              //     length: data[index].ih,
              //     offset: data[index].ih * index,
              //     index,
              //   };
              // }}
              // onScrollToIndexFailed={(error) => {
              //   console.log('failed', error);
              //   if (flatList !== null && flatList.current !== null) {
              //     flatList.current.scrollToOffset({
              //       offset: error.averageItemLength * error.index,
              //       animated: true,
              //     });
              //     setTimeout(() => {
              //       if (flatList !== null && flatList.current !== null) {
              //         flatList.current.scrollToIndex({
              //           index: error.index,
              //           animated: true,
              //         });
              //       }
              //     }, 500);
              //   }
              // }}
            />
          </View>
        )}
      </SafeAreaView>
      {showTagedUser()}
      {showAboutPhoto()}
      {showOptionsList()}

      <Modal
        transparent={true}
        animationType="fade"
        supportedOrientations={['landscape', 'portrait']}
        onRequestClose={() => {
          setShowReportModal(false);
        }}
        visible={showReportModal}>
        <View style={[g.bgBlack, grid.flex1, g.p15, {paddingTop: '25%'}]}>
          <View style={grid.col}>
            <View style={[g.bgWhite, g.p15, g.br3]}>
              <View style={[grid.rowdir, grid.alignItems]}>
                <Text style={[g.fs12, g.colorBlack, grid.col]}>
                  {`Photo Id:${
                    imageDetail !== null ? imageDetail.imageId : ''
                  }`}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setShowReportModal(false);
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
              <TextInput
                maxLength={200}
                placeholder={'Write Text Here'}
                underlineColorAndroid="transparent"
                multiline={true}
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                style={[
                  g.mt10,
                  g.bgWhite,
                  g.textareaStyle,
                  {minHeight: 100, maxHeight: 100, height: 100},
                ]}
                onChangeText={comment => {
                  reportText = comment;
                }}
              />
              {errorMessage.reportContent &&
                errorMessage.reportContent.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.reportContent}
                  </Text>
                )}
              <View style={[grid.rowdir, g.pt10, grid.justifyContentRight]}>
                {isReporting ? (
                  <ActivityIndicator size="large" color="#666666" />
                ) : (
                  <Text style={g.btn} onPress={() => onSubmitReport()}>
                    {'Submit'}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* image slider modal */}
      <Modal
        transparent={true}
        animationType="fade"
        supportedOrientations={['landscape', 'portrait']}
        onRequestClose={() => {
          closeImageViewer();
        }}
        visible={showImageModal}>
        <View style={[style.modalView, g.bgBlack]}>
          <View style={[GlobalInclude.AppStyle.space, style.photoIdContainer]}>
            <View style={style.photoIdStyle}>
              <Text style={[g.fs14, g.colorWhite, g.FHNB, grid.col]}>
                Photo Id:
              </Text>
              <Text style={[g.fs14, g.colorWhite, g.FHNB, grid.col, g.mt2]}>
                {imageDetail !== null ? imageDetail.imageId : ''}
              </Text>
            </View>

            <View style={style.optionButtonContainer}>
              {generateSliderOptions(10, 'exclamationcircleo', () => {
                closeImageViewer();
                setTimeout(() => {
                  reportText = '';
                  setShowReportModal(true);
                }, 200);
              })}

              {generateSliderOptions(1, 'phone-rotate-landscape', () => {
                if (oriantation === 'PORTRAIT') {
                  currentOriantation = 'LANDSCAPE';
                  setOriantation(currentOriantation);
                  Orientation.lockToLandscape();
                } else {
                  currentOriantation = 'PORTRAIT';
                  setOriantation(currentOriantation);
                  Orientation.lockToPortrait();
                }
              })}

              {generateSliderOptions(10, 'download', () => {
                downloadImage();
              })}

              {generateSliderOptions(10, 'closecircleo', () => {
                closeImageViewer();
              })}
            </View>
          </View>

          <ImageViewer
            imageUrls={imageViewerArray}
            backgroundColor={'#000000'}
            useNativeDriver
            loadingRender={() => {
              <ActivityIndicator size="small" color="blue" />;
            }}
            renderIndicator={() => {
              <View />;
            }}
          />

          {oriantation === 'LANDSCAPE' ? (
            <View style={style.landscapeButtonContainer}>
              <TouchableOpacity
                style={style.landscapeButtonStyle}
                onPress={() => openAboutPhoto('TagUser')}>
                <Text
                  style={[
                    g.fs14,
                    g.colorWhite,
                    g.FHNB,
                    grid.justifyContentCenter,
                    grid.alignItems,
                  ]}>
                  {'Tag People'}
                </Text>
              </TouchableOpacity>
              <View style={grid.flex1} />
              <TouchableOpacity
                style={style.landscapeButtonStyle}
                onPress={() => openAboutPhoto('AboutPhoto')}>
                <Text
                  style={[
                    g.fs14,
                    g.colorWhite,
                    g.FHNB,
                    grid.justifyContentCenter,
                    grid.alignItems,
                  ]}>
                  {'About Photo'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={style.portraitButtonContainer}>
              <TouchableOpacity
                style={style.portraitButtonStyle}
                onPress={() => openAboutPhoto('TagUser')}>
                <Text
                  style={[
                    g.fs14,
                    g.colorWhite,
                    g.FHNB,
                    grid.justifyContentCenter,
                    grid.alignItems,
                  ]}>
                  {'Tag People'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.portraitButtonStyle}
                onPress={() => openAboutPhoto('AboutPhoto')}>
                <Text
                  style={[
                    g.fs14,
                    g.colorWhite,
                    g.FHNB,
                    grid.justifyContentCenter,
                    grid.alignItems,
                  ]}>
                  {'About Photo'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      {console.log('showModal', showModal)}

      <Modal
        animationType={'fade'}
        transparent={true}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
        hardwareAccelerated={true}
        visible={showModal}>
        <View style={style.centeredView}>
          <View style={style.responseMessage}>
            <Text style={style.headerText}>{responseMessage}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const style = StyleSheet.create({
  back: {
    width: scale(24),
    height: scale(24),
    padding: scale(4),
    justifyContent: 'center',
  },
  seeMoreLess: {
    fontFamily: 'Lato-Bold',
    fontSize: scale(13),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    color: GlobalInclude.Color.ColorPrimary,
  },
  descriptionWrapper: {
    flex: 1,
    paddingHorizontal: scale(10),
    marginTop: scale(8),
  },
  description: {
    textAlign: 'justify',
    fontSize: scale(13),
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    lineHeight: scale(16),
    marginHorizontal: scale(10),
    fontFamily: 'Lato-Regular',
    marginTop: scale(8),
    padding: scale(2),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'rgba(62,62,62,0.5)',
    flex: 1,
    width: '100%',
  },
  responseMessage: {
    width: width - 50,
    backgroundColor: 'white',
    borderRadius: scale(6),
    padding: scale(7),
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
    minHeight: scale(60),
    alignContent: 'center',
  },
  headerText: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: scale(16),
    textAlign: 'center',
    ...g.FHNR,
    ...g.colorBlue,
  },
  buttonCircle: {
    width: scale(26),
    height: scale(26),
  },
  landscapeButtonStyle: {
    borderRadius: scale(6),
    borderColor: '#fff',
    padding: scale(10),
    borderWidth: 1.5,
    height: scale(40),
    width: scale(120),
    marginHorizontal: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  portraitButtonStyle: {
    borderRadius: scale(6),
    borderColor: '#fff',
    padding: scale(10),
    borderWidth: 1.5,
    height: scale(40),
    flex: 1,
    alignItems: 'center',
    marginHorizontal: scale(3),
    justifyContent: 'center',
  },
  portraitButtonContainer: {
    position: 'absolute',
    zIndex: 9,
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 15,
    flex: 1,
    marginHorizontal: scale(10),
  },
  landscapeButtonContainer: {
    position: 'absolute',
    zIndex: 9,
    bottom: 15,
    marginVertical: scale(10),
    flexDirection: 'row',
  },
  optionButtonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  photoIdStyle: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'center',
    marginStart: scale(10),
    flex: 1,
  },
  photoIdContainer: {
    position: 'absolute',
    zIndex: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ImageList;
