import axios from 'axios';
import {SERVER_PATH} from '../../config';

export function getVideos(searchQuery, callback, errCallback) {
  let requestPath = '';
  if (searchQuery.length > 0) {
    requestPath = `${SERVER_PATH}videoGallery?s=${searchQuery}`;
  } else {
    requestPath = `${SERVER_PATH}videoGallery`;
  }

  const request = axios
    .get(requestPath, {headers: {Authorization: global.accessToken}})
    .then((res) => callback(res))
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function getVideoCategories(callback, errCallback) {
  let requestPath = `${SERVER_PATH}videoGallery/categories`;

  const request = axios
    .get(requestPath, {headers: {Authorization: global.accessToken}})
    .then((res) => callback(res))
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function doPostUserVideo(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}videoGallery/user`;

  const request = axios
    .post(requestPath, payload, {
      headers: {
        Authorization: global.accessToken,
        'content-type': 'application/json',
      },
    })
    .then((res) => callback(res))
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
    console.log('errorData', errorData);
    if (errorData.message) {
      errCallback(err.response.status, errorData.message);
    } else {
      errCallback(err.response.status, err);
    }
  } else {
    errCallback('-1', err);
  }
}
