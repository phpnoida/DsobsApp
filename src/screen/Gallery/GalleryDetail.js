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
  Modal,
  PermissionsAndroid,
  TouchableNativeFeedback,
  CameraRoll,
  Platform,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {IconType} from '../../helper/Constants';
import HeaderBar from '../../component/HeaderBar';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import ProgresImage from '../../component/ProgresImage';
import RNFetchBlob from 'rn-fetch-blob';
import ImageViewer from 'react-native-image-zoom-viewer';
import Orientation, {
  OrientationLocker,
  PORTRAIT,
} from 'react-native-orientation-locker';

import {
  getSingleImageFromAlbum,
  doUpdateImageInformation,
} from '../../Actions/GalleryActions';

const {width} = Dimensions.get('window');
const {config} = RNFetchBlob;
let index = 0;
let pageTitle = '';
let arrayItems = [];
let optionsSheet = null;
let responseMessage = '';
let selectedId = '';
let currentOriantation = '';
let imageArray = [];
let reportText = '';

const GalleryDetail = ({route, navigation}) => {
  const [title, setTitle] = useState('');
  const [data, setData] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [lastIndex, setIastIndex] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isReporting, setIsReporting] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tmpIndex, setTmpIndex] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    index = 0;
    pageTitle = '';
    arrayItems = [];
    optionsSheet = null;
    responseMessage = '';
    selectedId = '';
    currentOriantation = '';
    imageArray = [];
    reportText = '';

    if (route !== undefined && route !== null) {
      arrayItems = route.params.data;
      pageTitle = route.params.title;
      index = route.params.index;

      setTitle(pageTitle);
      setData([...arrayItems]);
      setIastIndex(index);
    }

    const unsubscribe = navigation.addListener('focus', () => {
      getImageDetail(arrayItems[index]._id);
    });

    currentOriantation = Orientation.getInitialOrientation();

    Orientation.addOrientationListener(_orientationDidChange);
    return () => {
      unsubscribe();
      Orientation.removeOrientationListener(_orientationDidChange);
    };
  }, []);

  const _orientationDidChange = (orientation) => {
    currentOriantation = orientation;
  };

  const updateImage = (image) => {
    Image.getSize(image, (height, w) => {
      if (w !== undefined && w !== null) {
        const screenWidth = width;
        const scaleFactor = w / screenWidth;
        const imgHeight = height / scaleFactor;

        setImageHeight(imgHeight);
        setImageWidth(screenWidth);
      }
      setIsFetching(false);
    });
  };

  const onSubmitReport = () => {
    if (reportText.trim() === '') {
      setErrorMessage({reportContent: 'This field is required'});
    } else {
      let reportedData = [];
      reportedData = imageData.reported;
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
        imageKey: imageData.imageKey,
        reported: reportedData,
        isReported: true,
      };

      setIsReporting(true);
      doUpdateImageInformation(
        imageData._id,
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
                getImageDetail(imageData._id);
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

  const closeImageViewer = () => {
    Orientation.lockToPortrait();
    setShowImageModal(false);
    setIastIndex(index);
    setIsFetching(true);

    pageTitle = '';
    setImageWidth(width);
    currentOriantation = '';
    getImageDetail(arrayItems[index]._id);
  };

  /**
   *
   * API Section
   */

  const getImageDetail = (imageId) => {
    getSingleImageFromAlbum(
      {id: imageId},
      (response) => {
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

                setImageData(itemObject);
                updateImage(itemObject.imagesLink);
              } else {
                setIsFetching(false);
              }
            } else {
              setIsFetching(false);
            }
          } else {
            setIsFetching(false);
          }
        } else {
          setIsFetching(false);
        }
      },
      (error) => {
        setIsFetching(false);
        setImageData(null);
        console.log('error', error);
      },
    );
  };

  const _downloadContent = async (file) => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Looking for permission',
            message:
              'App needs access to your storage ' +
              'so you can save awesome magazine.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setIsDownloading(true);
          downloadData(file);
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      setIsDownloading(true);
      downloadData(file);
    }
  };

  const downloadData = (file) => {
    let newImgUri = file.lastIndexOf('/');
    let imageName = file.substring(newImgUri);

    let extension = imageName.split('.')[1];

    let dirs = RNFetchBlob.fs.dirs;
    let path =
      Platform.OS === 'ios'
        ? dirs['MainBundleDir'] + imageName
        : dirs.PictureDir + imageName;

    let downloadOptions = {
      fileCache: true,
      appendExt: extension,
      indicator: true,
      IOSBackgroundTask: true,
      path: path,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: 'Image',
      },
    };
    console.log(file);
    if (Platform.OS === 'android') {
      config(downloadOptions)
        .fetch('GET', file)
        .then((res) => {
          // do some magic here
          console.log('res', res);
          selectedId = '';
          responseMessage = 'Image Downloaded Successfully!';
          setIsDownloading(false);
          setShowModal(true);

          setTimeout(() => {
            setShowModal(false);
          }, 2000);
        })
        .catch(() => {
          responseMessage = 'Error while downloading content!';
          setIsDownloading(false);
          setShowModal(true);
        });
    } else {
      CameraRoll.saveToCameraRoll(file, 'photo');
    }
  };

  /**
   *
   * API Section
   */

  const openImage = () => {
    imageArray = [];
    data.map((item) => {
      imageArray.push({url: item.imagesLink});
    });
    setTmpIndex(index);
    setShowImageModal(true);
  };

  const concatName = (item) => {
    let fullName = '';

    if (
      item.firstName &&
      item.firstName !== undefined &&
      item.firstName !== ''
    ) {
      fullName += item.firstName;
    }

    if (item.lastName && item.lastName !== undefined && item.lastName !== '') {
      fullName += ' ' + item.lastName;
    }
    console.log('fullName', fullName);
    return fullName;
  };

  const showTaggedUsers = (userTag) => {
    let componentArray = [];

    for (let i = 0; i < userTag.length; i++) {
      let item = userTag[i];
      const component = (
        <View
          key={i}
          style={[
            g.ml10,
            g.mb5,
            {
              width: width / 3 - 40,
              marginRight: 10,
              justifyContent: 'center',
              alignSelf: 'center',
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {}}
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <View
              style={[
                g.bglightGray,
                g.oh,
                {
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignSelf: 'center',
                },
              ]}>
              <Image
                source={
                  item.profileImg !== null && item.profileImg !== ''
                    ? {uri: item.profileImg}
                    : GlobalInclude.Assets.DefaultProfile
                }
                style={{
                  aspectRatio: 1 / 1,
                  height: scale(70),
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
                resizeMode="cover"
              />
            </View>
            <View style={{height: 65, width: 100}}>
              <Text
                style={[g.fs14, g.FHNR, g.txtCenter, g.colorBlack, g.mt10]}
                numberOfLines={2}>
                {concatName(item)}
              </Text>
              <Text style={[g.fs14, g.FHNR, g.txtCenter, g.colorGray1]}>
                {`Batch ${item.batch}`}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );

      componentArray.push(component);
    }
    return componentArray;
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <View style={GlobalInclude.AppStyle.fill}>
          {isFetching ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator size={'small'} color={'#2b3252'} />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              <HeaderBar
                navigation={navigation}
                showBack={true}
                title={title}
                showLabel={true}
                label={'Tag'}
                onLabelPress={() => {
                  let payload = {
                    id: imageData._id,
                    imageKey: imageData.imageKey,
                    userTag: imageData.userTag,
                  };
                  navigation.navigate('TagUser', payload);
                }}
              />
              {imageData === null ? (
                <View style={GlobalInclude.AppStyle.center}>
                  <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
                    No Record Found
                  </Text>
                </View>
              ) : (
                <View style={GlobalInclude.AppStyle.fill}>
                  <OrientationLocker
                    orientation={PORTRAIT}
                    onChange={(orientation) =>
                      console.log('onChange', orientation)
                    }
                    onDeviceChange={(orientation) =>
                      console.log('onDeviceChange', orientation)
                    }
                  />
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{flexGrow: 1}}>
                    <TouchableOpacity
                      onPress={() => {
                        setTimeout(() => {
                          openImage();
                        }, 200);
                      }}>
                      <ProgresImage
                        source={{uri: imageData.imagesLink}}
                        containerStyle={{
                          aspectRatio: 16 / 9,
                          width: imageWidth,
                        }}
                        imageStyle={{
                          aspectRatio: 16 / 9,
                          width: imageWidth,
                        }}
                        mode={'contain'}
                      />
                    </TouchableOpacity>

                    {imageData.about !== undefined &&
                    imageData.about !== null &&
                    imageData.about !== '' ? (
                      <Text
                        style={[g.fs14, g.FHNR, g.colorGray1, g.p15, g.pt5]}>
                        {imageData.about}
                      </Text>
                    ) : (
                      <Text
                        style={[g.fs14, g.FHNR, g.colorGray1, g.p15, g.pt5]}>
                        No information Found
                      </Text>
                    )}

                    <View style={[g.p15, g.pt0, grid.flex1]}>
                      <View
                        style={[
                          grid.rowrow,
                          grid.alignItems,
                          grid.justifyContentCenter,
                          grid.justifyContent,
                          g.mb10,
                        ]}>
                        <Text
                          style={[
                            g.fs16,
                            g.FHNB,
                            g.colordarkGray,
                            g.ml10,
                            grid.alignItems,
                            grid.justifyContentCenter,
                            g.txtCenter,
                          ]}>
                          People in the image
                        </Text>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            if (optionsSheet !== null) {
                              optionsSheet.open();
                            }
                          }}>
                          <Image
                            source={GlobalInclude.Assets.Menu}
                            style={styles.back}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                      {imageData.userTag !== undefined &&
                      imageData.userTag !== null &&
                      imageData.userTag.length > 0 ? (
                        <View style={[grid.row, g.mt10, grid.flexwrap]}>
                          {showTaggedUsers(imageData.userTag)}
                        </View>
                      ) : (
                        <View style={GlobalInclude.AppStyle.fillCenter}>
                          <Text
                            style={[
                              g.colorBlack,
                              g.FHNM,
                              g.fs12,
                              g.textCenter,
                            ]}>
                            No people tagged in photo
                          </Text>
                        </View>
                      )}
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        </View>

        <OptionsSheet
          ref={(ref) => {
            optionsSheet = ref;
          }}
          onClose={() => {}}
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
            <View
              style={[
                g.bb1,
                {borderBottomColor: '#e5e5e5', padding: 15, paddingLeft: 0},
              ]}>
              <TouchableOpacity
                activeOpacity={1}
                style={[grid.rowdir, grid.alignItems]}
                onPress={() => {
                  optionsSheet.close();
                  setTimeout(() => {
                    let payload = {
                      id: imageData._id,
                      imageKey: imageData.imageKey,
                      userTag: imageData.userTag,
                    };
                    navigation.navigate('TagUser', payload);
                  }, 200);
                }}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(20), width: scale(20)}}
                  iconColor={'#2b3252'}
                  iconName={'tag'}
                  iconSize={scale(20)}
                  iconType={IconType[4]}
                />
                <Text
                  style={[
                    {marginLeft: 15, fontSize: 16},
                    g.FHNR,
                    g.colordarkGray,
                  ]}>
                  {'Tag People'}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                g.bb1,
                {borderBottomColor: '#e5e5e5', padding: 15, paddingLeft: 0},
              ]}>
              <TouchableOpacity
                activeOpacity={1}
                style={[grid.rowdir, grid.alignItems]}
                onPress={() => {
                  optionsSheet.close();
                  console.log('imageData', JSON.stringify(imageData));
                  setTimeout(() => {
                    let payload = {
                      id: imageData._id,
                      imageKey: imageData.imageKey,
                      about: imageData.about,
                      category: imageData.category,
                      year: imageData.year,
                    };
                    navigation.navigate('AboutPhoto', payload);
                  }, 200);
                }}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(20), width: scale(20)}}
                  iconColor={'#2b3252'}
                  iconName={'info-circle'}
                  iconSize={scale(20)}
                  iconType={IconType[4]}
                />
                <Text
                  style={[
                    {marginLeft: 15, fontSize: 16},
                    g.FHNR,
                    g.colordarkGray,
                  ]}>
                  {'About The Photo'}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                g.bb1,
                {borderBottomColor: '#e5e5e5', padding: 15, paddingLeft: 0},
              ]}>
              <TouchableOpacity
                activeOpacity={1}
                style={[grid.rowdir, grid.alignItems]}
                onPress={() => {
                  optionsSheet.close();
                  if (!isDownloading) {
                    selectedId = imageData._id;
                    _downloadContent(imageData.imagesLink);
                  }
                }}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(20), width: scale(20)}}
                  iconColor={'#2b3252'}
                  iconName={'download'}
                  iconSize={scale(20)}
                  iconType={IconType[4]}
                />
                <Text
                  style={[
                    {marginLeft: 15, fontSize: 16},
                    g.FHNR,
                    g.colordarkGray,
                  ]}>
                  {'Download Photo'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{padding: 15, paddingLeft: 0}}>
              <TouchableOpacity
                activeOpacity={1}
                style={[grid.rowdir, grid.alignItems]}
                onPress={() => {
                  optionsSheet.close();
                  setShowReportModal(true);
                }}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(20), width: scale(20)}}
                  iconColor={'#2b3252'}
                  iconName={'exclamationcircleo'}
                  iconSize={scale(20)}
                  iconType={IconType[10]}
                />
                <Text
                  style={[
                    {marginLeft: 15, fontSize: 16},
                    g.FHNR,
                    g.colordarkGray,
                  ]}>
                  {'Report Photo'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </OptionsSheet>
      </SafeAreaView>

      <Modal
        transparent={true}
        visible={showReportModal}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          setShowReportModal(false);
        }}>
        <ScrollView
          contentContainerStyle={[
            g.bgBlack,
            grid.flex1,
            g.p15,
            {paddingTop: '25%'},
          ]}>
          <View style={grid.col}>
            <View style={[g.bgWhite, g.p15, g.br3]}>
              <View style={[grid.rowdir, grid.alignItems]}>
                <Text style={[g.fs12, g.colorBlack, grid.col]}>
                  {`Photo Id:${imageData !== null ? imageData.imageId : ''}`}
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
        </ScrollView>
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
        <View style={styles.modalView}>
          <View
            style={{
              position: 'absolute',
              zIndex: 9,
              top: scale(10),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                marginStart: scale(15),
                flex: 1,
              }}>
              <Text style={[g.fs14, g.colorWhite, g.FHNB, grid.col]}>
                {`Photo Id: ${
                  data !== null && data.length > 0 ? data[tmpIndex].imageId : ''
                } `}
              </Text>
            </View>

            <View
              style={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                alignSelf: 'flex-end',
                flexDirection: 'row',
                marginEnd: scale(15),
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (currentOriantation === 'PORTRAIT') {
                    currentOriantation = 'LANDSCAPE';
                    Orientation.lockToLandscape();
                  } else {
                    currentOriantation = 'PORTRAIT';
                    Orientation.lockToPortrait();
                  }
                }}
                style={styles.buttonCircle}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(22), width: scale(22)}}
                  iconColor={'#FFF'}
                  iconName={'phone-rotate-landscape'}
                  iconSize={scale(22)}
                  iconType={IconType[1]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (!isDownloading) {
                    selectedId = data[tmpIndex]._id;
                    _downloadContent(data[tmpIndex].imagesLink);
                  }
                }}
                style={[
                  styles.buttonCircle,
                  {marginLeft: scale(15), marginRight: scale(15)},
                ]}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(22), width: scale(22)}}
                  iconColor={'#FFF'}
                  iconName={'download'}
                  iconSize={scale(22)}
                  iconType={IconType[10]}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  closeImageViewer();
                }}
                style={styles.buttonCircle}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(22), width: scale(22)}}
                  iconColor={'#FFF'}
                  iconName={'closecircleo'}
                  iconSize={scale(22)}
                  iconType={IconType[10]}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ImageViewer
            imageUrls={imageArray}
            index={lastIndex}
            onChange={(newIndex) => {
              setTmpIndex(newIndex);
              index = newIndex;
            }}
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

      {showModal && (
        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setShowModal(!showModal);
          }}
          hardwareAccelerated={true}
          visible={showModal}>
          <View style={styles.centeredView}>
            <View style={styles.responseMessage}>
              <Text style={styles.headerText}>{responseMessage}</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    width: scale(24),
    height: scale(24),
    padding: scale(4),
    justifyContent: 'center',
  },
  buttonCircle: {
    width: scale(26),
    height: scale(26),
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
});

export default GalleryDetail;
