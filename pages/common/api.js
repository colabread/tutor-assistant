import http from '../../utils/http';
import openAPI from '../../utils/url';

// 预警名单
export const alarmList = params => {
  return http({
    url: openAPI.alarmList,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params
  });
}

// 查询围栏信息
export const searchFence = params => {
  return http({
    url: openAPI.searchFence,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params
  });
}
