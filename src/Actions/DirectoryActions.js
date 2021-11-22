import axios from 'axios';
import {SERVER_PATH} from '../../config';

export function getDirectory(searchType, searchQuery, callback, errCallback) {
  let requestPath = `${SERVER_PATH}user/directory?type=${searchType}&s=${searchQuery}`;
  
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

export function doFilterDirectory(filterQuery, callback, errCallback) {
  let requestPath = `${SERVER_PATH}user/directory`;
  
  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
      params: filterQuery,
    })
    .then((res) => callback(res))
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function logDirectory(callback, errCallback) {
  let requestPath = `${SERVER_PATH}user/directory/logs`;
  
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
