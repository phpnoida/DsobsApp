import React, {useState, useEffect, useCallback} from 'react';
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
import Player from './Player/Player';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';
import Orientation from 'react-native-orientation-locker';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';
const {width} = Dimensions.get('window');

let currentOriantation = '';
const DocViewer = (props) => {
  const playbackState = usePlaybackState();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    currentOriantation = Orientation.getInitialOrientation();
    Orientation.addOrientationListener(_orientationDidChange);
    start();
    return () => {
      Orientation.removeOrientationListener(_orientationDidChange);
    };
  }, [start]);

  const _orientationDidChange = (orientation) => {
    currentOriantation = orientation;
  };

  /**
   *
   * Player
   *
   */
  const start = useCallback(async () => {
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
      url: props.mediaContent,
      title: 'Play Audio',
      artist: 'Track Artist',
    });

    // Start playing it
    await TrackPlayer.play();
  }, [props.mediaContent]);

  async function togglePlayback() {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack == null) {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'trackId',
        url: props.mediaContent,
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
  /**
   *
   * Player
   *
   */

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      {/* image slider modal */}

      <Modal
        supportedOrientations={['landscape', 'portrait']}
        transparent={true}
        onRequestClose={() => {
          TrackPlayer.stop().then(() => {
            setShowModal(!showModal);
            Orientation.lockToPortrait();
            props.onClose();
          });
        }}
        visible={showModal}>
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
                    setShowModal(!showModal);
                    Orientation.lockToPortrait();
                    props.onClose();
                  });
                }}
                style={{
                  width: scale(32),
                  height: scale(32),
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  alignSelf: 'flex-end',
                }}>
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
