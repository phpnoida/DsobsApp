import React, {useState, useCallback, useEffect, useRef} from 'react';
import {Animated} from 'react-native';

export const useAnimation = ({doAnimation, duration}) => {
  const [animation] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: doAnimation ? 0 : 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, [doAnimation, animation, duration, opacity]);

  return animation;
};

export const AnimatedComponent = ({doAnimation}) => {
  const animation = useAnimation({doAnimation, duration: 500});
  return (
    //Animated square
    <Animated.View
      style={{
        width: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 45],
        }),
        height: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 100],
        }),
        backgroundColor: `red`,
      }}
    />
  );
};

export default AnimatedComponent;
