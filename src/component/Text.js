import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text} from 'react-native';
import Color from '../theme/Colors';
import {scale} from '../theme/Scalling';
const TextView = (props) => {
  return <StandardText {...props} />;
};

TextView.propTypes = {
  type: PropTypes.string,
};

const StandardText = (props) => (
  <Text
    style={[styles.textstyle, props.style]}
    numberOfLines={props.numberOfLines}>
    {props.text}
  </Text>
);

const styles = StyleSheet.create({
  textstyle: {
    color: Color.PrimaryFontColor,
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: scale(15),
    fontFamily: 'Lato-Regular',
  },
});

export default TextView;
