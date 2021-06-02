import axios from 'axios';
import {SERVER_PATH} from '../../config';

export function getNews(searchQuery, index, size, callback, errCallback) {
  let requestPath = '';
  if (searchQuery.length > 0) {
    requestPath = `${SERVER_PATH}news?s=${searchQuery}&index=${index}&size=${size}`;
  } else {
    requestPath = `${SERVER_PATH}news?index=${index}&size=${size}`;
  }

  console.log('News', requestPath);

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

export function getNewsCategoris(callback, errCallback) {
  let requestPath = `${SERVER_PATH}news/categories`;

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

export function doPostNews(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}news/user`;

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

export function doFilterNews(filters, index, size, callback, errCallback) {
  let requestPath = `${SERVER_PATH}news/filter?${filters}&index=${index}&size=${size}`;

  //console.log('filter request', requestPath);

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

export function handleError(err, errCallback) {
  if (
    err.response &&
    err.response !== null &&
    err.response.data &&
    err.response.data !== null
  ) {
    let errorData = err.response.data;
    if (err.response.status === 401) {
      console.log('NewsAction-80');
      global.logoutAlert.show_loader(true);
    }
    if (errorData.message) {
      errCallback(err.response.status, errorData.message);
    } else {
      errCallback(err.response.status, err);
    }
  } else {
    errCallback('-1', err);
  }
}
