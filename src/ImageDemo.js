import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Button,
} from 'react-native';
const {height, width} = Dimensions.get('window');

const ImageDemo = ({props}) => {
  const animationDurations = [500, 500];
  
  const [animatedHeight, setAnimatedHeight] = useState(new Animated.Value(0));
  const [animatedOpacity] = useState(new Animated.Value(0));
  const [expanded, setExpanded] = useState(true);

  const toggleDropdown = () => {
    console.log(
      'BEFORE ANIMATION =>' +
        '\n' +
        'expanded: ' +
        expanded +
        '\n' +
        'animatedHeight: ' +
        JSON.stringify(animatedHeight) +
        '\n' +
        'animatedOpacity: ' +
        JSON.stringify(animatedOpacity),
    );
    if (expanded == true) {
      // collapse dropdown
      Animated.parallel(
        [
          Animated.timing(animatedHeight, {
            toValue: 0,
            duration: animationDurations[1],
          }),
          Animated.timing(animatedOpacity, {
            toValue: 0,
            duration: animationDurations[0],
          }),
        ],
        {
          stopTogether: false,
        },
      ).start();
      setTimeout(() => {
        setExpanded(!expanded);
      }, Math.max(...animationDurations));

      console.log(Math.max(...animationDurations));

      setTimeout(
        () =>
          console.log(
            'AFTER ANIMATION =>' +
              '\n' +
              'animatedHeight: ' +
              JSON.stringify(animatedHeight) +
              '\n' +
              'animatedOpacity: ' +
              JSON.stringify(animatedOpacity),
          ),
        Math.max(...animationDurations),
      );
    } else {
      // expand dropdown
      Animated.sequence([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: animationDurations[0],
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: animationDurations[1],
        }),
      ]).start();
      setExpanded(!expanded);
      setTimeout(
        () =>
          console.log(
            'AFTER ANIMATION =>' +
              '\n' +
              'animatedHeight: ' +
              JSON.stringify(animatedHeight) +
              '\n' +
              'animatedOpacity: ' +
              JSON.stringify(animatedOpacity),
          ),
        3000,
      );
    }
  };

  const interpolatedHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  const interpolatedOpacity = animatedOpacity.interpolate({
    inputRange: [0, 100],
    outputRange: [0.0, 1.0],
  });

  return (
    <View>
      <Animated.View style={[styles.container, {width: interpolatedHeight}]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.leftContainer}>
            <Text style={styles.subtitle}>Time</Text>
          </View>

          <View style={styles.rightContainer}>
            <TouchableOpacity
              onPress={() => toggleDropdown()}
              style={styles.toggleBtn}>
              {/* <Image source={require('../assets/img/chevron-down.png')} resizeMode={'contain'} style={styles.chevron} /> */}
              <Text>Expand</Text>
            </TouchableOpacity>
          </View>
        </View>

        {expanded == true ? (
          <Animated.View
            style={[styles.bottomContainer, {opacity: interpolatedOpacity}]}>
            <Text>Subject</Text>

            <Text>Subject Content</Text>
            <Text>Subject</Text>

            <Text>Subject Content</Text>
            <Text>Subject</Text>

            <Text>Subject Content</Text>
            <Text>Subject</Text>

            <Text>Subject Content</Text>
            <Text>Subject</Text>

            <Text>Subject Content</Text>
          </Animated.View>
        ) : null}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    borderRadius: 25,
    marginBottom: 5,
    marginHorizontal: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
    minHeight: 60,
    overflow: 'hidden',
  },
  leftContainer: {
    justifyContent: 'space-between',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    // fontFamily: Fonts.OPENSANS_BOLD,
    fontSize: 20,
    color: '#454A66',
  },
  subtitle: {
    color: '#454A66',
    fontSize: 14,
  },
  typeIcon: {
    height: 25,
    width: 25,
  },
  chevron: {
    height: 15,
    width: 15,
  },
  toggleBtn: {
    borderWidth: 1,
    // borderColor: Colors.PRIMARY_DARK,
    borderRadius: 7,
    paddingTop: 4,
    paddingBottom: 2.5,
    paddingHorizontal: 4,
    marginLeft: 10,
  },
  bottomContainer: {
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: 20,
  },
  noShadow: {
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 0,
  },
});

export default ImageDemo;
