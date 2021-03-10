import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Animated,
  PermissionsAndroid,
  SafeAreaView,
  Platform,
  Modal,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {IconType} from '../../helper/Constants';
import {getMagazines} from '../../Actions/RoseBowlActions';
import RNFetchBlob from 'rn-fetch-blob';
import TopHeaderView from '../../component/TopHeaderView';
import MyStatusBar from '../../component/MyStatusBar';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const ProgressImage = createImageProgress(AnimatedFastImage);
const windowWidth = Dimensions.get('window').width;
let opacity = new Animated.Value(0.0);

const {config, fs} = RNFetchBlob;
let PictureDir = fs.dirs.PictureDir;
let responseMessage = '';
let selectedId = '';

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

let deviceWidth = Dimensions.get('window').width;

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const Magazine = ({route, navigation}) => {
  const [pageContent, setPageContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    getMagazine();
    return () => {};
  }, []);

  /**
   * ************************************************
   * API Section Start
   * ************************************************
   */

  const getMagazine = () => {
    setIsLoading(true);
    getMagazines(
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
                data.data &&
                data.data !== undefined &&
                data.data !== null &&
                data.data.length > 0
              ) {
                setPageContent(data.data);
              } else {
                setPageContent(null);
              }
            } else {
              setPageContent(null);
            }
          }
        }
      },
      (error) => {
        setIsLoading(false);
        console.log('error', error);
      },
    );
  };

  /*
   * ************************************************
   * API Section End
   * ************************************************
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

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <MyStatusBar barStyle="light-content" />
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.parentStyle}>
          <View
            style={[
              GlobalInclude.AppStyle.fill,
              {
                paddingStart: scale(15),
                paddingEnd: scale(15),
              },
            ]}>
            {isLoading ? (
              <View style={GlobalInclude.AppStyle.fillCenter}>
                <ActivityIndicator size={'small'} color={'#2b3252'} />
              </View>
            ) : (
              <View style={GlobalInclude.AppStyle.fill}>
                {pageContent === null || pageContent.length === 0 ? (
                  <View style={GlobalInclude.AppStyle.fillCenter}>
                    <Image
                      style={{height: scale(100), width: scale(100)}}
                      source={GlobalInclude.Assets.AppLogo}
                    />
                    <Text style={[g.colorGray8, g.FHNM, g.fs18]}>
                      No Content Found
                    </Text>
                  </View>
                ) : (
                  <View style={GlobalInclude.AppStyle.fill}>
                    <TopHeaderView index={12} navigation={navigation} />
                    <View style={[g.br3, g.mb15, g.mt5]}>
                      <View style={[g.inputNew, grid.rowdir]}>
                        <GlobalInclude.BaseIcon
                          containerStyle={style.searchIcon}
                          iconColor={'#dddddd'}
                          iconName={'search'}
                          iconSize={scale(20)}
                          iconType={IconType[4]}
                        />
                        <TextInput
                          blurOnSubmit={true}
                          maxLength={200}
                          underlineColorAndroid="transparent"
                          style={[g.inputNew, g.pl0, g.fs16]}
                          keyboardType="default"
                          placeholder={'Search'}
                        />
                      </View>
                    </View>
                    {/* Magazine */}
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View style={[grid.alignItems]}>
                        {pageContent.map((item, index) => {
                          return (
                            <View key={index}>
                              <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                  navigation.navigate('Summary', {
                                    magazineId: item._id,
                                  });
                                }}
                                style={[g.mb15]}>
                                <View style={[g.br3, g.oh]}>
                                  <ProgressImage
                                    source={{uri: item.contentImage.file}}
                                    style={[
                                      g.oh,
                                      g.bglightGray,
                                      {
                                        borderRadius: 8,
                                        aspectRatio: 3 / 4,
                                        width: deviceWidth - 70,
                                      },
                                    ]}
                                    imageStyle={{
                                      opacity: opacity,
                                      transform: [
                                        {
                                          scale: opacity.interpolate({
                                            inputRange: [0, 1.0],
                                            outputRange: [0.85, 1.0],
                                          }),
                                        },
                                      ],
                                    }}
                                    indicatorProps={{
                                      animated: true,
                                      borderColor: 'red',
                                      borderWidth: 2,
                                      color: '#2b3252',
                                      direction:
                                        Platform.os === 'android'
                                          ? 'clockwise'
                                          : 'rtl',
                                      indeterminate: true,
                                      progress: 100,
                                      strokeCap: 'butt',
                                      size: scale(20),
                                    }}
                                    onLoad={() => {
                                      Animated.timing(opacity, {
                                        toValue: 1.0,
                                        duration: 200,
                                        useNativeDriver: true,
                                      }).start();
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                    threshold={20}
                                  />
                                </View>

                                <View
                                  style={[
                                    grid.rowrow,
                                    grid.alignItems,
                                    grid.justifyContent,
                                    g.mt10,
                                    g.mb20,
                                  ]}>
                                  <Text
                                    style={[g.colordarkGray, g.FHNM, g.fs15]}>
                                    {`${monthNames[item.publishMonth - 1]} - ${
                                      item.publishYear
                                    } `}
                                  </Text>
                                  {isDownloading && item._id === selectedId ? (
                                    <ActivityIndicator
                                      size={'small'}
                                      color={'#2b3252'}
                                    />
                                  ) : (
                                    <TouchableOpacity
                                      activeOpacity={1}
                                      onPress={() => {
                                        if (!isDownloading) {
                                          selectedId = item._id;

                                          _downloadContent(item.pdf.file);
                                        }
                                      }}>
                                      <GlobalInclude.BaseIcon
                                        containerStyle={style.downloadIcon}
                                        iconColor={'#2b3252'}
                                        iconName={'download'}
                                        iconSize={scale(20)}
                                        iconType={IconType[4]}
                                      />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </View>
                    </ScrollView>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
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
              <View style={style.modalView}>
                <Text style={style.headerText}>{responseMessage}</Text>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  downloadIcon: {
    height: scale(20),
    width: scale(20),
    alignSelf: 'center',
  },
  searchIcon: {
    height: scale(20),
    width: scale(20),
    alignSelf: 'center',
    marginEnd: scale(6),
    marginStart: scale(6),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: windowWidth - 50,
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

export default Magazine;
