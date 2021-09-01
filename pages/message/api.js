import http from '../../utils/http';
import openAPI from '../../utils/url';

// 消息列表
export const msgList = params => {
  return http({
    url: openAPI.msgList,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params
  });
}
