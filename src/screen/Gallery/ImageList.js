import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
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
  DeviceEventEmitter,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import HeaderBar from '../../component/HeaderBar';
import ProgressImage from '../../component/ProgresImage';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import {renderNoDataComponent} from '../../component/Common';
import {APP_NAME, IconType} from '../../helper/Constants';
import ImageViewer from 'react-native-image-zoom-viewer';
import Helper from '../../helper/Helper';
import Orientation, {
  OrientationLocker,
  PORTRAIT,
} from 'react-native-orientation-locker';
import grid from '../../theme/grid';
import ReadMore from '../../component/ReadMore/ReadMore';
import {
  doFilterGallery,
  doUpdateImageInformation,
} from '../../Actions/GalleryActions';
import {showUser} from '../../component/Common';
import {_downloadContent} from '../../helper/mediaHelper';

const {height, width} = Dimensions.get('window');
const ITEM_HEIGHT = 340;

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};
let totalCount = 0;
let filterObject = {
  index: 0,
  size: 10,
};

let pickedIndex = 0;
let pickedIndexClone = 0;
let selectedIndex = 0;
let galleryId = '';
let pageTitle = '';
let selectedItem = null;
let currentOriantation = '';
let responseMessage = '';
let reportText = '';
let imageArray = [];
let itemHeights = [];

function GalleryImage({
  index: itemIndex,
  item: {about, imagesLink},
  showTaggedUser,
  onSelect,
  onTouchImage,
}) {
  return useMemo(() => {
    return (
      <View
        key={itemIndex}
        style={[g.mt15]}
        onLayout={(event) => {
          var {height} = event;
          itemHeights[itemIndex] = height;
        }}>
        <View style={[grid.rowrow, grid.flex1, g.ml10, g.mr10]}>
          <View
            style={[grid.flex1, grid.alignItems, grid.justifyContentCenter]}>
            <TouchableOpacity
              onPress={showTaggedUser}
              style={[grid.alignSelf, grid.justifyContentCenter]}>
              <Text style={[g.fs14, g.FHNB, g.colordarkGray]}>
                People in the image
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={onSelect}>
            <Image
              source={GlobalInclude.Assets.Menu}
              style={style.back}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={g.bgBlack06}>
          <TouchableOpacity onPress={onTouchImage}>
            <ProgressImage
              source={
                imagesLink !== undefined &&
                imagesLink !== null &&
                imagesLink !== ''
                  ? {uri: imagesLink}
                  : GlobalInclude.Assets.DefaultImage
              }
              containerStyle={{
                aspectRatio: 16 / 9,
              }}
              imageStyle={{
                aspectRatio: 16 / 9,
              }}
              mode={'contain'}
            />
          </TouchableOpacity>
        </View>

        {about !== undefined && about !== null && about !== '' ? (
          <ReadMore
            wrapperStyle={style.descriptionWrapper}
            numberOfLines={2}
            seeMoreText={'See More'}
            seeLessText={'See Less'}
            style={[style.description, g.FHNR, g.colorGray1, g.pl2, g.pr2]}
            seeLessStyle={style.seeMoreLess}
            seeMoreStyle={style.seeMoreLess}>
            {about}
          </ReadMore>
        ) : (
          <Text style={[g.fs14, g.FHNR, g.colorGray1, g.p15, g.pt5]}>
            No information Found
          </Text>
        )}
      </View>
    );
  }, [itemIndex, imagesLink, about, showTaggedUser, onSelect, onTouchImage]);
}

