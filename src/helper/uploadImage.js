import React from 'react';
import {Alert, Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import {uploadMedia} from '../Actions/CommonActions';

var re = /(?:\.([^.]+))?$/;

export const uploadMediaContent = (body, childPath, mediaType) => {
  return new Promise(function (resolve, reject) {
    uploadMedia(
      childPath,
      body,
      response => {
        console.log('====================================');
        console.log('childData', response);
        console.log('====================================');
        global.loader_ref.show_loader(0);
        if (response && response !== undefined && response !== null) {
          if (response.status && response.data && response.data !== null) {
            let childData = response.data.data;
            let object = {
              thumbnail: childData,
              fileName: childData,
              type: mediaType,
            };
            resolve(object);
          } else {
            reject(null);
          }
        } else {
          reject(null);
        }
      },
      (error, message) => {
        console.log('error', error);
        reject(null);
      },
    );
  });
};

/**
 *
 * API SECTION
 *
 */

export const pickImage = onPickMedia => {
  ImagePicker.openPicker({
    includeBase64: false,
    includeExif: false,
    mediaType: 'photo',
    multiple: false,
  })
    .then(images => {
      if (images !== null) {
        console.log('images', images);
        cropSingleImage(onPickMedia, images);
      }
    })
    .catch(err => {
      if (err.code === 'E_PICKER_CANCELLED') {
        onPickMedia(null);
        Alert.alert('Cancel Selection', 'User Cancelled Selection!');
      }
    });
};

export const cropSingleImage = (onPickMedia, images) => {
  let options = {
    cropping: true,
    path: images.path,
    multiple: true,
  };

  if (Platform.OS === 'ios') {
    options.freeStyleCropEnabled = true;
    options.cropperChooseText = 'Done';
    options.width = images.width;
    options.height = images.height;
  } else if (Platform.OS === 'android') {
    options.enableRotationGesture = true;
  }

  ImagePicker.openCropper(options)
    .then(image => {
      global.loader_ref.show_loader(1);
      uploadImage(image, 'utils/imageupload', 1, onPickMedia).then(result => {
        global.loader_ref.show_loader(0);
        onPickMedia(result);
      });
    })
    .catch(() => {
      onPickMedia(null);
    });
};

export const uploadImage = (pickFile, childPath, mediaType, onPickMedia) => {
  try {
    let body = [];
    if (pickFile !== null) {
      var path = pickFile.path;
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

      console.log('imageData', imageData);

      return new Promise(function (resolve, reject) {
        uploadMediaContent(body, childPath, mediaType)
          .then(data => {
            if (data !== undefined && data !== null) {
              data.imageInfo = pickFile;
              resolve(data);
            } else {
              reject(null);
            }
          })
          .catch(error => {
            console.log('====================================');
            console.log('error', error);
            console.log('====================================');
            reject(null);
          });
      });
    } else {
      onPickMedia(null);
      Alert.alert(
        'Erorr While pick media',
        'Unable to pick file choose another',
      );
    }
  } catch (error) {
    onPickMedia(null);
  }
};
