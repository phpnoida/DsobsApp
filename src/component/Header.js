import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Font from '../theme/Fonts';
import {scale} from '../theme/Scalling';

const HeaderView = (props) => {
  return <StandardHeader {...props} />;
};

HeaderView.propTypes = {
  type: PropTypes.string,
};

const StandardHeader = (props) => {
  return (
    <View style={styles.headerContainer}>
      {props.leftIcon && (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            props.onLeftPress();
          }}>
          <Image
            source={props.leftIcon}
            style={styles.iconView}
            resizeMethod={'auto'}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.textstyle}>{props.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textstyle: {
    color: 'white',
    textAlign: 'left',
    flexWrap: 'wrap',
    fontSize: scale(16),
    fontFamily: Font.Bold,
    letterSpacing: 0,
    marginStart: scale(10),
    marginEnd: scale(10),
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(54),
    paddingStart: scale(12),
    paddingEnd: scale(12),
  },
  iconContainer: {
    height: scale(36),
    width: scale(36),
    justifyContent: 'center',
  },
  iconView: {
    height: scale(24),
    width: scale(24),
    alignSelf: 'center',
  },
});

export default HeaderView;
