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

export function doSearchMessage(groupId, filterParams, callback, errCallback) {
  let requestPath = `${SERVER_PATH}chat-message/message/${groupId}`;
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
  let requestPath = `${SERVER_PATH}chats/settings`;
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
  let requestPath = `${SERVER_PATH}chats/settings`;
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

export function updateChatStatus(type, chatId, callback, errCallback) {
  let requestPath;

  if (type === 1) {
    requestPath = `${SERVER_PATH}chats/mute/${chatId}`;
  } else {
    requestPath = `${SERVER_PATH}chats/unmute/${chatId}`;
  }

  console.log('requestPath', requestPath, global.accessToken);

  const request = axios
    .patch(
      requestPath,
      {},
      {
        headers: {
          Authorization: global.accessToken,
          'content-type': 'application/json',
        },
      },
    )
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
