import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import g from '../theme/global';
import grid from '../theme/grid';
import {IconType} from '../helper/Constants';
import Orientation from 'react-native-orientation-locker';
import TrackPlayer, {
  useTrackPlayerProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import Slider from '@react-native-community/slider';

const {width} = Dimensions.get('window');

const AudioPlayer = props => {
  const emojiRef = useRef();
  const progress = useTrackPlayerProgress();
  const [showModal, setShowModal] = useState(true);
  const [isPlaying, setPlaying] = useState(false);

  useTrackPlayerEvents(
    ['playback-state', 'remote-play', 'remote-pause', 'remote-stop'],
    async event => {
      console.log('event', event);
      if (event.type === TrackPlayer.TrackPlayerEvents.PLAYBACK_STATE) {
        if (event.state === TrackPlayer.STATE_STOPPED) {
          setPlaying(false);
        } else if (event.state === TrackPlayer.STATE_PLAYING) {
          setPlaying(true);
        }
      } else if (event.type === TrackPlayer.TrackPlayerEvents.REMOTE_PLAY) {
        TrackPlayer.play();
        setPlaying(true);
      } else if (event.type === TrackPlayer.TrackPlayerEvents.REMOTE_STOP) {
        stopPlaying();
      } else if (event.type === TrackPlayer.TrackPlayerEvents.REMOTE_PAUSE) {
        TrackPlayer.pause();
        setPlaying(false);
      }
    },
  );

  useEffect(() => {
    emojiRef.current.open();
    start();
    return () => {};
  }, [start]);

  /**
   *
   * Player
   *
   */
  const start = useCallback(async () => {
    // Set up the player
    await TrackPlayer.setupPlayer({
      waitForBuffer: true,
    });
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SEEK_TO,
      ],
      // compactCapabilities: [
      //   TrackPlayer.CAPABILITY_PLAY,
      //   TrackPlayer.CAPABILITY_PAUSE,
      // ],
      // notificationCapabilities: [
      //   TrackPlayer.CAPABPLILITY_PLAY,
      //   TrackPlayer.CAPABILITY_PAUSE,
      // ],
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

  const onPlayPausePress = async () => {
    const state = await TrackPlayer.getState();

    if (state === TrackPlayer.STATE_PLAYING) {
      TrackPlayer.pause();
      setPlaying(false);
    }

    if (state === TrackPlayer.STATE_PAUSED) {
      TrackPlayer.play();
      setPlaying(true);
    }

    if (state === TrackPlayer.STATE_STOPPED) {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'trackId',
        url: props.mediaContent,
        title: 'Play Audio',
        artist: 'Track Artist',
      });
      await TrackPlayer.play();
      setPlaying(true);
    }
  };

  const stopPlaying = async () => {
    TrackPlayer.stop().then(() => {
      setShowModal(!showModal);
      Orientation.lockToPortrait();
      props.onClose();
    });
  };

  const secondsToHHMMSS = seconds => {
    // credits - https://stackoverflow.com/a/37096512
    seconds = Number(seconds);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);

    const hrs = h > 0 ? (h < 10 ? `0${h}:` : `${h}:`) : '';
    const mins = m > 0 ? (m < 10 ? `0${m}:` : `${m}:`) : '00:';
    const scnds = s > 0 ? (s < 10 ? `0${s}` : s) : '00';
    return `${hrs}${mins}${scnds}`;
  };

  /**
   *
   * Player
   *
   */

  return (
    <OptionsSheet
      ref={emojiRef}
      minClosingHeight={50}
      height={300}
      duration={200}
      closeOnDragDown={false}
      closeOnPressBack={true}
      closeOnPressMask={true}
      closeDuration={200}
      onClose={() => {
        stopPlaying();
      }}
      customStyles={{
        container: GlobalInclude.AppStyle.sheetContainer,
        draggableIcon: {},
      }}>
      <View style={GlobalInclude.AppStyle.fill}>
        <TouchableOpacity
          onPress={() => {
            stopPlaying();
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
        <View style={GlobalInclude.AppStyle.center}>
          <View
            style={{
              height: scale(64),
              width: scale(64),
              borderRadius: scale(42),
              backgroundColor: 'rgba(62,62,62,0.25)',
              margin: scale(3),
              marginHorizontal: scale(5),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <GlobalInclude.BaseIcon
              containerStyle={{
                height: scale(58),
                width: scale(58),
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}
              iconColor={GlobalInclude.Color.ColorPrimary}
              iconName={'headset'}
              iconSize={scale(52)}
              iconType={IconType[6]}
            />
          </View>
        </View>
        {props.extraObjects !== undefined && props.extraObject !== null && (
          <View style={[grid.alignItems, g.mb5, g.mt5]}>
            <Text
              numberOfLines={1}
              style={[
                g.FHNR,
                g.colorBlue,
                g.txtCenterVertical,
                g.txtCenter,
                g.fs12,
              ]}>
              {props.extraObjects.fileName}
            </Text>
          </View>
        )}
        <View style={styles.progrsBarSection}>
          <Text>{secondsToHHMMSS(Math.floor(progress.position || 0))}</Text>
          {/* <View style={{width: '70%', marginHorizontal: scale(5)}}>
            <View style={styles.progress}>
              <View
                style={{
                  flex: progress.position,
                  backgroundColor: GlobalInclude.Color.ColorPrimary,
                }}
              />
              <View
                style={{
                  flex: progress.duration - progress.position,
                  backgroundColor: 'grey',
                }}
              />
            </View>
          </View> */}

          <Slider
            style={{width: '70%', height: 60}}
            minimumValue={1}
            tapToSeek={false}
            accessible={false}
            maximumValue={progress.duration}
            minimumTrackTintColor="#52527a"
            maximumTrackTintColor="#52527a"
            thumbTintColor="#52527a"
            value={progress.position}
          />
          <Text>{secondsToHHMMSS(progress.duration || 0)}</Text>
        </View>

        <View style={styles.buttonsSection}>
          <View style={[styles.buttonsCol, {alignItems: 'flex-end'}]} />
          <View style={styles.buttonsCol}>
            <TouchableOpacity
              onPress={onPlayPausePress}
              style={styles.playPauseButton}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(36), width: scale(36)}}
                iconColor={'white'}
                iconName={isPlaying ? 'pausecircleo' : 'playcircleo'}
                iconSize={scale(30)}
                iconType={IconType[10]}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonsCol, {alignItems: 'flex-start'}]} />
        </View>

        {/* <Player onTogglePlayback={togglePlayback} /> */}
      </View>
    </OptionsSheet>
  );
};

const flexStyles = {
  display: 'flex',
  flex: 1,
  justifyContent: 'space-around',
  alignItems: 'stretch',
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
  card: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  cover: {
    width: 70,
    height: 70,
  },
  progress: {
    height: 3,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    marginTop: 10,
  },
  artist: {
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButtonContainer: {
    flex: 1,
  },
  controlButtonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  progrsBarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  buttonsSection: {
    ...flexStyles,
    flex: 2,
    flexDirection: 'row',
  },
  buttonsCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: scale(10),
  },
  playPauseButton: {
    borderRadius: scale(96),
    width: scale(48),
    height: scale(48),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#52527a',
  },
  playPauseIcon: {
    color: '#fff',
  },
});

export default AudioPlayer;
