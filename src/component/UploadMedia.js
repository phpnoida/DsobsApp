import React, {useRef, useState} from 'react';
import {
  Text,
  Dimensions,
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
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
import Toast from './Toast';
import {uploadMedia} from '../Actions/CommonActions';
import CommonButton from './CommonButton';
import getPath from '@flyerhq/react-native-android-uri-path';

var re = /(?:\.([^.]+))?$/;

const UploadMedia = ({
  refRBSheet,
  media,
  videoData,
  onPickMedia,
  showLoader,
}) => {
  const videoRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedLink, setSelectedLink] = useState('');
  const [selectedLinkTags, setSelectedLinkTags] = useState('');
  const [errorMessage, setErrorMessage] = useState({});

  /**
   *
   * API SECTION
   *
   */

  const uploadMediaContent = (body, childPath, mediaType) => {
    setIsLoading(true);
    uploadMedia(
      childPath,
      body,
      (response) => {
        setIsLoading(false);
        if (response && response !== undefined && response !== null) {
          if (response.status && response.data && response.data !== null) {
            let childData = response.data.data;
            let object = {
              thumbnail: childData,
              fileName: childData,
              type: mediaType,
            };
            onPickMedia(object);
          } else {
            onPickMedia(null);
          }
        } else {
          onPickMedia(null);
        }
      },
      (error, message) => {
        setIsLoading(false);
        console.log('error', error);
        onPickMedia(null);
        Alert.alert('Uploading Failed');
      },
    );
  };

  /**
   *
   * API SECTION
   *
   */

  const pickImage = () => {
    ImagePicker.openPicker({
      includeBase64: false,
      cropping: false,
      includeExif: false,
      mediaType: 'photo',
      multiple: false,
    })
      .then((images) => {
        if (images !== null) {
          refRBSheet.current.open();
          console.log('images', images);
          uploadImage(images, 'utils/imageupload', 1);
        }
      })
      .catch((err) => {
        console.log('err', err.code);
        if (err.code === 'E_PICKER_CANCELLED') {
          onPickMedia(null);
          Alert.alert('Cancel Selection', 'User Cancelled Selection!');
        }
      });
  };

  const uploadImage = (pickFile, childPath, mediaType) => {
    try {
      let body = [];
      if (pickFile !== null) {
        var path = '';

        if (Platform.OS === 'android') {
          path = pickFile.path;
        } else if (Platform.OS === 'ios') {
          path = pickFile.sourceURL;
        }

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

        uploadMediaContent(body, childPath, mediaType);
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
          uploadMediaContent(body, childPath, mediaType);
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
          refRBSheet.current.open();
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
          refRBSheet.current.open();
          uploadDoc(res, 'utils/imageupload?type=3', 4);
        }
      } catch (error) {
        onPickMedia(null);
        Alert.alert('User Cancelled Selection!');
      }
    }
  };

  const hasPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const pm1 = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    const pm2 = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    if (pm1 && pm2) {
      return true;
    }

    const userResponse = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);

    if (
      userResponse['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
      userResponse['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
    ) {
      return true;
    } else {
      return false;
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
      onPickMedia(obj);
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
          />
        </View>
        <Text style={[g.txtCenter, g.fs16, g.pt5, g.FHNB, g.colordarkGray]}>
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
          {isLoading && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: 'center',
              }}>
              <ActivityIndicator size={'small'} color={'#2b3252'} />
            </View>
          )}
          <View style={[grid.rowdir, grid.flexwrap, g.mt5]}>
            {generateIcon(
              GlobalInclude.Assets.CameraAttach,
              'Image',
              media.image,
              () => {
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
            showLoader={isLoading}
            title={
              videoData !== undefined && videoData !== null ? 'Update' : 'Save'
            }
            onPress={() => addToVideo()}
          />
        </View>
      </RBSheet>
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
});

export default UploadMedia;
