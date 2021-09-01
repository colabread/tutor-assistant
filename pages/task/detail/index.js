import { detail } from '../api';
import { dateFormat, compareTime, isEmpty } from '../../../utils/util';
import { calTimeIntervalLabel2 } from '../../../utils/businessUtils';
import { clockInPointEnum, gradeEnum, classEnum } from '../../../utils/enums';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {
      labels: {},
    },
    activeTravels: [],
    travelList: [],
    enums: {},
    allowOpenFiles: 'doc,docx,xls,xlsx,ppt,pptx,pdf',
    allowOpenImages: 'jpg,jpeg,png,gif,JPG,JPEG,PNG,GIF',
    imagePopupShow: false,
    popupImageUrl: '',
  },

  initEnums() {
    this.setData({
      enums: {
        gradeEnum, 
        classEnum
      }
    });
  },

  toClockInDetail(detail, taskPoint) {
    wx.navigateTo({
      url: `/pages/task/clockIn/index?taskPoint=${JSON.stringify(taskPoint)}&taskDetail=${JSON.stringify(detail)}`,
      events: {
        refreshTaskDetail: (taskId) => {
          this.getTaskDetail(taskId);
        }
      },
    });
  },

  clockIn({ detail: taskPointIndex, currentTarget: { dataset: { taskPointList } } }) {
    const { detail } = this.data;
    const taskPoint = taskPointList[taskPointIndex];
    // 能否进入打卡页判定
    if (detail.executeStatus === 'TO_TRAVEL') {
      // 待出行
      wx.showToast({
        icon: 'none',
        title: '未出行，无法打卡',
        duration: 1500
      });
    } else if (detail.executeStatus === 'IN_THE_TRAVEL') {
      // 出行中
      if (!taskPoint.isClockIn) {
         // 未打卡
        let today = dateFormat(new Date(), 'YYYY-mm-dd');
        let compare = compareTime(taskPoint.clockInDate, today);
        if (compare === 0) {
          // 今天
          this.toClockInDetail(detail, taskPoint);
        } else if (compare === 1) {
          // 未来
          wx.showToast({
            icon: 'none',
            title: '未出行，无法打卡',
            duration: 1500
          });
        } else {
          // 以前
          wx.showToast({
            icon: 'none',
            title: '行程结束，无法打卡',
            duration: 1500
          });
        }
      } else {
        // 已打卡
        this.toClockInDetail(detail, taskPoint);
      }
    } else if (detail.executeStatus === 'COMPLETED') {
      // 已完成
      if (!taskPoint.isClockIn) {
        // 未打卡
        wx.showToast({
          icon: 'none',
          title: '行程结束，无法打卡',
          duration: 1500
        });
      } else {
        // 已打卡
        this.toClockInDetail(detail, taskPoint);
      }
    } else if (detail.executeStatus === 'CANCELED') {
      // 已取消
      if (!taskPoint.isClockIn) {
        // 未打卡
        wx.showToast({
          icon: 'none',
          title: '行程被取消，无法打卡',
          duration: 1500
        });
      } else {
        // 已打卡
        this.toClockInDetail(detail, taskPoint);
      }
    }
  },

  changeExpandTravel({ detail }) {
    this.setData({ activeTravels: detail });
  },

  openFile({ currentTarget: { dataset: { type } } }) {
    const { detail, allowOpenFiles, allowOpenImages } = this.data;
    const url = detail[type];
    // const url = 'https://yx-oss-dev.hiseas.com/product/course/海昌极地海洋公园研学手册.docx';  // 测试
    if (isEmpty(url)) {
      wx.showToast({
        title: '未找到文件',
        icon: 'none'
      });
      return;
    }
    const prefix = url.substring(url.lastIndexOf('.') + 1);
    if (allowOpenFiles.indexOf(prefix) !== -1) {
      wx.downloadFile({
        url,
        success: function (res) {
          const filePath = res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            fail: function(e) {
              wx.showToast({
                icon: 'none',
                title: '文件打开失败',
              })
            }
          })
        },
        fail: function(e) {
          wx.showToast({
            icon: 'none',
            title: '文件下载失败',
          })
        }
      })
    } else if (allowOpenImages.indexOf(prefix) !== -1) {
      this.setData({ popupImageUrl: url, imagePopupShow: true });
    } else {
      wx.showToast({
        title: '不支持的文件类型',
        icon: 'none'
      });
    }
  },

  viewHandbook() {

  },

  toMatchMaterial({ currentTarget: { dataset: { materialType } } }) {
    const { detail } = this.data;
    wx.navigateTo({
      url: `/pages/task/${materialType}/index?taskDetail=${JSON.stringify(detail)}`,
    })
  },

  getTaskDetail(taskId) {
    detail({ executeTaskId: taskId }).then(res => {
      let detail = res.data;
      // 解析labels
      detail.labels = {
        time: calTimeIntervalLabel2(detail.goDate, detail.backDate),
        carNum: detail.vehiclePlans?.map(item => `${item.vehicleNo}号车（${item.vehiclePlate}、${item.persons}人）`).join('| ')
      };
      // 解析travelList
      let travelList = [];
      Object.keys(detail.clockIns).map(key => {
        let travel = {
          time: key,
          // time: '2021-08-13'  // 测试
        };
        let taskPointList = detail.clockIns[key].map(item => ({
          clockInId: item.taskClockInId,
          text: clockInPointEnum[item.clockInType],
          desc: item.clockInStatus === 'COMPLETED' ? '已打卡' : '打卡 >',
          isClockIn: item.clockInStatus === 'COMPLETED',
          clockInType: 'GET_ON,GET_ON_BACK'.indexOf(item.clockInType) !== -1 ? 'board' : 'common',
          clockInDate: key
          // clockInDate: '2021-08-13' // 测试
        }));
        let activePoint = -1;
        taskPointList.forEach((item, index) => {
          if (item.isClockIn) {
            activePoint = index;
          }
        });
        if (activePoint !== -1) {
          activePoint ++;
        } else {
          let today = dateFormat(new Date(), 'YYYY-mm-dd');
          if (today === key) {
            activePoint = 0;
          }
        }
        travel.activePoint = activePoint;
        travel.taskPointList = taskPointList;
        travel.isComplete = taskPointList.every(item => item.isClockIn);
        travelList.push(travel);
      });
      // 解析activeTravels
      let today = dateFormat(new Date(), 'YYYY-mm-dd');
      let activeTravels = [today];

      // detail.executeStatus = 'IN_THE_TRAVEL';  // 用于测试

      this.setData({ 
        detail,
        activeTravels,
        travelList
      });
    })
  },

  closeImagePopup() {
    this.setData({ imagePopupShow: false });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ taskId }) {
    this.getTaskDetail(taskId);
    this.initEnums();
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