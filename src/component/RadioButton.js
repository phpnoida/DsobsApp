import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {scale} from '../theme/Scalling';
import Globalinclude from '../globalInclude/Globalinclude';

/**
 * this is used when we have complete array and we just show by signle view only
 **/
class RadioButton extends Component {
  state = {
    value: null,
  };

  render() {
    const {PROP, onRadioSelect, defaultSelected, capitalize} = this.props;
    const {value} = this.state;

    return (
      <ScrollView
        style={Globalinclude.AppStyle.fill}
        showsVerticalScrollIndicator={false}>
        <View style={Globalinclude.AppStyle.fill}>
          {PROP.map((res, index) => {
            return (
              <TouchableOpacity
                key={index.toString()}
                style={styles.container}
                onPress={() => {
                  onRadioSelect(res);
                  this.setState({
                    value: res.key,
                  });
                }}>
                <View style={Globalinclude.AppStyle.fillRowCross}>
                  <View style={Globalinclude.AppStyle.radioCircle}>
                    {(value === res.key || res.text === defaultSelected) && (
                      <View style={Globalinclude.AppStyle.selectedRb} />
                    )}
                  </View>
                  <Text
                    style={[
                      Globalinclude.AppStyle.radioText,
                      {textTransform: capitalize ? 'capitalize' : 'none'},
                    ]}>
                    {res.text}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default RadioButton;
