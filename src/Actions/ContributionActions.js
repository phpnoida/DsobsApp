import axios from 'axios';
import {SERVER_PATH} from '../../config';

export function getContributions(filterPayload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}countributions`;
  console.log('filterPayload', filterPayload);
  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
      params: filterPayload,
    })
    .then(res => callback(res))
    .catch(err => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function getContributionDetail(contributeId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}countributions/${contributeId}`;

  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
    })
    .then(res => callback(res))
    .catch(err => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function getFilterData(callback, errCallback) {
  let requestPath = `${SERVER_PATH}countributions/status`;

  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
    })
    .then(res => callback(res))
    .catch(err => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function getCurrencyList(callback, errCallback) {
  let requestPath = `${SERVER_PATH}countributions/currency`;

  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
    })
    .then(res => callback(res))
    .catch(err => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function getComments(contributeId, filterObject, callback, errCallback) {
  let requestPath = `${SERVER_PATH}countributions/comment/${contributeId}`;

  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
      params: filterObject,
    })
    .then(res => callback(res))
    .catch(err => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function addUserComment(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}countributions/comment/`;

  const request = axios
    .post(requestPath, payload, {
      headers: {
        Authorization: global.accessToken,
        'content-type': 'application/json',
      },
    })
    .then(res => callback(res))
    .catch(err => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function updateUserComment(payload, commentId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}countributions/comment/${commentId}`;

  const request = axios
    .patch(requestPath, payload, {
      headers: {
        Authorization: global.accessToken,
        'content-type': 'application/json',
      },
    })
    .then(res => callback(res))
    .catch(err => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function removeUserComment(commentId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}countributions/comment/${commentId}`;

  const request = axios
    .delete(requestPath, {
      headers: {
        Authorization: global.accessToken,
        'content-type': 'application/json',
      },
    })
    .then(res => callback(res))
    .catch(err => {
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
      console.log('SocialEventAction-194');
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
