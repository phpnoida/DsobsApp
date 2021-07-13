import React, {useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  ScrollView,
  Dimensions,
} from 'react-native';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';
import ImageViewer from 'react-native-image-zoom-viewer';
import DocViewer from '../component/DocViewer';
import ImageShareModal from '../component/ImageShareModal';
import YoutubeView from '../component/YoutubeView';
import g from '../theme/global';
import grid from '../theme/grid';
import Sound from 'react-native-sound';
import ProgressImage from './ProgresImage';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';
import Player from './Player/Player';

const deviceWidth = Dimensions.get('window').width;
let imageArray = [];
let documentItem = '';
let selectedKey = '';
let playAudio = '';

const ImageGallery = (props) => {
  const playbackState = usePlaybackState();

  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  /**
   * Here you have to pass valid media content if media content is in different format you have to reformat like below
   * [
   *  { type: 2,thumbnail: 'https://www.youtube.com/embed/EngW7tLk6R8' }
   * ]
   * Here type ===1 is image and 2 is video
   */
  const [mediaContent] = useState(props.mediaContent);
  const [lastIndex, setIastIndex] = useState(0);

  // console.log('====================================');
  // console.log('content.images', JSON.stringify(props.mediaContent));
  // console.log('====================================');

  const openImage = () => {
    if (mediaContent.length > 0) {
      imageArray = [];
      mediaContent.map((item) => {
        if (item.type === 1) {
          imageArray.push({url: item.thumbnail, key: item.key});
        }
      });
    }
    if (imageArray.length > 0) {
      for (let i = 0; i < imageArray.length; i++) {
        const item = imageArray[i];
        if (item.key === selectedKey) {
          setIastIndex(i);
          break;
        }
      }
      setShowModal(!showModal);
    }
  };

  const openShareOptions = () => {
    setShowShareModal(!showShareModal);
  };

  const _renderPhotos = () => {
    let photosArray = [];

    mediaContent.map((item, index) => {
      let type = item.type;
      const content = (
        <View
          key={index}
          style={{
            width: deviceWidth / 3 - 27,
            marginTop: 10,
            marginRight: 5,
            marginLeft: 5,
          }}>
          <View style={[g.br3, g.oh, g.bglightGray]}>
            {type === 1 ? (
              <TouchableOpacity
                onPress={() => {
                  selectedKey = item.key;
                  setTimeout(() => {
                    openImage();
                  }, 200);
                }}
                onLongPress={() => {
                  openShareOptions();
                }}
                activeOpacity={1}>
                <ProgressImage
                  source={{uri: item.thumbnail}}
                  containerStyle={{aspectRatio: 1 / 1}}
                  imageStyle={{
                    aspectRatio: 1 / 1,
                  }}
                />
              </TouchableOpacity>
            ) : type === 2 ? (
              <View>
                <YoutubeView
                  link={item.thumbnail}
                  showFullscreen={true}
                  containerStyle={{
                    justifyContent: 'center',
                    aspectRatio: 1 / 1,
                  }}
                  iconName={'play-circle-o'}
                  iconType={'font-awesome'}
                  showPlay={true}
                />
              </View>
            ) : type === 3 ? (
              <View
                style={[
                  g.bglightGray,
                  g.br3,
                  grid.justifyContentCenter,
                  grid.alignItems,
                  {aspectRatio: 1 / 1},
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    documentItem =
                      item.fileName &&
                      item.fileName !== undefined &&
                      item.fileName !== null
                        ? item.fileName
                        : item.thumbnail;
                    setShowDocViewer(true);
                  }}
                  activeOpacity={1}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(36), width: scale(36)}}
                    iconColor={'#E61A2D'}
                    iconName={'file-pdf-o'}
                    iconSize={scale(36)}
                    iconType={IconType[4]}
                  />
                </TouchableOpacity>
              </View>
            ) : type === 4 ? (
              <View
                style={[
                  g.bglightGray,
                  g.br3,
                  grid.justifyContentCenter,
                  grid.alignItems,
                  {aspectRatio: 1 / 1},
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    playAudio = item.thumbnail;
                    setShowPlayer(!showPlayer);
                    start();
                  }}
                  activeOpacity={1}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(36), width: scale(36)}}
                    iconColor={'#E61A2D'}
                    iconName={'file-audio-o'}
                    iconSize={scale(36)}
                    iconType={IconType[4]}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View />
            )}
          </View>
        </View>
      );
      photosArray.push(content);
    });

    return photosArray;
  };

  const start = async () => {
    // Set up the player
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
      ],
    });

    // Add a track to the queue
    await TrackPlayer.add({
      id: 'trackId',
      url: playAudio,
      title: 'Play Audio',
      artist: 'Track Artist',
    });

    // Start playing it
    await TrackPlayer.play();
  };

  async function togglePlayback() {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack == null) {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'trackId',
        url: playAudio,
        title: 'Play Audio',
        artist: 'Track Artist',
      });
      await TrackPlayer.play();
    } else {
      if (playbackState === TrackPlayer.STATE_PAUSED) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  }

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <ScrollView>
        <View style={GlobalInclude.AppStyle.fill}>
          <View
            style={[
              {
                marginBottom: 5,
                marginTop: 10,
                marginLeft: 15,
                marginRight: 15,
                padding: 10,
                paddingBottom: 15,
              },
              g.bgWhite,
              g.boxShadow,
              g.br3,
            ]}>
            <View style={[grid.rowdir, grid.flexwrap]}>{_renderPhotos()}</View>
          </View>
        </View>
        <View style={{height: 100}} />
      </ScrollView>
      {/* image slider modal */}
      <Modal
        transparent={true}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
        visible={showModal}>
        <View style={styles.modalView}>
          <TouchableOpacity
            onPress={() => {
              setShowModal(!showModal);
            }}
            style={styles.buttonCircle}
            background={TouchableNativeFeedback.SelectableBackground()}>
            <GlobalInclude.BaseIcon
              containerStyle={{height: scale(30), width: scale(30)}}
              iconColor={'#fff'}
              iconName={'close'}
              iconSize={scale(30)}
              iconType={IconType[6]}
            />
          </TouchableOpacity>
          <ImageViewer
            imageUrls={imageArray}
            index={lastIndex}
            enablePreload={true}
            onChange={(index) => {
              setIastIndex(index);
            }}
            backgroundColor={'#000'}
            renderIndicator={() => {
              <View />;
            }}
          />
        </View>
      </Modal>
      {/* image share modal */}
      {showShareModal && (
        <ImageShareModal
          status={showShareModal}
          onCloseAction={(type) => {
            setShowShareModal(!showShareModal);
          }}
        />
      )}

      {/* doc viewer */}
      {showDocViewer && (
        <DocViewer
          mediaContent={documentItem}
          onClose={() => {
            setShowDocViewer(false);
          }}
        />
      )}

      <Modal
        transparent={true}
        onRequestClose={() => {
          TrackPlayer.stop().then(() => {
            setShowPlayer(!showPlayer);
          });
        }}
        visible={showPlayer}>
        <View style={styles.modalView}>
          <View style={styles.centeredView}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 15,
                shadowColor: '#333333',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 5,
                padding: 8,
                width: '90%',
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                height: scale(130),
              }}>
              <TouchableOpacity
                onPress={() => {
                  TrackPlayer.stop().then(() => {
                    setShowPlayer(!showPlayer);
                  });
                }}
                style={{
                  width: scale(32),
                  height: scale(32),
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  alignSelf: 'flex-end',
                }}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(30), width: scale(30)}}
                  iconColor={'#000'}
                  iconName={'close'}
                  iconSize={scale(30)}
                  iconType={IconType[8]}
                />
              </TouchableOpacity>
              <View style={{flex: 1}}>
                <Player onTogglePlayback={togglePlayback} />
              </View>
            </View>
          </View>
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
    backgroundColor: g.bgBlack,
    flex: 1,
    width: '100%',
  },
  mediaButtonContainer: {
    backgroundColor: 'white',
    borderRadius: scale(10),
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    padding: scale(5),
    marginStart: scale(4),
    marginEnd: scale(4),
    marginBottom: scale(6),
    marginTop: scale(6),
    flexGrow: 0,
  },
  buttonCircle: {
    width: 24,
    height: 24,
    borderRadius: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: scale(30),
    right: scale(15),
    zIndex: 9,
  },
});

export default ImageGallery;
