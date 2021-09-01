import http from '../../utils/http';
import openAPI from '../../utils/url';

// 任务
export const page = (params) => {
  return http({
    url: openAPI.taskPage,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params
  });
}

export const detail = params => {
  return http({
    url: openAPI.taskDetail,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params
  });
}

// 打卡
export const clockIn = data => {
  return http({
    url: openAPI.clockIn,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data
  });
}

export const cancelClockIn = data => {
  return http({
    url: openAPI.cancelClockIn,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data
  });
}

export const clockInDetail = params => {
  return http({
    url: openAPI.clockInDetail,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params
  });
}

// 相册管理
export const photoList = params => {
  return http({
    url: openAPI.photoList,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params
  });
}

export const addPhoto = data => {
  return http({
    url: openAPI.addPhoto,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data
  });
}

export const deletePhoto = data => {
  return http({
    url: openAPI.deletePhoto,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data
  });
}

// 通讯录
export const phoneBookList = params => {
  return http({
    url: openAPI.phoneBookList,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params
  });
}

// 出行名单
export const nameList = params => {
  return http({
    url: openAPI.nameList,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params
  });
}

// 绑定设备
export const bindDevice = data => {
  return http({
    url: openAPI.bindDevice,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data
  });
}

// 取消绑定设备
export const cancelBindDevice = params => {
  return http({
    url: openAPI.cancelBindDevice,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params
  });
}
