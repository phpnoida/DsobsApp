import React from 'react';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import getPath from '@flyerhq/react-native-android-uri-path';

export const permissionDocument = async () => {
  var status = await requestStoragePermission();
  if (status) {
    return await pickDocument();
  }
};

const pickDocument = async () => {
  try {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
    });
    if (res !== null) {
      return await uploadDoc(res, 'utils/imageupload?type=1', 3);
    }
  } catch (err) {
    console.log('err', err);
    Alert.alert('User Cancelled Selection!');
  }
};

export const uploadDoc = async (pickFile, childPath, mediaType) => {
  try {
    let body = [];
    var re = /(?:\.([^.]+))?$/;

    if (pickFile !== null) {
      var status = await requestStoragePermission();
      if (status) {
        let path = '';

        if (Platform.OS === 'android') {
          path = getPath(pickFile.uri);
        } else {
          path = pickFile.uri;
        }

        if (path !== undefined && path !== null && path !== '') {
          var ext = re.exec(path)[1];
          var timestamp = new Date().getTime().toString();
          let imageName = timestamp + '.' + ext;
          let imagePath =
            Platform.OS === 'ios' ? path.replace('file://', '') : path;
          let imageType = pickFile.type;
          var imageData = {
            name: 'image',
            filename: imageName,
            type: imageType,
            data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
          };
          body.push(imageData);
          let object = {body: body, childPath: childPath, mediaType: mediaType};
          return object;
        } else {
          Alert.alert(
            'Erorr While pick media',
            'Unable to pick file choose another',
          );
          return null;
        }
      } else {
        Alert.alert('Erorr While pick media', 'Permission denied');
        return null;
      }
    } else {
      Alert.alert(
        'Erorr While pick media',
        'Unable to pick file choose another',
      );
      return null;
    }
  } catch (error) {
    Alert.alert('Erorr While pick media', 'Unable to pick file choose another');
    return null;
  }
};

export const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const pm1 = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );
  const pm2 = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );

  if (pm1 && pm2) {
    return true;
  }

  const userResponse = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  ]);

  if (
    userResponse['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
    userResponse['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
  ) {
    return true;
  } else {
    return false;
  }
};
