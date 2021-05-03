import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {IconType} from '../../helper/Constants';
import CommonButton from '../../component/CommonButton';
import PhotoSheet from 'react-native-raw-bottom-sheet';
import VideoSheet from 'react-native-raw-bottom-sheet';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import NextPreviousButton from '../../component/NextPreviousButton';
import {uploadMedia} from '../../Actions/CommonActions';
import {updateUserProfile} from '../../Actions/UserActions';
import YoutubeView from '../../component/YoutubeView';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import getPath from '@flyerhq/react-native-android-uri-path';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const ProgressImage = createImageProgress(AnimatedFastImage);

let photoSheet = null;
let videoSheet = null;
let responseMessage = '';
let opacity = new Animated.Value(0.0);

let displayWidth = Dimensions.get('window').width;
const PhotosMedia = (props) => {
  const {profileData} = props;

  const [isLoading, setIsLoading] = useState(false);

  const [mediaData, setMediaData] = useState([]);

  const [selectedLink, setSelectedLink] = useState('');
  const [selectedLinkError, setSelectedLinkError] = useState('');
  const [selectedLinkTags, setSelectedLinkTags] = useState('');
  const [selectedTagsError, setSelectedTagsError] = useState('');
  const [inEditMode, setInEditMode] = useState(false);
  const [showContactUsModal, setShowContactUsModal] = useState(false);

  useEffect(() => {
    let cloneData = JSON.parse(JSON.stringify(profileData.photos));
    cloneData = cloneData.reverse();
    setMediaData(cloneData);
    return () => {};
  }, [profileData]);

  const handleInput = (key, value) => {
    if (key === 'link') {
      setSelectedLink(value);
    } else if (key === 'tags') {
      setSelectedLinkTags(value);
    }
  };

  const removeMedia = (index) => {
    if (index > mediaData.length) {
      return;
    }
    let oldData = mediaData;
    oldData.splice(index, 1);
    setMediaData([...oldData]);
  };

  const renderMediaItem = () => {
    let componentArray = [];

    mediaData.map((item, index) => {
      const child = (
        <View
          key={index}
          style={[
            grid.c2,
            {
              marginBottom: scale(5),
            },
          ]}>
          {item.type === 1 && (
            <View style={[g.b1, g.br3, g.oh]}>
              <View
                style={[
                  grid.rowdir,
                  grid.justifyContentRight,
                  {position: 'absolute', right: 5, top: 6, zIndex: 1},
                ]}>
                <TouchableOpacity
                  onPress={(e) => {
                    props.removeIndex(() => {
                      removeMedia(index);
                    });
                  }}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(18), width: scale(18)}}
                    iconColor={'#fff'}
                    iconName={'remove'}
                    iconSize={scale(18)}
                    iconType={IconType[4]}
                  />
                </TouchableOpacity>
              </View>
              <View style={[g.bggray]}>
                <ProgressImage
                  source={{uri: item.thumbnail}}
                  style={{aspectRatio: 16 / 9}}
                  imageStyle={{
                    opacity: opacity,
                    aspectRatio: 16 / 9,
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
                    direction: Platform.os === 'android' ? 'clockwise' : 'rtl',
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
            </View>
          )}

          {item.type === 2 && (
            <View style={[g.b1, g.br3, g.oh]}>
              <View
                style={[
                  grid.rowdir,
                  grid.justifyContentRight,
                  {position: 'absolute', right: 5, top: 6, zIndex: 1},
                ]}>
                <TouchableOpacity
                  onPress={(e) =>
                    props.removeIndex(() => {
                      removeMedia(index);
                    })
                  }>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(18), width: scale(18)}}
                    iconColor={'#fff'}
                    iconName={'remove'}
                    iconSize={scale(18)}
                    iconType={IconType[4]}
                  />
                </TouchableOpacity>
              </View>
              <YoutubeView
                link={item.thumbnail}
                containerStyle={{
                  borderRadius: scale(6),
                  justifyContent: 'center',
                  aspectRatio: 16 / 9,
                }}
                iconName={'play-circle-o'}
                iconType={'font-awesome'}
              />
            </View>
          )}

          {item.type === 3 && (
            <View style={[g.b1, g.br3, g.oh, g.p10, {aspectRatio: 16 / 9}]}>
              <View
                style={[
                  grid.rowdir,
                  grid.justifyContentRight,
                  g.colorGray,
                  {position: 'absolute', right: 5, top: 6, zIndex: 1},
                ]}>
                {/* <TouchableOpacity
                  onPress={() => {}}
                  activeOpacity={1}
                  style={{marginEnd: scale(6)}}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(18), width: scale(18)}}
                    iconColor={'#333333'}
                    iconName={'download'}
                    iconSize={scale(18)}
                    iconType={IconType[4]}
                  />
                </TouchableOpacity> */}

                <TouchableOpacity
                  onPress={(e) => {
                    props.removeIndex(() => {
                      removeMedia(index);
                    });
                  }}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(18), width: scale(18)}}
                    iconColor={'#333333'}
                    iconName={'remove'}
                    iconSize={scale(18)}
                    iconType={IconType[4]}
                  />
                </TouchableOpacity>
              </View>
              <View style={[grid.rowrow, grid.justifyContentCenter, g.mt5]}>
                {item.thumbnail.includes('.pdf') && (
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(48), width: scale(48)}}
                    iconColor={'#E61A2D'}
                    iconName={'file-pdf-o'}
                    iconSize={scale(48)}
                    iconType={IconType[4]}
                  />
                )}
              </View>
              <Text
                style={[g.fs14, g.colordarkGray, g.FHNM, g.mt15]}
                numberOfLines={2}>
                {item.fieldName}
              </Text>
            </View>
          )}
        </View>
      );
      componentArray.push(child);
    });
    return componentArray;
  };

  /**
   *
   * API Section start
   *
   */
  const updateProfileDetails = () => {
    if (global.isConnected) {
      let cloneData = JSON.parse(JSON.stringify(mediaData));
      cloneData = cloneData.reverse();
      let requestData = {
        photos: cloneData,
      };

      console.log('json', JSON.stringify(cloneData));

      setIsLoading(true);
      updateUserProfile(
        requestData,
        (response) => {
          setIsLoading(false);

          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.response !== null
            ) {
              let data = response.data;
              if (data.status) {
                props.updateData(data.data);
                setTimeout(() => {
                  props.onSaveTab();
                }, 500);
              }
            }
          }
        },
        (error, message) => {
          //console.log('error', error);
          setIsLoading(false);
          responseMessage = message;
          setShowContactUsModal(true);
        },
      );
    }
  };

  const uploadMediaContent = (body, childPath, mediaType) => {
    setIsLoading(true);
    uploadMedia(
      childPath,
      body,
      (response) => {
        setIsLoading(false);
        if (response && response !== undefined && response !== null) {
          // Alert.alert('Upload response', JSON.stringify(response));
          if (response.status) {
            if (response.data && response.data !== null) {
              let childData = response.data.data;
              let object = {
                thumbnail: childData,
                fileName: childData,
                type: mediaType,
              };

              let oldData = mediaData;

              oldData.splice(0, 0, object);
              setMediaData([...oldData]);
            }
          }
        }
      },
      (error, message) => {
        setIsLoading(false);
        console.log('error', error);
        responseMessage = message;
        setShowContactUsModal(true);
      },
    );
  };

  /**
   *
   * API Section end
   *
   */

  const uploadImage = (pickFile, childPath, mediaType) => {
    try {
      let body = [];
      var re = /(?:\.([^.]+))?$/;

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
      }
    } catch (error) {}
  };

  const requestStoragePermission = async () => {
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

  const uploadDoc = async (pickFile, childPath, mediaType) => {
    try {
      let body = [];
      var re = /(?:\.([^.]+))?$/;

      if (pickFile !== null) {
        var status = await requestStoragePermission();

        if (status) {
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
            Alert.alert(
              'Erorr While pick media',
              'Unable to pick file choose another',
            );
          }
        }
      }
    } catch (error) {
      Alert.alert(
        'Erorr While pick media',
        'Unable to pick file choose another',
      );
    }
  };

  const pickMultiple = () => {
    ImagePicker.openPicker({
      includeBase64: false,
      cropping: false,
      includeExif: false,
      mediaType: 'photo',
      multiple: false,
    })
      .then((images) => {
        if (images !== null) {
          console.log('images', images);
          uploadImage(images, 'utils/imageupload', 1);
        }
      })
      .catch((err) => {
        Alert.alert('User Cancelled Selection!');
        console.log('err', err);
      })
      .finally(() => {
        photoSheet.close();
      });
  };

  const permissionDocument = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        pickDocument();
      }
    } else {
      pickDocument();
    }
  };
  const pickDocument = async () => {
    try {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );

      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      if (res !== null) {
        console.log('res', res);
        uploadDoc(res, 'utils/imageupload?type=1', 3);
      }
    } catch (err) {
      console.log('err', err);
      Alert.alert('User Cancelled Selection!');
    }
  };

  const addToVideo = () => {
    if (selectedLink.trim() === '') {
      setSelectedLinkError('This field is required!');
    } else if (selectedLinkTags.trim() === '') {
      setSelectedTagsError('This field is required!');
    } else {
      videoSheet.close();
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
      let oldData = mediaData;

      oldData.splice(0, 0, obj);
      setMediaData([...oldData]);
    }
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <View style={GlobalInclude.AppStyle.fill}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={g.pt20}>
            <View style={g.mb15}>
              <TouchableOpacity
                style={grid.rowdir}
                onPress={() => {
                  photoSheet.open();
                }}
                activeOpacity={0.7}>
                <View
                  style={[
                    g.bglightGray,
                    grid.col,
                    g.mr10,
                    {padding: 15, borderRadius: 10},
                  ]}>
                  <Text style={[g.fs16, g.FHNR, g.colorLightGray]}>
                    Upload a Photo here
                  </Text>
                </View>
                <View
                  style={[
                    g.p15,
                    g.bglightGray,
                    {width: 50, height: 50, borderRadius: 10},
                  ]}>
                  <Image
                    source={GlobalInclude.Assets.UploadIcon}
                    resizeMode="contain"
                    style={[g.w20, {height: 23}]}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={g.mb15}>
              <TouchableOpacity
                style={grid.rowdir}
                onPress={() => {
                  setSelectedLink('');
                  setSelectedLinkTags('');
                  setInEditMode(false);
                  videoSheet.open();
                }}
                activeOpacity={0.7}>
                <View
                  style={[
                    g.bglightGray,
                    grid.col,
                    g.mr10,
                    {padding: 15, borderRadius: 10},
                  ]}>
                  <Text style={[g.fs16, g.FHNR, g.colorLightGray]}>
                    Upload a Video here
                  </Text>
                </View>
                <View
                  style={[
                    g.p15,
                    g.bglightGray,
                    {width: 50, height: 50, borderRadius: 10},
                  ]}>
                  <Image
                    source={GlobalInclude.Assets.UploadIcon}
                    resizeMode="contain"
                    style={[g.w20, {height: 23}]}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={g.mb15}>
              <TouchableOpacity
                style={grid.rowdir}
                onPress={() => {
                  permissionDocument();
                }}
                activeOpacity={0.7}>
                <View
                  style={[
                    g.bglightGray,
                    grid.col,
                    g.mr10,
                    {padding: 15, borderRadius: 10},
                  ]}>
                  <Text style={[g.fs16, g.FHNR, g.colorLightGray]}>
                    Upload a Docs here
                  </Text>
                </View>
                <View
                  style={[
                    g.p15,
                    g.bglightGray,
                    {width: 50, height: 50, borderRadius: 10},
                  ]}>
                  <Image
                    source={GlobalInclude.Assets.UploadIcon}
                    resizeMode="contain"
                    style={[g.w20, {height: 23}]}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* media data */}
            {mediaData.length > 0 && (
              <View style={g.mb15}>
                <Text style={[g.colorBlack, g.fs14, g.FHNB, g.pl10, g.mb10]}>
                  Delete
                </Text>
                <View style={[grid.rowdir, grid.flexwrap, grid.alignItems]}>
                  {renderMediaItem()}
                </View>
              </View>
            )}
            {/* media data */}
          </View>
        </ScrollView>
      </View>
      <NextPreviousButton
        isLoading={isLoading}
        onPreviuosTab={() => {
          props.onPreviuosTab();
        }}
        onSaveTab={() => {
          updateProfileDetails();
          //props.onSaveTab();
        }}
      />
      <PhotoSheet
        ref={(ref) => {
          photoSheet = ref;
        }}
        height={120}
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
          },
        }}>
        <View style={[g.bb1, g.p15, g.pl0, {borderBottomColor: '#e5e5e5'}]}>
          <TouchableOpacity
            activeOpacity={1}
            style={[grid.rowdir, grid.alignItems]}
            onPress={() => {
              pickMultiple();
            }}>
            <View style={[grid.rowdir, grid.justifyContentCenter, {width: 22}]}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(18), width: scale(18)}}
                iconColor={'#bababa'}
                iconName={'mobile'}
                iconSize={scale(18)}
                iconType={IconType[4]}
              />
            </View>
            <Text style={[g.fs16, g.FHNB, g.colordarkGray, g.ml15]}>
              {'Upload From Device'}
            </Text>
          </TouchableOpacity>
        </View>
      </PhotoSheet>

      {/* video sheet */}
      <VideoSheet
        ref={(ref) => {
          videoSheet = ref;
        }}
        height={260}
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
            paddingTop: scale(10),
            paddingBottom: scale(10),
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
            {selectedLinkError && selectedLinkError !== '' ? (
              <Text style={g.errorMsg}>{selectedLinkError}</Text>
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
              {selectedTagsError && selectedTagsError !== '' ? (
                <Text style={g.errorMsg}>{selectedTagsError}</Text>
              ) : null}
            </View>
          </View>
          <CommonButton
            showLoader={isLoading}
            title={!inEditMode ? 'SAVE' : 'Update'}
            onPress={() => addToVideo()}
          />
        </View>
      </VideoSheet>
    </View>
  );
};

export default PhotosMedia;
