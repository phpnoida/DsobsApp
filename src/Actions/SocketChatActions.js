import axios from 'axios';
import {SERVER_PATH} from '../../config';

export function doCreateGroup(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}chats/create`;
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
  let requestPath = `${SERVER_PATH}chats/edit/${groupId}`;

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

export function doGetChats(filterObject, callback, errCallback) {
  let requestPath = `${SERVER_PATH}chats`;

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

export function doAboutGroup(groupId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}chats/about-group/${groupId}`;
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

export function doGetGroupMessages(params, groupId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}chat-message/get-messages/${groupId}`;
  // console.log('requestPath', requestPath);
  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
      params: params,
    })
    .then(res => callback(res))
    .catch(err => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}


export function doGetBatchGroups(filterObject, callback, errCallback) {
  let requestPath = `${SERVER_PATH}group/batch-group`;

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

export function doSearchGroup(query, callback, errCallback) {
  let requestPath = `${SERVER_PATH}group/search`;

  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
      params: query,
    })
    .then(res => callback(res))
    .catch(err => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function doGetUserStatusForGroup(groupId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}group/user-status-for-group/${groupId}`;
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

export function doGetDiscoverGroups(filterObject, callback, errCallback) {
  let requestPath = `${SERVER_PATH}group/discover-group`;

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



export function doReportMessage(
  groupId,
  chatId,
  payload,
  callback,
  errCallback,
) {
  let requestPath = `${SERVER_PATH}chat/report-message/${groupId}/${chatId}`;

  console.log('requestPath', requestPath);
  console.log('payload', payload);

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

export function doHideMessage(groupId, messageId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}chat/hide-message/${groupId}/${messageId}`;

  console.log('====================================');
  console.log('requestPath', requestPath);
  console.log('====================================');

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

export function doRemoveMessage(groupId, messageId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}chat/message/${groupId}/${messageId}`;
  console.log('====================================');
  console.log('requestPath', requestPath);
  console.log('====================================');

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

export function doGetReportedMessageInfo(
  groupId,
  messageId,
  callback,
  errCallback,
) {
  let requestPath = `${SERVER_PATH}chat/reported-message-details/${groupId}/${messageId}`;

  console.log('requestPath', requestPath);
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

export function doSearchMessage(groupId, filterParams, callback, errCallback) {
  let requestPath = `${SERVER_PATH}chat/message/${groupId}`;
  //console.log('requestPath', requestPath, filterParams);
  const request = axios
    .get(requestPath, {
      headers: {Authorization: global.accessToken},
      params: filterParams,
    })
    .then(res => callback(res))
    .catch(err => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function doGetGroupSetting(callback, errCallback) {
  let requestPath = `${SERVER_PATH}group/settings`;
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

export function doSetGroupSetting(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}group/settings`;
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
