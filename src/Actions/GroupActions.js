import axios from 'axios';
import {SERVER_PATH} from '../../config';

export function doCreateGroup(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}group/create`;

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

export function doUpdateGroup(groupId, payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}group/edit/${groupId}`;

  console.log('requestPath', requestPath);

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

export function doGetGroups(callback, errCallback) {
  let requestPath = `${SERVER_PATH}group`;

  const request = axios
    .get(requestPath, {headers: {Authorization: global.accessToken}})
    .then(res => callback(res))
    .catch(err => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function doJoinGroup(groupId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}group/join-request/${groupId}`;

  const request = axios
    .post(requestPath, null, {
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

export function doAboutGroup(groupId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}group/about-group/${groupId}`;
  const request = axios
    .get(requestPath, {headers: {Authorization: global.accessToken}})
    .then(res => callback(res))
    .catch(err => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function doAcceptUserRequest(
  mode,
  groupId,
  userId,
  callback,
  errCallback,
) {
  let requestPath = '';

  if (mode === 1) {
    requestPath = `${SERVER_PATH}group/accept-user-request/${groupId}/${userId}`;
  } else {
    requestPath = `${SERVER_PATH}group/reject-user-request/${groupId}/${userId}`;
  }

  console.log('requestPath', requestPath);

  const request = axios
    .post(requestPath, null, {
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

export function doExitFromGroup(groupId, userId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}group/remove-user/${groupId}/${userId}`;

  const request = axios
    .post(requestPath, null, {
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

export function doUpdateGroupAdmin(
  mode,
  groupId,
  userId,
  callback,
  errCallback,
) {
  let requestPath = '';

  if (mode === 1) {
    requestPath = `${SERVER_PATH}group/make-admin/${groupId}/${userId}`;
  } else {
    requestPath = `${SERVER_PATH}group/remove-admin/${groupId}/${userId}`;
  }

  console.log('requestPath', requestPath);

  const request = axios
    .post(requestPath, null, {
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
