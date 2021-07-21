import React, {useRef, useState} from 'react';
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  TextInput,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import g from '../theme/global';
import grid from '../theme/grid';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import {uploadMedia} from '../Actions/CommonActions';
import CommonButton from './CommonButton';
import getPath from '@flyerhq/react-native-android-uri-path';
import {hasPermission} from '../helper/mediaHelper';
import ShowPickedImages from '../component/ShowPickedImages';

var re = /(?:\.([^.]+))?$/;

let uploadTmpImages = [];
let uploadFinalImages = [];
let imageIndex = 0;
const UploadMedia = ({
  refRBSheet,
  media,
  videoData,
  onPickMedia,
  supportMultiple,
}) => {
  const videoRef = useRef();

  const [selectedLink, setSelectedLink] = useState('');
  const [selectedLinkTags, setSelectedLinkTags] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [tempImages, setTempImages] = useState([]);
  const [showPickedImages, setShowPickedImages] = useState(false);
  /**
   *
   * API SECTION
   *
   */

  const uploadMediaContent = (body, childPath, mediaType) => {
    return new Promise(function (resolve, reject) {
      uploadMedia(
        childPath,
        body,
        (response) => {
          global.loader_ref.show_loader(0);
          if (response && response !== undefined && response !== null) {
            if (response.status && response.data && response.data !== null) {
              let childData = response.data.data;
              let object = {
                thumbnail: childData,
                fileName: childData,
                type: mediaType,
              };
              resolve(object);
            } else {
              reject(null);
            }
          } else {
            reject(null);
          }
        },
        (error, message) => {
          reject(null);
        },
      );
    });
  };

  /**
   *
   * API SECTION
   *
   */

  const pickImage = () => {
    ImagePicker.openPicker({
      includeBase64: false,
      includeExif: false,
      mediaType: 'photo',
      multiple: supportMultiple ? supportMultiple : false,
    })
      .then((images) => {
        if (images !== null) {
          console.log('images', images);
          uploadTmpImages = [];
          uploadFinalImages = [];
          imageIndex = 0;
          if (Array.isArray(images)) {
            uploadTmpImages = images;
          } else {
            uploadTmpImages.push(images);
          }
          cropSingleImage();
        }
      })
      .catch((err) => {
        if (err.code === 'E_PICKER_CANCELLED') {
          onPickMedia(null);
          Alert.alert('Cancel Selection', 'User Cancelled Selection!');
        }
      });
  };

  const cropSingleImage = () => {
    if (imageIndex > uploadTmpImages.length - 1) {
      completeCropping();
      return;
    }

    let singleItem = uploadTmpImages[imageIndex];

    let options = {
      cropping: true,
      path: singleItem.path,
      multiple: true,
    };

    if (Platform.OS === 'ios') {
      options.freeStyleCropEnabled = true;
      options.cropperChooseText = 'Done';
      options.width = singleItem.width;
      options.height = singleItem.height;
    } else if (Platform.OS === 'android') {
      options.enableRotationGesture = true;
    }

    ImagePicker.openCropper(options)
      .then((image) => {
        uploadFinalImages.push(image);
      })
      .catch((err) => {})
      .finally(() => {
        imageIndex = imageIndex + 1;
        cropSingleImage();
      });
  };

  const completeCropping = () => {
    console.log('====================================');
    console.log('Cropping done');
    console.log('====================================');

    if (uploadFinalImages.length > 0) {
      if (supportMultiple) {
        setTempImages(uploadFinalImages);
        setShowPickedImages(true);
      } else {
        uploadMultipleImages(uploadFinalImages);
      }
    } else {
      onPickMedia(null);
    }
  };

  const uploadMultipleImages = (tmpData) => {
    var promises = [];
    global.loader_ref.show_loader(1);

    tmpData.forEach((element) => {
      promises.push(uploadImage(element, 'utils/imageupload', 1));
    });

    Promise.all(promises)
      .then((arrList) => {
        onPickMedia(arrList);
      })
      .finally(() => {
        global.loader_ref.show_loader(0);
      });
  };

  const uploadImage = (pickFile, childPath, mediaType) => {
    try {
      let body = [];
      if (pickFile !== null) {
        var path = pickFile.path;

        // if (Platform.OS === 'android') {
        //   path = pickFile.path;
        // } else if (Platform.OS === 'ios') {
        //   path = pickFile.path;
        // }

        var ext = re.exec(path)[1];
        var timestamp = new Date().getTime().toString();
        let imageName = timestamp + '.' + ext;

        let imagePath =
          Platform.OS === 'ios' ? path.replace('file://', '') : path;

        let imageType = pickFile.mime;

        var imageData = {
          name: 'image',
          filename: imageName,
          type: imageType,
          data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
        };
        body.push(imageData);

        return new Promise(function (resolve, reject) {
          uploadMediaContent(body, childPath, mediaType)
            .then((data) => {
              if (data !== undefined && data !== null) {
                resolve(data);
              } else {
                reject(null);
              }
            })
            .catch((error) => {
              reject(null);
            });
        });
      } else {
        onPickMedia(null);
        Alert.alert(
          'Erorr While pick media',
          'Unable to pick file choose another',
        );
      }
    } catch (error) {
      onPickMedia(null);
    }
  };

  const uploadDoc = async (pickFile, childPath, mediaType) => {
    try {
      let body = [];
      if (pickFile !== null) {
        let path = '';
        if (Platform.OS === 'android') {
          path = getPath(pickFile.uri);
        } else {
          path = pickFile.uri;
        }

        if (path !== undefined && path !== null && path !== '') {
          var ext = re.exec(path)[1];
          var timestamp = new Date().getTime().toString();
          let imageName = timestamp + '.' + ext;
          let imagePath =
            Platform.OS === 'ios' ? path.replace('file://', '') : path;
          let imageType = pickFile.type;
          var imageData = {
            name: 'image',
            filename: imageName,
            type: imageType,
            data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
          };
          body.push(imageData);

          global.loader_ref.show_loader(1);
          uploadMediaContent(body, childPath, mediaType)
            .then((data) => {
              if (data !== undefined && data !== null) {
                let tmpArray = [];
                tmpArray.push(data);
                onPickMedia(tmpArray);
              } else {
                onPickMedia(null);
              }
            })
            .catch((error) => {
              onPickMedia(null);
              Alert.alert('Uploading Failed');
            })
            .finally(() => {
              global.loader_ref.show_loader(0);
            });
        } else {
          onPickMedia(null);
          Alert.alert(
            'Erorr While pick media',
            'Unable to pick file choose another',
          );
        }
      } else {
        onPickMedia(null);
        Alert.alert(
          'Erorr While pick media',
          'Unable to pick file choose another',
        );
      }
    } catch (error) {
      console.log('====================================');
      console.log('error', error);
      console.log('====================================');
      onPickMedia(null);
      Alert.alert(
        'Erorr While pick media',
        'Unable to pick file choose another',
      );
    }
  };

  const pickDocument = async () => {
    let status = await hasPermission();
    if (!status) {
      Alert.alert(
        'Permission Denied',
        'You denied permission please grant it from settings',
      );
      return;
    } else {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.pdf],
        });
        if (res !== null) {
          //refRBSheet.current.open();
          uploadDoc(res, 'utils/imageupload?type=1', 3);
        }
      } catch (error) {
        onPickMedia(null);
        Alert.alert('User Cancelled Selection!');
      }
    }
  };

  const pickAudio = async () => {
    let status = await hasPermission();
    if (!status) {
      Alert.alert(
        'Permission Denied',
        'You denied permission please grant it from settings',
      );
      return;
    } else {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.audio],
        });
        if (res !== null) {
          // refRBSheet.current.open();
          uploadDoc(res, 'utils/imageupload?type=3', 4);
        }
      } catch (error) {
        onPickMedia(null);
        Alert.alert('User Cancelled Selection!');
      }
    }
  };

  const addToVideo = () => {
    if (selectedLink.trim() === '') {
      setErrorMessage({link: 'This field is required!'});
    } else if (selectedLinkTags.trim() === '') {
      setErrorMessage({tag: 'This field is required!'});
    } else {
      setErrorMessage({});
      videoRef.current.close();
      const thumbnail =
        selectedLink.includes('youtube') || selectedLink.includes('youtu.be')
          ? selectedLink.replace('watch?v=', 'embed/')
          : selectedLink.includes('vimeo')
          ? selectedLink.replace(
              'https://vimeo.com/',
              'https://player.vimeo.com/video/',
            )
          : '';
      const obj = {
        fileName: selectedLink,
        thumbnail: thumbnail,
        type: 2,
        tags: selectedLinkTags,
      };

      let tmpArray = [];
      tmpArray.push(obj);
      onPickMedia(tmpArray);
    }
  };

  const handleInput = (key, value) => {
    if (key === 'link') {
      setSelectedLink(value);
    } else if (key === 'tags') {
      setSelectedLinkTags(value);
    }
  };

  const generateIcon = (name, label, enabled, onPress) => {
    return (
      <TouchableOpacity
        style={[g.p10, g.m10, g.bglightGray, styles.mainBox]}
        activeOpacity={0.8}
        disabled={enabled}
        onPress={onPress}>
        <View style={[grid.rowdir, grid.justifyContentCenter]}>
          <Image
            source={name}
            resizeMode={'contain'}
            resizeMethod={'auto'}
            style={styles.menuIcon}
            tintColor={enabled ? '#ebebe4' : undefined}
          />
        </View>
        <Text
          style={[
            g.txtCenter,
            g.fs16,
            g.pt5,
            g.FHNB,
            enabled ? g.colorDisabled : g.colordarkGray,
          ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <RBSheet
        ref={refRBSheet}
        height={290}
        minClosingHeight={50}
        onClose={() => {}}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20,
          },
        }}>
        <View
          style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
          <View style={[grid.rowdir, grid.flexwrap, g.mt5]}>
            {generateIcon(
              GlobalInclude.Assets.CameraAttach,
              'Image',
              media.image,
              () => {
                refRBSheet.current.close();
                setTimeout(() => {
                  pickImage();
                }, 350);
              },
            )}
            {generateIcon(
              GlobalInclude.Assets.VideoAttach,
              'Video',
              media.video,
              () => {
                refRBSheet.current.close();
                setSelectedLink(
                  videoData !== undefined && videoData !== null
                    ? videoData.link
                    : '',
                );
                setSelectedLinkTags(
                  videoData !== undefined && videoData !== null
                    ? videoData.tags
                    : '',
                );
                setErrorMessage({});
                setTimeout(() => {
                  videoRef.current.open();
                }, 350);
              },
            )}
          </View>
          <View style={[grid.rowdir, grid.flexwrap, g.mt5]}>
            {generateIcon(
              GlobalInclude.Assets.AudioAttach,
              'Audio',
              media.audio,
              () => {
                refRBSheet.current.close();
                setTimeout(() => {
                  pickAudio();
                }, 350);
              },
            )}
            {generateIcon(
              GlobalInclude.Assets.DocAttach,
              'Document',
              media.document,
              () => {
                refRBSheet.current.close();
                setTimeout(() => {
                  pickDocument();
                }, 350);
              },
            )}
          </View>
        </View>
      </RBSheet>

      {/* Video */}
      <RBSheet
        ref={videoRef}
        height={260}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20,
          },
        }}>
        <View style={grid.flex1}>
          <View style={[grid.col, g.mb10]}>
            <TextInput
              placeholder={'Paste Youtube link here (Required)'}
              onChangeText={(link) => handleInput('link', link)}
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              value={selectedLink}
            />
            {errorMessage.link && errorMessage.link !== '' ? (
              <Text style={g.errorMsg}>{errorMessage.link}</Text>
            ) : null}
          </View>

          <View style={[grid.row, g.mb10]}>
            <View style={grid.col}>
              <TextInput
                placeholder={
                  'Tag this photo, seperate tags by comma (Required)'
                }
                onChangeText={(tags) => handleInput('tags', tags)}
                underlineColorAndroid="transparent"
                style={[g.inputWhite]}
                value={selectedLinkTags}
              />
              {errorMessage.tag && errorMessage.tag !== '' ? (
                <Text style={g.errorMsg}>{errorMessage.tag}</Text>
              ) : null}
            </View>
          </View>
          <CommonButton
            showLoader={false}
            title={
              videoData !== undefined && videoData !== null ? 'Update' : 'Save'
            }
            onPress={() => addToVideo()}
          />
        </View>
      </RBSheet>

      {showPickedImages && (
        <ShowPickedImages
          imageData={tempImages}
          onClose={() => {
            setShowPickedImages(false);
          }}
          uplodFinalImages={(finalImages) => {
            setShowPickedImages(false);
            uploadMultipleImages(finalImages);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuIcon: {
    height: scale(36),
    width: scale(36),
  },
  mainBox: {
    borderRadius: 10,
    flex: 1 / 2,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
  },
});

export default UploadMedia;