const ImageList = ({route, navigation}) => {
  const flatList = useRef();
  const optionRef = useRef();
  const showTagUserRef = useRef();

  const [title, setTitle] = useState(APP_NAME);
  const [imageData, setImageData] = useState([]);
  const [taggedUser, setTaggedUser] = useState([]);
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
  useEffect(() => {
    clearFields();
    resetFilter();
    if (route !== undefined && route !== null) {
      pageTitle = route.params.title;
      galleryId = route.params.galleryId;
      pickedIndex = route.params.index;
      pickedIndexClone = route.params.index;

      filterObject.size =
        pickedIndex > 0 ? Math.ceil(pickedIndex / 10) * 10 : 10;
      filterObject.galleryId = galleryId;
      setTitle(pageTitle);
      getGalleryData();
    }

    currentOriantation = Orientation.getInitialOrientation();

    Orientation.addOrientationListener(_orientationDidChange);

    DeviceEventEmitter.addListener('event.updateEvent', (eventData) => {
      clearFields();
      resetFilter();
      filterObject.size = Math.ceil(eventData.selectedIndex / 10) * 10;
      filterObject.galleryId = eventData.filterObject.galleryId;
      pickedIndex = eventData.selectedIndex;
      getGalleryData();
    });

    return () => {
      DeviceEventEmitter.removeAllListeners('event.updateEvent');
      Orientation.removeOrientationListener(_orientationDidChange);
    };
  }, [route]);

  const clearFields = () => {
    pickedIndex = 0;
    pageTitle = '';
    galleryId = '';
    reportText = '';
    imageArray = [];
  };

  const _orientationDidChange = (orientation) => {
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
      (response) => {
        setIsFetching(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let responseData = response.data;

            if (responseData.status) {
              let results = responseData.data;

              if (filterObject.index === 0) {
                filterObject.size = 10;
                totalCount = responseData.totalCount;
                setImageData([...results]);
              } else {
                setImageData([...imageData, ...results]);
              }

              setPaginationStatus(PaginationStatus.waiting);
            }
          }
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

  const onSubmitReport = () => {
    if (reportText.trim() === '') {
      setErrorMessage({reportContent: 'This field is required'});
    } else {
      let reportedData = [];
      reportedData = selectedItem.reported;
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
        imageKey: selectedItem.imageKey,
        reported: reportedData,
        isReported: true,
      };

      setIsReporting(true);
      doUpdateImageInformation(
        selectedItem._id,
        requestData,
        (response) => {
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

              setShowModal(true);

              setTimeout(() => {
                setShowModal(false);
              }, 2000);
            }
          }
        },
        (error) => {
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
      setPaginationStatus(PaginationStatus.waiting);
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
    filterObject = {};
    filterObject.index = 0;
    filterObject.size = 10;
  };

  const openImage = () => {
    imageArray = [];
    imageArray.push({
      url: selectedItem.imagesLink,
      imageId: selectedItem.imageId,
    });
    setImageViewerArray([...imageArray]);
    setTimeout(() => {
      setShowImageModal(true);
    }, 500);
  };

  const downloadImage = async () => {
    if (!isDownloading) {
      setIsDownloading(true);
      let result = await _downloadContent(selectedItem.imagesLink);

      if (result) {
        responseMessage = 'Image Downloaded Successfully!';
      } else {
        responseMessage = 'Error while downloading content!';
      }
      setIsDownloading(false);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    }
  };

  const showTaggedUsers = (userTag) => {
    let componentArray = [];
    for (let i = 0; i < userTag.length; i++) {
      let item = userTag[i];
      const component = (
        <View key={i}>
          {showUser(
            item.profileImg,
            Helper.concatName(item),
            `Batch ${item.batch}`,
            () => {},
          )}
        </View>
      );

      componentArray.push(component);
    }
    return componentArray;
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

  const generateSliderOptions = (type, icon, onPress) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          style.buttonCircle,
          {marginLeft: scale(15), marginRight: scale(15)},
        ]}>
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
          {taggedUser !== null &&
          taggedUser !== undefined &&
          taggedUser !== null &&
          taggedUser.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[grid.row, g.mt10, grid.flexwrap]}>
                {showTaggedUsers(taggedUser)}
              </View>
            </ScrollView>
          ) : (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
                No people tagged in photo
              </Text>
            </View>
          )}
        </View>
      </OptionsSheet>
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
          {generateMenuOption('Tag People', 4, 'tag', () => {
            optionRef.current.close();
            setTimeout(() => {
              let payload = {
                id: selectedItem._id,
                imageKey: selectedItem.imageKey,
                userTag: selectedItem.userTag,
                index: selectedIndex,
                filterObject: filterObject,
              };
              navigation.navigate('TagUser', payload);
            }, 200);
          })}

          {generateMenuOption('About The Photo', 4, 'info-circle', () => {
            optionRef.current.close();
            setTimeout(() => {
              let payload = {
                id: selectedItem._id,
                imageKey: selectedItem.imageKey,
                about: selectedItem.about,
                category: selectedItem.category,
                year: selectedItem.year,
                index: selectedIndex,
                filterObject: filterObject,
              };
              navigation.navigate('AboutPhoto', payload);
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
              setShowReportModal(true);
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

  const renderItem = useCallback(
    ({item, index}) => (
      <GalleryImage
        index={index}
        item={item}
        showTaggedUser={() => {
          setTaggedUser([...item.userTag]);
          if (showTagUserRef.current !== null) {
            showTagUserRef.current.open();
          }
        }}
        onSelect={() => {
          selectedIndex = index;
          selectedItem = item;
          if (optionRef.current !== null) {
            optionRef.current.open();
          }
        }}
        onTouchImage={() => {
          selectedItem = item;
          selectedIndex = index;
          openImage();
        }}
      />
    ),
    [],
  );

  const keyExtractor = useCallback((item, index) => index, []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const closeImageViewer = () => {
    Orientation.lockToPortrait();
    setShowImageModal(false);
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar navigation={navigation} showBack={true} title={title} />
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
            <OrientationLocker
              orientation={PORTRAIT}
              onChange={(orientation) => console.log('onChange', orientation)}
              onDeviceChange={(orientation) =>
                console.log('onDeviceChange', orientation)
              }
            />
            {imageData.length > 0 ? (
              <FlatList
                ref={flatList}
                showsVerticalScrollIndicator={false}
                extraData={imageData}
                data={imageData}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onEndReachedThreshold={0.1}
                onEndReached={onEndReached}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                initialScrollIndex={pickedIndex}
                initialNumToRender={imageData.length}
                ListEmptyComponent={renderNoDataComponent}
                ListFooterComponent={renderFooter}
                contentContainerStyle={{paddingBottom: scale(130)}}
                getItemLayout={getItemLayout}
                onScrollToIndexFailed={(error) => {
                  console.log('failed', error);
                  flatList.current.scrollToOffset({
                    offset: error.averageItemLength * error.index,
                    animated: true,
                  });
                  setTimeout(() => {
                    flatList.current.scrollToIndex({
                      index: error.index,
                      animated: true,
                    });
                  }, 500);
                }}
              />
            ) : null}
          </View>
        )}
      </SafeAreaView>
      {showOptionsList()}
      {showTagedUser()}

      {showModal && (
        <Modal
          animationType="slide"
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
      )}

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
                    selectedItem !== null ? selectedItem.imageId : ''
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
                onChangeText={(comment) => {
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
          <View
            style={[
              GlobalInclude.AppStyle.space,
              {
                position: 'absolute',
                zIndex: 9,
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}>
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                alignSelf: 'center',
                flexDirection: 'row',
                marginStart: scale(15),
                flex: 1,
              }}>
              <Text style={[g.fs14, g.colorWhite, g.FHNB, grid.col]}>
                {`Photo Id: ${
                  selectedItem !== null ? selectedItem.imageId : ''
                } `}
              </Text>
            </View>

            <View
              style={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                alignSelf: 'flex-end',
                flexDirection: 'row',
              }}>
              {generateSliderOptions(1, 'phone-rotate-landscape', () => {
                if (currentOriantation === 'PORTRAIT') {
                  currentOriantation = 'LANDSCAPE';
                  Orientation.lockToLandscape();
                } else {
                  currentOriantation = 'PORTRAIT';
                  Orientation.lockToPortrait();
                }
              })}

              {generateSliderOptions(10, 'download', () => {
                if (currentOriantation === 'PORTRAIT') {
                  currentOriantation = 'LANDSCAPE';
                  Orientation.lockToLandscape();
                } else {
                  currentOriantation = 'PORTRAIT';
                  Orientation.lockToPortrait();
                }
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
});

export default ImageList;
