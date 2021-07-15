import {Platform, Alert, PermissionsAndroid} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
const {config} = RNFetchBlob;

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
