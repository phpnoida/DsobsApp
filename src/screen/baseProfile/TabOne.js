import React from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';

const TabOne = (props) => {
  const {errorMessage, profileData} = props;
  return (
    <View style={g.mt45}>
      <Text style={[g.fs24, g.FHNB, g.mb15, g.colorBlack]}>My name is...</Text>
      <View style={[grid.rowdir, g.mb15]}>
        <View style={[grid.col, g.mr5]}>
          <View style={[grid.rowdir, grid.alignItemsTop]}>
            <Text style={[g.labeltext1]}>Prefix</Text>
          </View>
          <TextInput
            underlineColorAndroid="transparent"
            style={[g.inputWhite]}
            value={props.prefix}
            placeholder="Enter your text here"
            onChangeText={(value) => props.inputHandler('prefix', value)}
          />
        </View>
        <View style={[grid.col, g.ml5]}>
          <View style={[grid.rowdir, grid.alignItemsTop]}>
            <Text style={[g.labeltext1]}>Pet Name</Text>
          </View>
          <TextInput
            underlineColorAndroid="transparent"
            style={[g.inputWhite]}
            value={props.petName}
            placeholder="Enter your text here"
            onChangeText={(petName) => props.inputHandler('petName', petName)}
          />
        </View>
      </View>

      <View style={g.mb15}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={[g.labeltext1]}>First Name</Text>
          <Text style={[g.colorRed]}>*</Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => props.contactToSchool('Primary')}>
          <Text style={[g.inputWhite]}>{profileData.firstName}</Text>
        </TouchableOpacity>

        {errorMessage.firstName && errorMessage.firstName.length > 0 && (
          <Text style={[g.errorMsg, g.pt5]}>{errorMessage.firstName}</Text>
        )}
      </View>
      <View style={g.mb15}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={g.labeltext1}>Middle and Last Name</Text>
          <Text style={[g.colorRed]}>*</Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => props.contactToSchool('Primary')}>
          <Text style={[g.inputWhite]}>
            {props.middleName && props.middleName !== undefined
              ? ` ${props.middleName} {profileData.lastName}`
              : profileData.lastName}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TabOne;
