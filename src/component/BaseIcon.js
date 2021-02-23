import React from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import PropTypes from 'prop-types';
import {scale} from '../theme/Scalling';

const BaseIcon = ({
  containerStyle,
  iconSize,
  iconColor,
  iconType,
  iconName,
}) => (
  <View
    style={[containerStyle, {justifyContent: 'center', alignItems: 'center'}]}>
    <Icon size={iconSize} color={iconColor} type={iconType} name={iconName} />
  </View>
);

BaseIcon.propTypes = {
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  iconType: PropTypes.string,
  iconName: PropTypes.string,
};

BaseIcon.defaultProps = {
  containerStyle: {},
  iconSize: scale(20),
  iconColor: '#2b3252',
  iconType: 'material',
  iconName: '',
};

export default BaseIcon;
