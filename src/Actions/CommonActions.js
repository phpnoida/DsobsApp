import axios from 'axios';
import {Platform} from 'react-native';
import {SERVER_PATH} from '../../config';
import RNFetchBlob from 'rn-fetch-blob';
import {getModel} from 'react-native-device-info';

export function getCountries(callback, errCallback) {
  let requestPath = `${SERVER_PATH}utils/countries`;
  const request = axios
    .get(requestPath, {headers: {Authorization: global.accessToken}})
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function getStates(countryId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}utils/states?name=${countryId}`;
  const request = axios
    .get(requestPath, {headers: {Authorization: global.accessToken}})
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function getCities(stateId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}utils/cities?name=${stateId}`;
  const request = axios
    .get(requestPath, {headers: {Authorization: global.accessToken}})
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function uploadMedia(childPath, body, callback, errCallback) {
  let requestPath = `${SERVER_PATH}${childPath}`;
  RNFetchBlob.fetch(
    'POST',
    requestPath,
    {
      'Content-Type': 'multipart/form-data',
      Authorization: global.accessToken,
    },
    body,
  )
    .then((resp) => {
      let bodyData = JSON.parse(resp.data);
      callback(bodyData);
    })

    .catch((err) => {
      handleError(err, errCallback);
    });
}

export function sendPresenceStatus(callback, errCallback) {
  let deviceType = '';
  let modelNumber = getModel();
  if (Platform.OS === 'android') {
    deviceType = '0';
  } else {
    deviceType = '1';
  }
  let requestPath = `${SERVER_PATH}utils/users/online?deviceType=${deviceType}&deviceModelNumber=${modelNumber}`;
  console.log('requestPath', requestPath);
  const request = axios
    .get(requestPath, {headers: {Authorization: global.accessToken}})
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function getPopNotification(callback, errCallback) {
  let requestPath = `${SERVER_PATH}utils/popFilter`;
  const request = axios
    .get(requestPath, {headers: {Authorization: global.accessToken}})
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function handleError(err, errCallback) {
  if (
    err.response &&
    err.response !== null &&
    err.response.data &&
    err.response.data !== null
  ) {
    let errorData = err.response.data;
    if (errorData.message) {
      errCallback(err.response.status, errorData.message);
    } else {
      errCallback(err.response.status, err);
    }
  } else {
    errCallback('-1', err);
  }
}
