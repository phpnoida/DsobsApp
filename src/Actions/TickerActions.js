import axios from 'axios';
import {SERVER_PATH} from '../../config';

export function getCategories(callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/categories`;

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

export function addPost(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts`;

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

export function editPost(payload, postId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts?id=${postId}`;

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

export function doFitlerPost(filterQuery, callback, errCallback) {
  console.log('filterQuery', filterQuery);
  let requestPath = `${SERVER_PATH}posts/feed`;
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

export function doGetMypost(callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/myfeed`;
  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
    })
    .then((res) => callback(res))
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function getUserFollowing(callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/following`;

  console.log('global.accessToken', global.accessToken);
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

export function getPostLikes(postId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/likes?postId=${postId}`;
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
export function doLikePost(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/likes`;
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

export function doDislikePost(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/likes`;

  console.log('====================================');
  console.log('payload', payload);
  console.log('global.accessToken', global.accessToken);
  console.log('====================================');
  const request = axios
    .delete(requestPath, {
      headers: {
        Authorization: global.accessToken,
        'content-type': 'application/json',
      },
      data: payload,
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
