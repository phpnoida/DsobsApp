import axios from 'axios';
import {SERVER_PATH} from '../../config';
import RNFetchBlob from 'rn-fetch-blob';

export function requestAuthCode(data, callback, errCallback) {
  let requestPath = `${SERVER_PATH}user/auth`;
  const request = axios
    .post(requestPath, data)
    .then((res) => callback(res))
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}
export function verifyAuthCode(data, callback, errCallback) {
  let requestPath = `${SERVER_PATH}user/authVerify`;
  const request = axios
    .post(requestPath, data)
    .then((res) => callback(res))
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function getSchoolHouses(callback, errCallback) {
  let requestPath = `${SERVER_PATH}house`;
  const request = axios
    .get(requestPath)
    .then((res) => callback(res))
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function addUser(data, callback, errCallback) {
  let requestPath = `${SERVER_PATH}user?app=1`;
  const request = axios
    .post(requestPath, data)
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function submitContactForm(data, callback, errCallback) {
  let requestPath = `${SERVER_PATH}contactForm`;
  const request = axios
    .post(requestPath, data)
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function getUserProfile(userId, callback, errCallback) {
  //let requestPath = `${SERVER_PATH}user?id=${userId}`;
  let requestPath = `${SERVER_PATH}user`;
  const request = axios
    .get(requestPath, {headers: {Authorization: global.accessToken}})
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function getUserProfileFromDirectory(userId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}user/directory/profile?id=${userId}`;
  const request = axios
    .get(requestPath, {headers: {Authorization: global.accessToken}})
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function getProfessionList(callback, errCallback) {
  let requestPath = `${SERVER_PATH}user/proffession/list?app=1`;
  const request = axios
    .get(requestPath, {headers: {Authorization: global.accessToken}})
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function uploadProfilePic(body, callback, errCallback) {
  let requestPath = `${SERVER_PATH}utils/imageupload`;
  RNFetchBlob.fetch(
    'POST',
    requestPath,
    {
      'Content-Type': 'multipart/form-data',
      Authorization: global.accessToken,
    },
    body,
  )
    .then((resp) => {
      let bodyData = JSON.parse(resp.data);
      callback(bodyData);
    })

    .catch((err) => {
      handleError(err, errCallback);
    });
}

export function updateUserProfile(data, callback, errCallback) {
  let requestPath = `${SERVER_PATH}user?id=${global.userId}`;
  const request = axios
    .patch(requestPath, data, {headers: {Authorization: global.accessToken}})
    .then((res) => callback(res))
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function searchUser(userName, callback, errCallback) {
  let requestPath = `${SERVER_PATH}user?s=${userName}`;
  const request = axios
    .get(requestPath, {headers: {Authorization: global.accessToken}})
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      handleError(err, errCallback);
    });
  return {
    payload: request,
  };
}

export function doGetProfessionList(callback, errCallback) {
  let requestPath = `${SERVER_PATH}user/proffession/list`;
  const request = axios
    .get(requestPath, {headers: {Authorization: global.accessToken}})
    .then((res) => {
      callback(res);
    })
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
      console.log('UserAction-192');
      global.logoutAlert.show_loader(true);
    }
    if (errorData.message) {
      errCallback(err.response.status, errorData.message);
    } else {
      errCallback(err.response.status, err);
    }
  } else {
    errCallback('-1', err.toString());
  }
}
