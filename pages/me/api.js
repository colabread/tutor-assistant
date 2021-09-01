import http from '../../utils/http';
import openAPI from '../../utils/url';

export const setBasicInfo = data => {
  return http({
    url: openAPI.setBasicInfo,
    method: 'PUT',
    header: {
      'content-type': 'application/json'
    },
    data
  });
}

export const basicInfoDetail = params => {
  return http({
    url: openAPI.basicInfoDetail,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params
  });
}

export const taskStatistics = params => {
  return http({
    url: openAPI.taskStatistics,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params
  });
}