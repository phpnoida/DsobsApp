
import {Platform} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from '../../component/Toast';
import RNFetchBlob from 'rn-fetch-blob';
import {uploadMedia} from '../../Actions/CommonActions';

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

export const uploadMediaContent = (body, childPath, mediaType, onPickMedia) => {
  uploadMedia(
    childPath,
    body,
    (response) => {
      if (response && response !== undefined && response !== null) {
        if (response.status && response.data && response.data !== null) {
          let childData = response.data.data;
          let object = {
            thumbnail: childData,
            fileName: childData,
            type: mediaType,
          };
          onPickMedia(object);
        } else {
          onPickMedia(null);
        }
      } else {
        onPickMedia(null);
      }
    },
    (error, message) => {
      onPickMedia(null);
      Toast.show({
        title: 'Uploading Failed',
        text: message,
        color: '#f39c12',
        timing: 5000,
      });
    },
  );
};
