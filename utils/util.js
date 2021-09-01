import Toast from '../miniprogram_npm/@vant/weapp/toast/toast';
import moment from '../miniprogram_npm/moment/index';

const formatTime = date => {
  if (!(date instanceof Date)) date = new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const dateFormat = (date, fmt) => {
  if (!(date instanceof Date)) date = new Date(date);
  let ret;
  const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}

const violenceCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
}

const calTimeInterval = (startTime, endTime) => {
  var dateStart = new Date(startTime);
  var dateEnd = new Date(endTime);
  return (dateEnd - dateStart) / (1000 * 60 * 60 * 24);
}

const enumToArray = enumObj => {
  return Object.keys(enumObj).map(key => ({
    key,
    label: enumObj[key]
  }))
}

/**
 * 身份证号格式校验
 */
const provinces = {
  11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
  21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
  33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",
  42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",
  51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",
  63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
};
const idCardNoRegex = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
export const isValidIdCard = idCardNo => {
  let isViald = idCardNoRegex.test(idCardNo);
  if (isViald) {
     isViald = provinces[idCardNo.substr(0, 2)] ? true : false;
  }
  return isViald;
}

/**  
 * 通过身份证获取出生日期及性别
 * @param idCard 15/18位身份证号码   
 * @return JSON对象 
 *         sex：0-女、1-男；
 *         birthDay：yyyy-MM-dd
 */
const getBirthAndGenderFromIdDard = idCardNo => {
  let info = {};
  let birth = (idCardNo.length === 18) ? idCardNo.slice(6, 14) : idCardNo.slice(6, 12);
  // 18位：提取第17位数字；15位：提取最后一位数字
  let order = (idCardNo.length == 18) ? idCardNo.slice(-2,-1):idCardNo.slice(-1);
  info.birthDay = (idCardNo.length === 18) ? ([birth.slice(0, 4),
          birth.slice(4, 6), birth.slice(-2)
          ]).join('-') : ([
              '19' + birth.slice(0, 2), birth.slice(2, 4),
              birth.slice(-2)
          ]).join('-');
  // 余数为0代表女性，不为0代表男性        
  info.sex = (order % 2 === 0 ? 0 : 1);
  return info;
}

const isEmpty = value => {
  if (value === '' || value === undefined || value === null) {
    return true;
  }
  if (value instanceof Array && value.length === 0) {
    return true;
  } else if (value instanceof Object && Object.keys(value).length === 0) {
    return true;
  }
  return false;
}

const compareTime = (time1, time2) => {
  if (!(time1 instanceof Date)) {
    if (typeof time1 === 'string') {
      time1 = time1.replaceAll('-', '/');
    }
    time1 = new Date(time1);
  }
  if (!(time2 instanceof Date)) {
    if (typeof time2 === 'string') {
      time2 = time2.replaceAll('-', '/');
    }
    time2 = new Date(time2);
  }
  if (time1.getTime() > time2.getTime()) return 1;
  else if (time1.getTime() === time2.getTime()) return 0;
  else return -1;
}

const loading = (message) => {
  Toast.loading({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: message || '正在加载',
    selector: '#van-toast',
  });
}

const timeToLabel = time => {
  const timeTemp = moment(time);
  const today = moment().hour(0).minute(0).second(0).millisecond(0);
  const yestoday = moment().subtract(1, 'days').hour(0).minute(0).second(0).millisecond(0);
  if (timeTemp.isBefore(yestoday)) {
    return time;
  } else if (timeTemp.isBefore(today)) {
    return `昨天 ${timeTemp.format('HH:mm')}`;
  } else {
    return `今天 ${timeTemp.format('HH:mm')}`;
  }
}

const enumToList = (enums, keyLabel="key", valueLabel="value") => {
  return Object.keys(enums).map(key => ({
    [keyLabel]: key,
    [valueLabel]: enums[key]
  }));
}

module.exports = {
  formatTime,
  dateFormat,
  violenceCopy,
  calTimeInterval,
  enumToArray,
  isValidIdCard,
  getBirthAndGenderFromIdDard,
  isEmpty,
  compareTime,
  loading,
  timeToLabel,
  enumToList
}
