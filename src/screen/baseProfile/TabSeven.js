import React from 'react';
import {Text, View, TouchableOpacity, Image, Alert} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {launchImageLibrary} from 'react-native-image-picker';
import Globalinclude from '../../globalInclude/Globalinclude';

const options = {
  title: 'Select Image',
  noData: true,
  maxWidth: 720,
  maxHeight: 1024,
  allowsEditing: false,
  storageOptions: {
    skipBackup: true,
    path: 'images',
    cameraRoll: true,
    waitUntilSaved: true,
  },
};

const launchImagePicker = (props) => {
  launchImageLibrary(options, (res) => {
    if (res) {
      if (res !== null) {
        if (res.didCancel) {
          Alert.alert('Cancel Image Selection!');
        } else {
          props.onSelectImage(res);
        }
      }
    }
  });
};

const TabSeven = (props) => {
  const {errorMessage} = props;
  return (
    <View style={g.mt45}>
      <Text style={[g.fs24, g.FHNB, g.mb20, g.colorBlack, g.txtCenter]}>
        Choose a Profile Photo
      </Text>
      <View style={[g.mb5, grid.rowdir, grid.justifyContentCenter]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => {
            launchImagePicker(props);
          }}>
          <View
            style={[
              g.bglightGray,
              g.br3,
              g.oh,
              {
                height: scale(144),
                width: scale(144),
                borderRadius: 100,
                borderWidth: 3,
                borderColor: '#2b3252',
              },
            ]}>
            {props.profileImg !== '' ? (
              <Image
                style={{aspectRatio: 1 / 1}}
                resizeMode="cover"
                source={{uri: props.profileImg}}
              />
            ) : (
              <Image
                style={{height: scale(144), width: scale(144)}}
                resizeMode="cover"
                source={Globalinclude.Assets.AppLogo}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <Text style={[g.fs18, g.FHNB, g.mb20, g.colorBlack, g.txtCenter]}>
        Pick a photo of your profile
      </Text>

      {props.profileImg !== '' ? (
        <View style={[grid.rowdir, grid.justifyContentCenter]}>
          <TouchableOpacity
            style={[g.btnL, {width: scale(150), height: scale(45)}]}
            onPress={(e) => {
              launchImagePicker(props);
            }}
            activeOpacity={0.8}>
            <Text style={[g.colorWhite, g.FHNR, g.fs15, g.txtCenter]}>
              Upload Photo
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default TabSeven;
