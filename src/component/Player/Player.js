import React, {useState} from 'react';
import PropTypes from 'prop-types';
import TrackPlayer, {
  useTrackPlayerProgress,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {IconType} from '../../helper/Constants';

function ProgressBar() {
  const progress = useTrackPlayerProgress();
  return (
    <View style={{width: '100%', alignItems: 'center'}}>
      <View style={styles.progress}>
        <View style={{flex: progress.position, backgroundColor: '#2b3252'}} />
        <View
          style={{
            flex: progress.duration - progress.position,
            backgroundColor: 'grey',
          }}
        />
      </View>
      <View style={{flexDirection: 'row', width: '100%'}}>
        <Text style={styles.controlButtonText}>
          {parseInt(progress.position, 10).toString()}
        </Text>
        <View style={{flex: 1}} />
        <Text style={styles.controlButtonText}>
          {parseInt(progress.duration, 10).toString()}
        </Text>
      </View>
    </View>
  );
}

function ControlButton({title, onPress}) {
  return (
    <TouchableOpacity style={styles.controlButtonContainer} onPress={onPress}>
      <Text style={styles.controlButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

ControlButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default function Player(props) {
  const playbackState = usePlaybackState();
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtwork, setTrackArtwork] = useState();
  const [trackArtist, setTrackArtist] = useState('');
  useTrackPlayerEvents(['playback-track-changed'], async (event) => {
    if (event.type === TrackPlayer.TrackPlayerEvents.PLAYBACK_TRACK_CHANGED) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artist, artwork} = track || {};
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
  });

  const {style, onNext, onPrevious, onTogglePlayback} = props;

  var middleButtonText = 'Play';

  if (
    playbackState === TrackPlayer.STATE_PLAYING ||
    playbackState === TrackPlayer.STATE_BUFFERING
  ) {
    middleButtonText = 'Pause';
  }

  return (
    <View style={[styles.card, style]}>
      <View style={{marginVertical: 15}}>
        <ProgressBar />
        <View style={styles.controls}>
          <TouchableOpacity onPress={onTogglePlayback}>
            <GlobalInclude.BaseIcon
              containerStyle={{height: 48, width: 48}}
              iconColor={'#2b3252'}
              iconName={
                playbackState === TrackPlayer.STATE_PLAYING ||
                playbackState === TrackPlayer.STATE_BUFFERING
                  ? 'pausecircleo'
                  : 'playcircleo'
              }
              iconSize={42}
              iconType={IconType[10]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

Player.propTypes = {
  style: ViewPropTypes.style,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onTogglePlayback: PropTypes.func.isRequired,
};

Player.defaultProps = {
  style: {},
};

const styles = StyleSheet.create({
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
});
