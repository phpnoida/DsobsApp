import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';

const TabFive = (props) => {
  const {errorMessage} = props;
  return (
    <View style={g.mt45}>
      <Text style={[g.fs24, g.FHNB, g.mb15, g.colorBlack]}>
        Current Location Details...
      </Text>
      <View style={g.mb15}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={g.labeltext1}>Country</Text>
          <Text style={g.colorRed}>*</Text>
        </View>
        <TouchableOpacity
          style={[grid.rowdir, grid.alignItems, g.inputWhite]}
          onPress={() => {
            props.openCountryPicker();
          }}>
          <Text
            style={[grid.col, g.FHNR, {textTransform: 'capitalize'}]}
            numberOfLines={1}>
            {props.selectedCountry}
          </Text>
          <View style={[styles.triangleShape, props.arrowColor]} />
        </TouchableOpacity>
        {errorMessage.country && errorMessage.country.length > 0 && (
          <Text style={[g.errorMsg, g.pt5]}>{errorMessage.country}</Text>
        )}
      </View>

      <View style={g.mb15}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={g.labeltext1}>State</Text>
          <Text style={g.colorRed}>*</Text>
        </View>
        <TouchableOpacity
          style={[grid.rowdir, grid.alignItems, g.inputWhite]}
          onPress={() => {
            props.openStatePicker();
          }}>
          <Text
            style={[grid.col, g.FHNR, {textTransform: 'capitalize'}]}
            numberOfLines={1}>
            {props.selectedState}
          </Text>
          <View style={[styles.triangleShape, props.arrowColor]} />
        </TouchableOpacity>
        {errorMessage.state && errorMessage.state.length > 0 && (
          <Text style={[g.errorMsg, g.pt5]}>{errorMessage.state}</Text>
        )}
      </View>

      <View style={g.mb15}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={g.labeltext1}>City</Text>
          <Text style={g.colorRed}>*</Text>
        </View>
        <TouchableOpacity
          style={[grid.rowdir, grid.alignItems, g.inputWhite]}
          onPress={() => {
            props.openCityPicker();
          }}>
          <Text
            style={[grid.col, g.FHNR, {textTransform: 'capitalize'}]}
            numberOfLines={1}>
            {props.selectedCity}
          </Text>
          <View style={[styles.triangleShape, props.arrowColor]} />
        </TouchableOpacity>
        {errorMessage.city && errorMessage.city.length > 0 && (
          <Text style={[g.errorMsg, g.pt5]}>{errorMessage.city}</Text>
        )}
      </View>

      <View style={g.mb15}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={g.labeltext1}>Pin No./Area Code</Text>
        </View>
        <TextInput
          underlineColorAndroid="transparent"
          style={g.inputWhite}
          value={props.pinCode}
          onChangeText={(pinCode) => props.inputHandler('pinCode', pinCode)}
          placeholder="Pincode"
          placeholderTextColor={'#6e6e6e'}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  triangleShape: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#dddddd',
    marginLeft: 8,
  },
});
export default TabFive;
