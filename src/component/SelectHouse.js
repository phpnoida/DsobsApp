import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {scale} from '../theme/Scalling';
import g from '../theme/global';
import grid from '../theme/grid';
import Helper from '../helper/Helper';
import AppStyle from '../theme/ApplicationStyle';

let selectedIndex = -1;
export default class RadioButton extends Component {
  constructor(props) {
    super(props);
    selectedIndex = -1;
    this.state = {
      value: '',
      section: '',
    };
  }

  inflateSections = (sections) => {
    let arrayItems = [];
    sections.map((section, index) => {
      const component = (
        <View
          key={index.toString()}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            marginEnd: scale(10),
            marginStart: scale(10),
          }}>
          <TouchableOpacity
            style={AppStyle.radioCircle}
            onPress={() => {
              this.setState({section: section});
            }}>
            {this.state.section === section && (
              <View style={AppStyle.selectedRb} />
            )}
          </TouchableOpacity>
          <Text style={styles.radioText}>{section}</Text>
        </View>
      );
      arrayItems.push(component);
    });
    return arrayItems;
  };

  render() {
    const {PROP, onRadioSelect} = this.props;
    const {value} = this.state;

    return (
      <ScrollView style={AppStyle.fill}>
        <TouchableOpacity activeOpacity={1} style={{flex: 1}}>
          <View style={{flex: 1}}>
            <Text style={[g.fs18, g.FHNB, g.txtCenter, g.colorBlack, g.mb15]}>
              Select House
            </Text>
            <ScrollView style={[grid.flex1, {width: '100%'}]}>
              {PROP.map((res, index) => {
                console.log('res.section', index);
                return (
                  <View key={res.key} style={styles.container}>
                    <View
                      style={{
                        flex: 0.6,
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <TouchableOpacity
                        style={AppStyle.radioCircle}
                        onPress={() => {
                          selectedIndex = index;
                          this.setState({
                            value: res.key,
                          });
                        }}>
                        {value === res.key && (
                          <View style={AppStyle.selectedRb} />
                        )}
                      </TouchableOpacity>
                      <Text style={AppStyle.radioText}>{res.text}</Text>
                    </View>
                    {selectedIndex === index && (
                      <View>
                        {res.section && res.section.length > 0 ? (
                          <View
                            style={{
                              flex: 1.4,
                              flexGrow: 1,
                              flexDirection: 'row',
                              marginStart: scale(10),
                            }}>
                            {this.inflateSections(res.section)}
                          </View>
                        ) : (
                          <View />
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (this.state.value === '') {
                  Helper.ToastShow('Select House', 'fail');
                } else {
                  onRadioSelect(this.state.value, this.state.section);
                }
              }}>
              <Text style={[g.btnGrayLogin, g.mb10]}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  result: {
    marginTop: 20,
    color: 'white',
    fontWeight: '600',
    backgroundColor: '#F3FBFE',
  },
});
