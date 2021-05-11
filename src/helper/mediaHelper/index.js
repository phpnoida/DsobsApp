import React, {useRef, useState} from 'react';
import {
  Text,
  Dimensions,
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import Toast from '../../component/Toast';
import RNFetchBlob from 'rn-fetch-blob';

var re = /(?:\.([^.]+))?$/;

export const pickImage = async () => {
  let result = await ImagePicker.openPicker({
    includeBase64: false,
    cropping: false,
    includeExif: false,
    mediaType: 'photo',
    multiple: false,
  }).catch((err) => {
    console.log('err.toString()', err.toString());
    if (err.toString() === 'Error: User cancelled image selection') {
      ImagePicker.clean();
      Toast.show({
        title: 'Cancel Selection',
        text: 'User Cancelled Selection!',
        color: '#f39c12',
        timing: 2500,
      });
    }
  });
  return result;
};

export const uploadImage = (pickFile, childPath, mediaType) => {
  let object = null;
  try {
    let body = [];
    if (pickFile !== null) {
      var path = '';

      if (Platform.OS === 'android') {
        path = pickFile.path;
      } else if (Platform.OS === 'ios') {
        path = pickFile.sourceURL;
      }

      var ext = re.exec(path)[1];
      var timestamp = new Date().getTime().toString();
      let imageName = timestamp + '.' + ext;

      let imagePath =
        Platform.OS === 'ios' ? path.replace('file://', '') : path;

      let imageType = pickFile.mime;

      var imageData = {
        name: 'image',
        filename: imageName,
        type: imageType,
        data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
      };
      body.push(imageData);

      object = {};
      object.body = body;
      object.childPath = childPath;
      object.mediaType = mediaType;
    } else {
      Toast.show({
        title: 'Erorr While pick media',
        text: 'Unable to pick file choose another',
        color: '#f39c12',
        timing: 3000,
      });
    }
  } catch (error) {
    Toast.show({
      title: 'Erorr While pick media',
      text: 'Unable to pick file choose another',
      color: '#f39c12',
      timing: 3000,
    });
  }
  return object;
};
