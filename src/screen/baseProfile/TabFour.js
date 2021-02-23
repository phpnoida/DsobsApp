import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import Globalinclude from '../../globalInclude/Globalinclude';

const TabFour = (props) => {
  const {errorMessage} = props;
  return (
    <View style={g.mt45}>
      <Text style={[g.fs24, g.FHNB, g.mb15, g.colorBlack]}>
        Current Professional Details...
      </Text>
      <View style={g.mb15}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={g.labeltext1}>Profession</Text>
          <Text style={g.colorRed}>*</Text>
        </View>
        <TouchableOpacity
          style={g.inputWhite}
          onPress={() => {
            props.openProfessionList();
          }}>
          <Text>{props.selectedProfession}</Text>
        </TouchableOpacity>
        {errorMessage.profession && errorMessage.profession.length > 0 && (
          <Text style={[g.errorMsg, g.fs12]}>{errorMessage.profession}</Text>
        )}
      </View>
      <View style={g.mb15}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={g.labeltext1}>Designation</Text>
        </View>
        <TextInput
          underlineColorAndroid="transparent"
          style={[g.inputWhite]}
          autoCapitalize="words"
          placeholder="Enter your text here"
          value={props.designation}
          onChangeText={(designation) =>
            props.inputHandler('designation', designation)
          }
        />
      </View>

      <View style={g.mb15}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={g.labeltext1}>Company</Text>
        </View>
        <TextInput
          underlineColorAndroid="transparent"
          style={g.inputWhite}
          autoCapitalize="words"
          placeholder="Enter your text here"
          value={props.companyName}
          onChangeText={(company) => props.inputHandler('company', company)}
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
  otherGenderContainer: {
    marginStart: scale(15),
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  defaultOtherGender: {
    width: scale(14),
    height: scale(14),
    backgroundColor: '#ced4da',
    borderRadius: 2,
  },
});

export default TabFour;
