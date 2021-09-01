import Multipart from '../lib/Multipart.min';
import openAPI from './url';

const devUrl = 'https://dev-yanxue-api.local.hiseas.com/yanxue/api';
const fatUrl = 'https://fat-yanxue-api.local.hiseas.com/yanxue/api';
const preUrl = 'https://yx-pre-yanxue-api.hiseas.com/yanxue/api';
const proUrl = 'https://fat-yanxue-api.local.hiseas.com/yanxue/api';
const zyUrl = 'http://192.168.23.194:19300/yanxue/api'; // zy
const fyjUrl = 'http://192.168.22.21:19300/yanxue/api';  // fyj

let pubUrl = preUrl;

export const switchEnv = env => {
  // 切换环境
  switch (env) {
    case 'dev':
      pubUrl = devUrl;
      break;
    case 'fat':
      pubUrl = fatUrl;
      break;
    case 'pre':
      pubUrl = preUrl;
      break;
    case 'pro':
      pubUrl = proUrl;
      break;
    case 'zy':
      pubUrl = zyUrl;
      break;
    case 'fyj':
      pubUrl = fyjUrl;
      break;
    default:
      pubUrl = devUrl;
      break;
  }
  // 清空缓存
  wx.clearStorageSync();
  // 跳转登录
  wx.reLaunch({
    url: '/pages/login/index',
  })
}

const http = (options) => {
  const defheader = {
    'content-type': 'application/x-www-form-urlencoded',
  }
  const token = wx.getStorageSync('token');
  return new Promise((resolve, reject) => {
    wx.request({
      url: pubUrl + options.url,
      timeout: 5000,
      method: options.method || "POST",
      data: options.data || {},
      header: {
        ...defheader,
        ...options.header,
        'Authorization': token
      },
      success: (res) => {
        if (res.data.code == '401') {
          wx.reLaunch({
            url: `/pages/login/index`
          });
        }
        if (res.data.code != 200) {
          wx.showToast({
            title: String(res.data.msg),
            icon: 'none',
          });
          reject(res);
        }
        resolve(res.data);
      },
      fail: (res) => {
        wx.showToast({
          title: JSON.stringify(res),
          icon: 'none',
        });
        reject(res);
      }
    })
  })
}

export default http;

// 单文件上传
export const uploadFile = file => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: pubUrl + openAPI.uploadFile,
      filePath: file.url,
      name: 'file',
      formData: { file: 'file' },
      success: res => {
        let response = JSON.parse(res.data);
        if (response.code === '200') {
          resolve(response);
        } else {
          wx.showToast({
            icon: 'error',
            title: res.data,
          });
          reject(res.data);
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'error',
          title: `文件上传失败：${err}`,
        });
        reject(err);
      }
    });
  })
}

// 多文件上传
export const multiUploadFile = files => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const filesData = files.map(item => ({ 
      name: 'files',  // 指定参数名称
      filePath: item.url
    }));
    new Multipart({
      fields,
      files: filesData
    }).submit(pubUrl + openAPI.multiUploadFile).then(res => {
      if (res.data.code === '200') {
        resolve(res.data);
      } else {
        wx.showToast({
          icon: 'error',
          title: res.data.msg || '文件上传失败',
        });
        reject(res.data);
      }
    }).catch(err => {
      wx.showToast({
        title: `文件上传失败`,
        icon: 'error',
      });
      reject(err);
    })
  })
}