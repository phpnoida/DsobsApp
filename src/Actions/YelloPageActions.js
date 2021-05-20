import axios from 'axios';
import {SERVER_PATH} from '../../config';

export function addYellowPage(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}yellowPages`;

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
export function editYellowPage(pageId, payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}yellowPages?id=${pageId}`;

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

export function doFitlerYellowPage(filterQuery, callback, errCallback) {
  let requestPath = `${SERVER_PATH}yellowPages/filter`;
  console.log('====================================');
  console.log(filterQuery);
  console.log('====================================');
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

export function getYellowPageAbout(callback, errCallback) {
  let requestPath = `${SERVER_PATH}yellowPages/aboutYp`;

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
export function getMyBusinessList(callback, errCallback) {
  let requestPath = `${SERVER_PATH}yellowPages/my`;

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
