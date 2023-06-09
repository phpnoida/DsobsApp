import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Text,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';
import DocView from 'react-native-pdf';
import Orientation from 'react-native-orientation-locker';

const {width} = Dimensions.get('window');
const {config, fs} = ReactNativeBlobUtil;
let PictureDir = fs.dirs.PictureDir;
let responseMessage = '';
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
let currentOriantation = '';
const DocViewer = props => {
  /**
   * Here you have to pass valid media content if media content is in different format you have to reformat like below
   * [
   *  { type: 2,thumbnail: 'https://www.youtube.com/embed/EngW7tLk6R8' }
   * ]
   * Here type ===1 is image and 2 is video
   */
  const [mediaContent] = useState(props.mediaContent);
  const [showModal, setShowModal] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  /**
   *
   * Download content
   *
   */
  const _downloadContent = async file => {
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

  const downloadData = file => {
    config(downloadOptions)
      .fetch('GET', file)
      .then(res => {
        console.log('res', res);
        responseMessage = 'Content downloaded successfully!';
        setIsDownloading(false);
        setShowResultModal(true);

        setTimeout(() => {
          setShowResultModal(false);
        }, 2000);
      })
      .catch(() => {
        responseMessage = 'Error while downloading content!';
        setIsDownloading(false);
        setShowResultModal(true);
        setTimeout(() => {
          setShowResultModal(false);
        }, 2000);
      });
  };
  /**
   *
   * Download content
   *
   */

  useEffect(() => {
    currentOriantation = Orientation.getInitialOrientation();
    Orientation.addOrientationListener(_orientationDidChange);
    return () => {
      Orientation.removeOrientationListener(_orientationDidChange);
    };
  }, []);

  const _orientationDidChange = orientation => {
    currentOriantation = orientation;
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      {/* image slider modal */}
      <Modal
        supportedOrientations={['landscape', 'portrait']}
        transparent={true}
        onRequestClose={() => {
          Orientation.lockToPortrait();
          setShowModal(!showModal);
          props.onClose();
        }}
        visible={showModal}>
        <View style={styles.modalView}>
          <DocView
            source={{uri: mediaContent.replace(/ /g, '%20')}}
            onLoadComplete={(numberOfPages, filePath) => {
              // console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              // console.log(`current page: ${page}`);
            }}
            onError={error => {
              console.log('error', error);
              console.log('mediaContent', mediaContent);
              setShowModal(!showModal);
              props.onClose();
            }}
            onPressLink={uri => {
              // console.log(`Link presse: ${uri}`)
            }}
            style={GlobalInclude.AppStyle.fullSize}
          />
          <View style={GlobalInclude.AppStyle.closeSpace}>
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
              style={{
                width: scale(30),
                height: scale(30),
                borderRadius: scale(30),
                backgroundColor: GlobalInclude.Color.ColorPrimary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={1}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(14), width: scale(14)}}
                iconColor={'#fff'}
                iconName={'phone-rotate-landscape'}
                iconSize={scale(14)}
                iconType={IconType[1]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log('isDownloading', isDownloading);
                if (!isDownloading) {
                  _downloadContent(mediaContent);
                }
              }}
              style={{
                width: scale(30),
                height: scale(30),
                borderRadius: scale(30),
                backgroundColor: GlobalInclude.Color.ColorPrimary,
                justifyContent: 'center',
                alignItems: 'center',
                marginEnd: scale(8),
                marginStart: scale(8),
              }}
              activeOpacity={1}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(14), width: scale(14)}}
                iconColor={'#fff'}
                iconName={'download'}
                iconSize={scale(14)}
                iconType={IconType[6]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Orientation.lockToPortrait();
                setShowModal(!showModal);
                props.onClose();
              }}
              style={{
                width: scale(30),
                height: scale(30),
                borderRadius: scale(30),
                backgroundColor: GlobalInclude.Color.ColorPrimary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              background={TouchableNativeFeedback.SelectableBackground()}>
              <GlobalInclude.BaseIcon
                containerStyle={{
                  height: scale(14),
                  width: scale(14),
                  justifyContent: 'center',
                }}
                iconColor={'#fff'}
                iconName={'close'}
                iconSize={scale(14)}
                iconType={IconType[6]}
              />
            </TouchableOpacity>
          </View>

          {showResultModal && (
            <Modal
              animationType="slide"
              transparent={true}
              onRequestClose={() => {
                setShowModal(!showResultModal);
              }}
              hardwareAccelerated={true}
              visible={showResultModal}>
              <View style={styles.centeredView}>
                <View style={styles.sucessModalView}>
                  <Text style={styles.headerText}>{responseMessage}</Text>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  buttonCircle: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  sucessModalView: {
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
});

export default DocViewer;
