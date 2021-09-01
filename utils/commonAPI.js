import openAPI from './url';
import http from './http';

// 国家城市列表
export const areaList = data => {
  return http({
    url: openAPI.areaList,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data
  });
}