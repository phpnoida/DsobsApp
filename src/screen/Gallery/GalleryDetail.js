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
  Alert,
  FlatList,
  Modal,
  PermissionsAndroid,
  TouchableNativeFeedback,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {IconType, APP_NAME, URL_REGX} from '../../helper/Constants';
import HeaderBar from '../../component/HeaderBar';
import Helper from '../../helper/Helper';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import CommonButton from '../../component/CommonButton';
import ProgresImage from '../../component/ProgresImage';
import RNFetchBlob from 'rn-fetch-blob';
import ImageViewer from 'react-native-image-zoom-viewer';
import Orientation from 'react-native-orientation-locker';
import ScreenOrientation, {
  PORTRAIT,
  LANDSCAPE,
} from 'react-native-orientation-locker/ScreenOrientation';

const {height, width} = Dimensions.get('window');

const {config, fs} = RNFetchBlob;
let PictureDir = fs.dirs.PictureDir;

let index = 0;
let pageTitle = '';
let arrayItems = [];
let optionsSheet = null;
let imageWidth = width;
let imageHeight = height;
let ratio = 0;
let responseMessage = '';
let selectedId = '';
let currentOriantation = '';
let imageArray = [];
let downloadOptions = {
  fileCache: true,
  addAndroidDownloads: {
    useDownloadManager: true,
    notification: true,
    path:
      PictureDir +
      '/me_' +
      Math.floor(new Date().getTime() + new Date().getSeconds() / 2),
    description: 'Downloading image.',
  },
};

const GalleryDetail = ({route, navigation}) => {
  if (route !== undefined && route !== null) {
    arrayItems = route.params.data;
    pageTitle = route.params.title;
    index = route.params.index;
  }

  const [title, setTitle] = useState(pageTitle);
  const [data, setData] = useState([...arrayItems]);
  const [lastIndex, setIastIndex] = useState(index);
  const [isFetching, setIsFetching] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isReporting, setIsReporting] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    updateImage();

    currentOriantation = Orientation.getInitialOrientation();

    Orientation.addOrientationListener(_orientationDidChange);
    return () => {
      Orientation.removeOrientationListener(_orientationDidChange);
    };
  }, []);

  const _orientationDidChange = (orientation) => {
    currentOriantation = orientation;
    console.log('orientation', orientation);
  };

  const updateImage = () => {
    let image = data[index];
    Image.getSize(image, (height, width) => {
      if (width !== undefined && width !== null) {
        if (imageWidth > width) {
          imageWidth = width;
        }
      }
      setIsFetching(false);
    });
  };

  const onSubmitReport = () => {};

  const closeImageViewer = () => {
    Orientation.lockToPortrait();
    setShowImageModal(false);
    setIastIndex(index);
    setIsFetching(true);
    updateImage();
  };

  /**
   *
   * API Section
   */

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
          console.log('You can use the camera');
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
    config(downloadOptions)
      .fetch('GET', file)
      .then((res) => {
        // do some magic here
        console.log('res', res);
        selectedId = '';
        responseMessage = 'Content downloaded successfully!';
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
  };

  /**
   *
   * API Section
   */

  const openImage = () => {
    imageArray = [];
    data.map((item) => {
      imageArray.push({url: item});
    });
    setShowImageModal(true);
  };

  const showTaggedUsers = () => {
    let componentArray = [];

    for (let i = 0; i < 6; i++) {
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
            style={{justifyContent: 'center', alignSelf: 'center'}}>
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
                source={GlobalInclude.Assets.DefaultProfile}
                style={{aspectRatio: 1 / 1}}
                resizeMode="cover"
              />
            </View>
            <View style={{height: 65, width: 100}}>
              <Text
                style={[g.fs14, g.FHNR, g.txtCenter, g.colorBlack, g.mt10]}
                numberOfLines={2}>
                Rahul
              </Text>
              <Text style={[g.fs14, g.FHNR, g.txtCenter, g.colorGray1]}>
                {'Batch 2021'}
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
          <HeaderBar
            navigation={navigation}
            title={title}
            showLabel={true}
            label={'Tag'}
            onLabelPress={() => {
              navigation.navigate('TagUser');
            }}
          />
          {isFetching ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator size={'small'} color={'#2b3252'} />
            </View>
          ) : (
            <View>
              <ScreenOrientation
                orientation={PORTRAIT}
                onChange={(orientation) => console.log('onChange', orientation)}
                onDeviceChange={(orientation) =>
                  console.log('onDeviceChange', orientation)
                }
              />
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  onPress={() => {
                    setTimeout(() => {
                      openImage();
                    }, 200);
                  }}>
                  <ProgresImage
                    source={{uri: data[lastIndex]}}
                    containerStyle={{aspectRatio: 16 / 9, width: imageWidth}}
                    imageStyle={{
                      aspectRatio: 16 / 9,
                      width: imageWidth,
                    }}
                  />
                </TouchableOpacity>

                <Text style={[g.fs14, g.FHNR, g.colorGray1, g.p15, g.pt5]}>
                  About This Image
                </Text>

                <View style={[g.p15, g.pt0]}>
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
                  <View style={[grid.row, g.mt10, grid.flexwrap]}>
                    {showTaggedUsers()}
                  </View>
                </View>
              </ScrollView>
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
                    navigation.navigate('TagUser');
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
                  setTimeout(() => {
                    navigation.navigate('AboutPhoto');
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
                    selectedId = item._id;
                    _downloadContent(item.pdf.file);
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
                  {'Photo Id:1234654'}
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
                onChangeText={(comment) => {}}
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
                {'Photo Id:1234654'}
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
                  closeImageViewer();
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
});

export default GalleryDetail;
