import axios from 'axios';
import {SERVER_PATH} from '../../config';

export function getJobNature(callback, errCallback) {
  let requestPath = `${SERVER_PATH}jobs/nature`;

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

export function addJobData(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}jobs`;

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

export function editJobs(pageId, payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}jobs?id=${pageId}`;

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

export function doFilterJobs(filterQuery, callback, errCallback) {
  let requestPath = `${SERVER_PATH}jobs/filter`;
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

export function getMyJobs(callback, errCallback) {
  let requestPath = `${SERVER_PATH}jobs/my`;

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

export function applyForJob(payload, callback, errCallback) {
  let requestPath = `${SERVER_PATH}jobs/application`;

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

export function doFilterCities(filterQuery, callback, errCallback) {
  let requestPath = `${SERVER_PATH}jobs/cities`;
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
export function doGetAppliedUsers(jobId, callback, errCallback) {
  let requestPath = `${SERVER_PATH}jobs/application?jobId=${jobId}`;
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
