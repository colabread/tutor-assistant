import http from '../../utils/http';
import openAPI from '../../utils/url';

export const login = (data) => {
  return http({
    url: openAPI.login,
    method: 'POST',
    header: {
      'content-type': 'application/json',
    },
    data
  })
}