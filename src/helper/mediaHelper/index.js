import {Platform, Alert, PermissionsAndroid} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {uploadMedia} from '../../Actions/CommonActions';
const {config} = RNFetchBlob;

var re = /(?:\.([^.]+))?$/;

export const pickImage = async () => {
  let result = await ImagePicker.openPicker({
    includeBase64: false,
    cropping: false,
    includeExif: false,
    mediaType: 'photo',
    multiple: false,
  }).catch((err) => {
    if (err.toString() === 'Error: User cancelled image selection') {
      ImagePicker.clean();
      Alert.alert('Cancel Selection', 'User Cancelled Selection!');
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
      Alert.alert(
        'Erorr While pick media',
        'Unable to pick file choose another',
      );
    }
  } catch (error) {
    Alert.alert('Erorr While pick media', 'Unable to pick file choose another');
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
      Alert.alert('Uploading Failed', message);
    },
  );
};

export const hasPermission = async () => {
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

export const _downloadContent = async (file) => {
  if (Platform.OS === 'android') {
    let status = await hasPermission();
    if (!status) {
      Alert.alert(
        'Permission Denied',
        'You denied permission please grant it from settings',
      );
      return false;
    } else {
      return await downloadData(file);
    }
  } else {
    return await downloadData(file);
  }
};

export const downloadData = async (file) => {
  let newImgUri = file.lastIndexOf('/');
  let imageName = file.substring(newImgUri);

  let extension = imageName.split('.')[1];

  let dirs = RNFetchBlob.fs.dirs;
  let path =
    Platform.OS === 'ios'
      ? dirs['MainBundleDir'] + imageName
      : dirs.PictureDir + imageName;

  let downloadOptions = {
    fileCache: true,
    appendExt: extension,
    indicator: true,
    IOSBackgroundTask: true,
    path: path,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      path: path,
      description: 'Image',
    },
  };

  let status = await config(downloadOptions)
    .fetch('GET', file.replace(/ /g, '%20'))
    .then((res) => {
      return true;
    })
    .catch(() => {
      return false;
    });
  return status;
};
