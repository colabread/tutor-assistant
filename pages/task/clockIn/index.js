import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import { clockInStateEnum } from '../../../utils/enums';
import { clockInDetail, clockIn, cancelClockIn } from '../api';
import { multiUploadFile } from '../../../utils/http';
import { unNegativeIntegerRegex } from '../../../utils/regex';
import { isEmpty, dateFormat, compareTime } from '../../../utils/util';
import { getPosition, filterUnImageFile } from '../../../utils/businessUtils';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskDetail: {},
    taskPoint: {},
    postData: {
      clockInPersons: [],
      photoList: []
    },
    clockInRecords: [],
    enums: {},
    canClockIn: true, // 是否可以打卡，用于做权限判断
  },

  initEnums() {
    this.setData({
      enums: {
        clockInStateEnum
      }
    })
  },

  changeValue({ detail, currentTarget: { dataset: { type } } }) {
    const { postData } = this.data;
    postData[type] = detail;
    this.setData({ postData });
  },

  changeArrayValue({ detail, currentTarget: { dataset: { type, index } } }) {
    const { postData } = this.data;
    postData.clockInPersons[index][type] = detail;
    this.setData({ postData });
  },

  beforeRead({ detail: { callback, file } }) {
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '上传中',
      selector: '#van-toast',
    });
    callback(true);
  },

  afterRead({ detail: { file } }) {
    const waitFiles = filterUnImageFile(file);
    multiUploadFile(waitFiles).then(res => {
      const { postData } = this.data;
      res.data.forEach(item => {
        postData.photoList.unshift({
          url: item.url,
          name: item.name,
        });
      });
      this.setData({ postData }, () => { Toast.clear(); });
    }).catch(e => {
      Toast.clear();
    }).finally(() => {
      Toast.clear();
    })
  },

  deletePhoto({ detail: { index } }) {
    const { postData } = this.data;
    postData.photoList.splice(index, 1);
    this.setData({ postData });
  },

  getClockInDetail(clockInId, clockInType) {
    clockInDetail({ taskClockInId: clockInId }).then(res => {
      let detail = res.data;
      const { postData, canClockIn } = this.data;
      postData.studentNum = detail.studentActualNum;
      postData.remark = detail.remark;
      postData.photoList = detail.taskPhotos?.map(item => ({
        name: item.taskPhotosId,
        url: item.imageUrl
      })) || [];
      if (clockInType === 'board' && detail.clockInPersons && detail.clockInPersons.length) {
        postData.clockInPersons = detail.clockInPersons;
      }
      let clockInRecords = detail.clockInRecords || [];
      // 根据当前打卡点的时间判断是否可以打卡（只能打当天以及过去的，不能打将来的）
      let canClockInTemp = Date.now() >= new Date(detail.clockInDate).getTime();
      this.setData({ postData, clockInRecords, canClockIn: canClockIn && canClockInTemp });
    })
  },

  // 一般打卡的数据验证
  validCanCommonClockIn() {
    const { taskDetail, postData } = this.data;
    if (isEmpty(postData.studentNum)) {
      wx.showToast({
        icon: 'none',
        title: '请输入人数',
      });
      return false;
    }
    if (!unNegativeIntegerRegex.test(postData.studentNum)) {
      wx.showToast({
        icon: 'none',
        title: '请输入非负整数',
      });
      return false;
    }
    if (postData.studentNum !== taskDetail.studentNum && isEmpty(postData.remark)) {
      wx.showToast({
        icon: 'none',
        title: '实到与应到人数不符，请填写原因',
      });
      return false;
    }
    if (!isEmpty(postData.remark) && postData.remark.length > 200) {
      wx.showToast({
        icon: 'none',
        title: '备注最多200字',
      });
      return false;
    }
    if (isEmpty(postData.photoList)) {
      wx.showToast({
        icon: 'none',
        title: '请上传照片',
      });
      return false;
    }
    if (postData.photoList.length > 9) {
      wx.showToast({
        icon: 'none',
        title: '最多上传9张照片',
      });
      return false;
    }
    return true;
  },

  // 执行一般打卡
  doCommonClockIn() {
    getPosition(address => {
      const { postData, taskPoint } = this.data;
      let data = {
        "address": address,
        "taskPhotos": postData.photoList.map(item => {
          let img = { imageUrl: item.url };
          if (item.name.indexOf('.') === -1) {
            img.taskPhotosId = item.name;
          }
          return img;
        }),
        "remark": postData.remark,
        "taskClockInId": taskPoint.clockInId,
        studentActualNum: postData.studentNum
      };
      this.doClockIn(data);
    });
  },

  // 一般打卡
  commonClockIn() {
    // 先做数据验证
    if (!this.validCanCommonClockIn()) return;
    const { postData, taskDetail } = this.data;
    // 检查人数
    if (postData.studentNum !== taskDetail.studentNum) {
      // 实到与应到人数不符
      Dialog.confirm({
        title: '实到人数与应到人数不符',
        message: '请确认是否打卡？',
      }).then(() => {
        this.doCommonClockIn();
      }).catch(() => {});
    } else {
      this.doCommonClockIn();
    }
  },

  // 上下车打卡的数据验证
  validCanBoardClockIn() {
    const { taskDetail, postData } = this.data;
    let actualSum = 0;
    for (let i = 0;i < postData.clockInPersons.length;i++) {
      const plan = postData.clockInPersons[i];
      if (isEmpty(plan.studentActualNum) || isEmpty(plan.teacherActualNum)) {
        wx.showToast({
          icon: 'none',
          title: '请输入人数',
        });
        return false;
      }
      if (!unNegativeIntegerRegex.test(plan.studentActualNum) || !unNegativeIntegerRegex.test(plan.teacherActualNum)) {
        wx.showToast({
          icon: 'none',
          title: '请输入非负整数',
        });
        return false;
      }
      actualSum += Number(plan.studentActualNum);
      actualSum += Number(plan.teacherActualNum);
    }
    let shouldSum = Number(taskDetail.studentNum) + Number(taskDetail.teacherNum);
    if (actualSum != shouldSum && isEmpty(postData.remark)) {
      wx.showToast({
        icon: 'none',
        title: '实到与应到人数不符，请填写原因',
      });
      return false;
    }
    if (!isEmpty(postData.remark) && postData.remark.length > 200) {
      wx.showToast({
        icon: 'none',
        title: '备注最多200字',
      });
      return false;
    }
    if (isEmpty(postData.photoList)) {
      wx.showToast({
        icon: 'none',
        title: '请上传照片',
      });
      return false;
    }
    if (postData.photoList.length > 9) {
      wx.showToast({
        icon: 'none',
        title: '最多上传9张照片',
      });
      return false;
    }
    return true;
  },

  // 执行上下车打卡
  doBoardClockIn() {
    getPosition(address => {
      const { postData, taskPoint } = this.data;
      let data = {
        "address": address,
        "taskPhotos": postData.photoList.map(item => ({ imageUrl: item.url, taskPhotosId: item.name })),
        "remark": postData.remark,
        "taskClockInId": taskPoint.clockInId,
        clockInPersons: postData.clockInPersons
      };
      this.doClockIn(data);
    })
  },

  // 上下车打卡
  boardClockIn() {
    // 先做数据验证
    if (!this.validCanBoardClockIn()) return;
    const { postData, taskDetail } = this.data;
    let actualSum = 0;
    postData.clockInPersons.forEach(item => {
      actualSum += Number(item.studentActualNum);
      actualSum += Number(item.teacherActualNum);
    })
    let shouldSum = Number(taskDetail.studentNum) + Number(taskDetail.teacherNum);
    // 判断人数
    if (actualSum !== shouldSum) {
      // 实到与应到人数不符
      Dialog.confirm({
        title: '实到人数与应到人数不符',
        message: '请确认是否打卡？',
      }).then(() => {
        this.doBoardClockIn();
      }).catch(() => {});
    } else {
      this.doBoardClockIn();
    }
  },

  // 调接口执行打卡操作
  doClockIn(data) {
    const { taskDetail } = this.data;
    clockIn(data).then(res => {
      wx.navigateBack({
        success: () => {
          wx.showToast({
            title: '打卡成功',
          });
          this.eventChannel.emit('refreshTaskDetail', taskDetail.id);
        }
      });
    });
  },

  // 取消打卡
  cancelClockIn() {
    getPosition(address => {
      const { taskPoint, taskDetail } = this.data;
      let data = {
        "cancelAddress": address,
        "taskClockInId": taskPoint.clockInId
      };
      cancelClockIn(data).then(res => {
        wx.navigateBack({
          success: () => {
            wx.showToast({
              title: '取消打卡成功',
            });
            this.eventChannel.emit('refreshTaskDetail', taskDetail.id);
          }
        });
      })
    })
  },

  calcCanClockIn(detail, taskPoint) {
    if (detail.executeStatus === 'IN_THE_TRAVEL') {
      let today = dateFormat(new Date(), 'YYYY-mm-dd');
      let compare = compareTime(taskPoint.clockInDate, today);
      return compare === 0; // 今天-可以打卡，否则不能
    }
    // 非出行中的行程，一律不能打卡
    return false;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ taskDetail, taskPoint }) {
    // 初始化枚举
    this.initEnums();
    // 保存任务详情、打卡点
    const taskDetailObj = JSON.parse(taskDetail);
    const taskPointObj = JSON.parse(taskPoint);
    // 保存事件句柄
    this.eventChannel = this.getOpenerEventChannel();
    // 构造postData
    const { postData } = this.data;
    postData.clockInPersons = taskDetailObj.vehiclePlans.map(item => ({
      "studentActualNum": null,
			"teacherActualNum": null,
			"vehicleNo": item.vehicleNo
    }));
    // 计算能否打卡
    let canClockIn = taskDetailObj.canExecute && this.calcCanClockIn(taskDetailObj, taskPointObj);
    // setData
    this.setData({ 
      taskDetail: taskDetailObj,
      taskPoint: taskPointObj,
      postData,
      canClockIn
    }, () => {
      this.getClockInDetail(taskPointObj.clockInId, taskPointObj.clockInType);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})