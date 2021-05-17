import axios from 'axios';
import {SERVER_PATH} from '../../config';

export function getWorkCategory(callback, errCallback) {
  let requestPath = `${SERVER_PATH}ventures/categories`;

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
export function searchWorkCategory(filterQuery, callback, errCallback) {
  let requestPath = `${SERVER_PATH}ventures/categories`;

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

export function addSocialWork(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}ventures`;

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

export function doFitlerSocialWork(filterQuery, callback, errCallback) {
  let requestPath = `${SERVER_PATH}ventures/filter`;
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

export function doSearchSocialWork(filterQuery, callback, errCallback) {
  let requestPath = `${SERVER_PATH}ventures`;
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

export function getComments(filterObject, callback, errCallback) {
  let requestPath = `${SERVER_PATH}ventures/comment/venture`;

  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
      params: filterObject,
    })
    .then((res) => callback(res))
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function addUserComment(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}ventures/comment`;

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

export function updateUserComment(payload, commentId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}ventures/comment?id=${commentId}`;

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

export function removeUserComment(commentId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}ventures/comment?id=${commentId}`;

  const request = axios
    .delete(requestPath, {
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
