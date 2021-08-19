import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {scale} from '../theme/Scalling';
import grid from '../theme/grid';
import g from '../theme/global';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';
import Orientation from 'react-native-orientation-locker';
import ImageViewer from 'react-native-image-zoom-viewer';

const {width} = Dimensions.get('window');

let currentOriantation = '';

const ImageViewModal = ({
  onClose,
  imageDetail,
  report,
  onReportPress,
  download,
  downloadImage,
  imageViewerArray,
  showAboutTag,
  openAboutPhoto,
}) => {
  const [showModal, setShowModal] = useState(true);
  const [oriantation, setOriantation] = useState(
    Orientation.getInitialOrientation(),
  );

  useEffect(() => {
    currentOriantation = Orientation.getInitialOrientation();
    setOriantation(currentOriantation);
    Orientation.addOrientationListener(_orientationDidChange);
    return () => {
      Orientation.removeOrientationListener(_orientationDidChange);
    };
  }, []);

  const _orientationDidChange = (orientation) => {
    currentOriantation = orientation;
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

  const closeImageViewer = () => {
    setShowModal(!showModal);
    Orientation.lockToPortrait();
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      supportedOrientations={['landscape', 'portrait']}
      onRequestClose={() => {
        closeImageViewer();
      }}
      visible={showModal}>
      <View style={[style.modalView, g.bgBlack]}>
        <View style={[GlobalInclude.AppStyle.space, style.photoIdContainer]}>
          <View style={style.photoIdStyle}>
            {imageDetail && (
              <View>
                <Text style={[g.fs14, g.colorWhite, g.FHNB, grid.col]}>
                  Photo Id:
                </Text>
                <Text style={[g.fs14, g.colorWhite, g.FHNB, grid.col, g.mt2]}>
                  {imageDetail !== null ? imageDetail.imageId : ''}
                </Text>
              </View>
            )}
          </View>

          <View style={style.optionButtonContainer}>
            {report &&
              generateSliderOptions(10, 'exclamationcircleo', () => {
                closeImageViewer();
                onReportPress();
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

            {download &&
              generateSliderOptions(10, 'download', () => {
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

        {showAboutTag && (
          <View>
            {oriantation === 'LANDSCAPE' ? (
              <View style={style.landscapeButtonContainer}>
                <TouchableOpacity
                  style={style.landscapeButtonStyle}
                  onPress={() => {
                    closeImageViewer();
                    openAboutPhoto('TagUser');
                  }}>
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
                  onPress={() => {
                    closeImageViewer();
                    openAboutPhoto('AboutPhoto');
                  }}>
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
                  onPress={() => {
                    closeImageViewer();
                    openAboutPhoto('TagUser');
                  }}>
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
                  onPress={() => {
                    closeImageViewer();
                    openAboutPhoto('AboutPhoto');
                  }}>
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
        )}
      </View>
    </Modal>
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

export default ImageViewModal;
