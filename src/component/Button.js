import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Color from '../theme/Colors';
import {scale} from '../theme/Scalling.js';

const Button = (props) => {
  if (props.type === 'icon') {
  } else {
    return <StandardButton {...props} />;
  }
};

Button.propTypes = {
  type: PropTypes.string,
};

const StandardButton = (props) => (
  <View style={[styles.viewbuttonstyle, props.viewstyle]}>
    <TouchableOpacity
      onPress={() => props.onPress()}
      style={[styles.simplebutton, props.style]}
      activeOpacity={0.9}>
      <Text {...props} style={[styles.text, props.textStyle]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  button: {
    height: scale(35),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  viewbuttonstyle: {
    alignItems: 'center',
  },
  simplebutton: {
    borderRadius: scale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 5,
    alignItems: 'center',
    paddingTop: 0,
    backgroundColor: Color.ColorOtherHeader,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  ButtonContainer: {
    width: '90%',
    borderRadius: scale(20),
    marginTop: scale(10),
    height: scale(35),
  },

  buttonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },

  text: {
    color: 'white',
    fontFamily: 'Lato-Regular',
    padding: 0,
    lineHeight: 21,
    textAlign: 'center',
    fontSize: scale(18),
  },
});

export default Button;
