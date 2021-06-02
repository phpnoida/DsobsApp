import axios from 'axios';
import {SERVER_PATH} from '../../config';

export function doFilterTeachers(filterQuery, callback, errCallback) {
  let requestPath = `${SERVER_PATH}teacher`;
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

export function doGetAllCategories(callback, errCallback) {
  let requestPath = `${SERVER_PATH}teacher/categories?type=2`;

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

export function handleError(err, errCallback) {
  if (
    err.response &&
    err.response !== null &&
    err.response.data &&
    err.response.data !== null
  ) {
    let errorData = err.response.data;
    if (err.response.status === 401) {
      console.log('TeacherAction-48');
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
