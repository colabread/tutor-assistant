import { calTimeInterval } from './util';

export const calTimeIntervalLabel1 = (startTime, endTime) => {
  let timeInterval = calTimeInterval(startTime, endTime) + 1;
  return `${startTime}-${endTime}（${timeInterval}天）`;
}

export const calTimeIntervalLabel2 = (startTime, endTime) => {
  let timeInterval = calTimeInterval(startTime, endTime) + 1;
  return `${cutYear(startTime)}-${cutYear(endTime)}（${timeInterval}天）`;
}

export const filterUnImageFile = files => {
  const imagePrefix = 'jpg,jpeg,png,JPG,JPEG,PNG';
  return files.filter(item => {
    let index = item.url.lastIndexOf('.');
    let prefix = item.url.substring(index + 1);
    return imagePrefix.indexOf(prefix) !== -1;
  })
}

// 对于获取地理位置的封装
export const getPosition = (callback) => {
  wx.getLocation({
    success: (res) => {
      const latitude = res.latitude
      const longitude = res.longitude
      wx.chooseLocation({
        latitude,
        longitude,
        scale: 18,
        success: (res) => {
          if (res.name) {
            let address = res.name;
            callback(address);
          } else {
            wx.showToast({
              icon: 'none',
              title: '请选择一个确定的位置',
            })
          }
        },
        fail: () => {
          wx.showToast({
            icon: 'none',
            title: '获取位置失败',
          });
        }
      })
    },
    fail: () => {
      wx.showModal({
        title: '获取经纬度失败',
        content: '是否打开权限设置',
        success: function({ confirm }) {
          if (confirm) wx.openSetting();
        }
      })
    }
  })
}

export const cutYear = timeStr => {
  let index = timeStr.indexOf('-');
  return timeStr.substring(index + 1);
}

// 路线规划，point：终点经纬度
export const openRoutePlan = (point) => {
  // let plugin = requirePlugin('routePlan');
  let key = '4BZBZ-R56L5-CZPIU-QALSV-QUJOV-X5BC4';
  let referer = '研学智行平台';
  let endPoint = JSON.stringify({
    name: 'china',
    latitude: point.latitude,
    longitude: point.longitude
  });
  wx.navigateTo({
    url: `plugin://routePlan/index?key=${key}&referer=${referer}&endPoint=${endPoint}&mode=walking`,
  });
}
