import http from '../../utils/http';
import openAPI from '../../utils/url';

// 今日团组
export const todayGroup = params => {
  return http({
    url: openAPI.todayGroup,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params
  });
}

// 关闭电子围栏
export const closeFence = params => {
  return http({
    url: openAPI.closeFence,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params
  });
}

// 打开电子围栏
export const openFence = data => {
  return http({
    url: openAPI.openFence,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data
  });
}
