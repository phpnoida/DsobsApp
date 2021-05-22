import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {View} from 'native-base';
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
        {/* BEGIN METHOD FOR DISPLAY LOADER VIEW */}
        <ActivityIndicator size="large" color="black" />
        {/* END METHOD FOR DISPLAY LOADER VIEW */}
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
