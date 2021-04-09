import axios from 'axios';
import {SERVER_PATH} from '../../config';

export function getAlbums(params, callback, errCallback) {
  let requestPath = `${SERVER_PATH}imageGallery`;
  console.log('params', params);
  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
      params: params,
    })
    .then((res) => callback(res))
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function getGalleryCategory(callback, errCallback) {
  let requestPath = `${SERVER_PATH}imagegallery/images/categories`;

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

export function getSingleImageFromAlbum(params, callback, errCallback) {
  let requestPath = `${SERVER_PATH}imageGallery/images`;

  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
      params: params,
    })
    .then((res) => callback(res))
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function doUpdateImageInformation(
  imageId,
  payload,
  callback,
  errCallback,
) {
  let requestPath = `${SERVER_PATH}imageGallery/images?id=${imageId}`;

  const request = axios
    .patch(requestPath, payload, {
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

export function doFilterGallery(params, callback, errCallback) {
  let requestPath = `${SERVER_PATH}imageGallery/images/filter`;

  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
      params: params,
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
