import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Alert,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {IconType} from '../../../helper/Constants';
import CommonButton from '../../../component/CommonButton';
import PhotoSheet from 'react-native-raw-bottom-sheet';
import VideoSheet from 'react-native-raw-bottom-sheet';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import NextPreviousButton from '../../../component/NextPreviousButton';
import {uploadMedia} from '../../../Actions/CommonActions';
import {updateUserProfile} from '../../../Actions/UserActions';
import YoutubeView from '../../../component/YoutubeView';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import {permissionDocument} from '../../../helper/UploadDocument';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const ProgressImage = createImageProgress(AnimatedFastImage);

let photoSheet = null;
let videoSheet = null;
let opacity = new Animated.Value(0.0);

const TabFour = ({
  onSaveTab,
  onPreviousTab,
  mediaData,
  removeMedia,
  addVideo,
  onPickImage,
  onPickDocument,
  inEditMode,
}) => {
  const [selectedLink, setSelectedLink] = useState('');
  const [selectedLinkError, setSelectedLinkError] = useState('');
  const [selectedLinkTags, setSelectedLinkTags] = useState('');
  const [selectedTagsError, setSelectedTagsError] = useState('');

  const handleInput = (key, value) => {
    if (key === 'link') {
      setSelectedLink(value);
    } else if (key === 'tags') {
      setSelectedLinkTags(value);
    }
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
                  {position: 'absolute', right: 10, top: 10, zIndex: 1},
                ]}>
                <TouchableOpacity
                  onPress={(e) => {
                    removeMedia(index);
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
                  {position: 'absolute', right: 10, top: 10, zIndex: 1},
                ]}>
                <TouchableOpacity
                  onPress={(e) => {
                    removeMedia(index);
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
                  {position: 'absolute', right: 10, top: 10, zIndex: 1},
                ]}>
                <TouchableOpacity
                  onPress={(e) => {
                    removeMedia(index);
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
                    iconColor={'#6e6e6e'}
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

  const pickMultiple = () => {
    ImagePicker.openPicker({
      includeBase64: false,
      cropping: true,
      includeExif: false,
      mediaType: 'photo',
      multiple: false,
    })
      .then((images) => {
        if (images !== null) {
          console.log('images', images);
          onPickImage(images);
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

  const pickDocument = async () => {
    try {
      permissionDocument().then((response) => {
        if (response && response !== null && response !== undefined) {
          let body = response;
          onPickDocument(body);
        }
      });
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
      addVideo(obj);
    }
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15, g.pt20]}>
      <View style={GlobalInclude.AppStyle.fill}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View>
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
                  pickDocument();
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
        isLoading={false}
        nextTitle={inEditMode ? 'Update & Next' : 'Save & Next'}
        onPreviuosTab={() => {
          onPreviousTab();
        }}
        onSaveTab={() => {
          onSaveTab();
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
            showLoader={false}
            title={'SAVE'}
            onPress={() => addToVideo()}
          />
        </View>
      </VideoSheet>
    </View>
  );
};

export default TabFour;
