import React, {useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {IconType} from '../../../helper/Constants';
import NextPreviousButton from '../../../component/NextPreviousButton';
import YoutubeView from '../../../component/YoutubeView';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import UploadMedia from '../../../component/UploadMedia';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const ProgressImage = createImageProgress(AnimatedFastImage);
let opacity = new Animated.Value(0.0);

const TabFour = ({
  onSaveTab,
  onPreviousTab,
  mediaData,
  removeMedia,
  inEditMode,
  onMediaPick,
}) => {
  const uploadRef = useRef();

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
                  if (uploadRef.current !== null) {
                    uploadRef.current.open();
                  }
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
                    Upload Media
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
      <UploadMedia
        refRBSheet={uploadRef}
        media={{image: false, video: false, document: false, audio: true}}
        onPickMedia={(media) => {
          uploadRef.current.close();
          if (media !== undefined && media !== null) {
            console.log('media', media);
            onMediaPick(media);
          }
        }}
      />
    </View>
  );
};

export default TabFour;
