import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {View} from 'native-base';
import Color from '../theme/Colors';

export default class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loading: 0,
    };
    this.show_loader = this.show_loader.bind(this);
  }

  show_loader(is_loader) {
    this.setState({is_loading: is_loader});
  }

  render() {
    if (this.state.is_loading === 0) {
      return <View />;
    }
    return (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color={Color.ColorPrimary} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  loaderStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
