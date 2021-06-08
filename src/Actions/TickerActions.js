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

export function doFollowUser(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/follow`;
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

export function doUnFollowUser(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/follow`;
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

export function getPostLikes(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/likes`;
  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
      params: payload,
    })
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

export function getComments(filterObject, callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/comment/post`;

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
  let requestPath = `${SERVER_PATH}posts/comment`;

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
  let requestPath = `${SERVER_PATH}posts/comment?id=${commentId}`;

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
  let requestPath = `${SERVER_PATH}posts/comment?id=${commentId}`;

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

export function doReportPost(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/report`;
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

export function getUserPostSettings(callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/settings`;

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

export function getUserNotificationSettings(callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/notification/settings`;

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

export function doSetUserPostSettings(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/settings`;
  const request = axios
    .put(requestPath, payload, {
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

export function doSetUserNotificationSettings(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}posts/notification/settings`;
  const request = axios
    .put(requestPath, payload, {
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
