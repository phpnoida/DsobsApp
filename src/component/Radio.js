import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Globalinclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';

export default class Radio extends Component {
  render() {
    const {title, onRadioSelect, selected, item, containerStyle} = this.props;

    return (
      <TouchableOpacity activeOpacity={1}>
        <View key={title} style={[styles.container, containerStyle]}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              onRadioSelect(item);
            }}>
            <View
              style={
                this.props.radioStyle
                  ? this.props.radioStyle
                  : Globalinclude.AppStyle.radioCircle
              }>
              {selected && (
                <View
                  style={
                    this.props.selectedStyle
                      ? this.props.selectedStyle
                      : Globalinclude.AppStyle.selectedRb
                  }
                />
              )}
            </View>

            <Text style={Globalinclude.AppStyle.radioText}>{title}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
