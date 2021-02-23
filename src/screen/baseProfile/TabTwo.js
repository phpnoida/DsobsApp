import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';

const concatSchoolAndHouse = (profileData) => {
  let string = '';

  string =
    profileData.house.charAt(0).toUpperCase() +
    profileData.house.slice(1).toLowerCase();

  if (profileData.section && profileData.section !== undefined) {
    string = string + ' ' + profileData.section;
  }
  return string.toUpperCase();
};

const TabTwo = (props) => {
  const {errorMessage, profileData} = props;
  return (
    <View style={g.mt45}>
      <Text style={[g.fs24, g.FHNB, g.mb15, g.colorBlack]}>
        School Details...
      </Text>
      <View style={[g.mb15]}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={[g.labeltext1]}>Batch</Text>
          <Text style={[g.colorRed]}>*</Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={() => props.contactToSchool('Batch')}
          style={[grid.rowdir, grid.alignItems, g.inputWhite]}>
          <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
            {profileData.batch}
          </Text>
          <View style={[styles.triangleShape, props.arrowColor]} />
        </TouchableOpacity>
        {errorMessage.batch && errorMessage.batch.length > 0 && (
          <Text style={[g.errorMsg, g.fs12]}>{errorMessage.batch}</Text>
        )}
      </View>

      <View style={[g.mb15]}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={[g.labeltext1]}>School Number</Text>
          <Text style={[g.colorRed]}>*</Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={() => props.contactToSchool('School Number')}
          style={[grid.rowdir, grid.alignItems, g.inputWhite]}>
          <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
            {profileData.schoolNumber}
          </Text>
          <View style={[styles.triangleShape, props.arrowColor]} />
        </TouchableOpacity>
      </View>

      <View style={[g.mb15]}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={[g.labeltext1]}>House</Text>
          <Text style={[g.colorRed]}>*</Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={() => props.contactToSchool('House')}
          style={[grid.rowdir, grid.alignItems, g.inputWhite]}>
          <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
            {concatSchoolAndHouse(profileData)}
          </Text>
          <View style={[styles.triangleShape, props.arrowColor]} />
        </TouchableOpacity>
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

export default TabTwo;
