import { nameListTypeEnum, gradeEnum, classEnum } from '../../../utils/enums';
import { loading } from '../../../utils/util';
import { nameList, bindDevice, cancelBindDevice } from '../api';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    enums: {},
    travelNameList: {},
    curBindStudent: {},
    deviceBindPopopShow: false,
  },

  navBack() {
    wx.navigateBack();
  },

  initEnums() {
    this.setData({
      enums: {
        nameListTypeEnum,
        gradeEnum,
        classEnum
      },
    });
  },

  getNameList(taskId) {
    nameList({ executeTaskId: taskId }).then(res => {
      const travelNameList = res.data;
      if (travelNameList.wraningCount) travelNameList.wraningCount = Number(travelNameList.wraningCount);
      else travelNameList.wraningCount = 0;
      this.setData({ travelNameList });
    })
  },

  toPhoneBookPage() {
    const { taskDetail } = this.data;
    wx.navigateTo({
      url: `/pages/task/phoneBook/index?taskDetail=${JSON.stringify(taskDetail)}`,
    })
  },

  bind({ target: { dataset: { studentId } } }) {
    loading('正在绑定');
    wx.scanCode({
      success: (res) => {
        const deviceName = res.result;
        bindDevice({ orderGroupGradeclsListId: studentId, deviceName }).then(res => {
          Toast.clear();
          Toast.success('绑定成功');
          const { travelNameList } = this.data;
          const { personnelLists } = travelNameList;
          const student = personnelLists.find(item => item.orderGroupGradeclsListId === studentId);
          student.deviceName = res.data || deviceName;
          this.setData({ travelNameList });
        }).catch(err => {
          Toast.clear();
        })
      },
      fail: () => {
        Toast.clear();
      }
    })
  },

  cancelBind({ target: { dataset: { studentId } } }) {
    loading('正在解绑');
    cancelBindDevice({ orderGroupGradeclsListId: studentId }).then(res => {
      Toast.clear();
      Toast.success('取消成功');
      const { travelNameList } = this.data;
      const { personnelLists } = travelNameList;
      const student = personnelLists.find(item => item.orderGroupGradeclsListId === studentId);
      student.deviceName = '';
      this.setData({ travelNameList });
    }).catch(err => {
      Toast.clear();
    })
  },

  toBindDeivce() {
    const { travelNameList } = this.data;
    const { personnelLists } = travelNameList;
    const studentIndex = personnelLists.findIndex(item => item.nameType === '学生' && !item.deviceName);
    if (studentIndex === -1) {
      Toast('没有需要绑定设备的学生');
      return;
    }
    loading('正在绑定');
    wx.scanCode({
      success: (res) => {
        const deviceName = res.result;
        const student = personnelLists[studentIndex];
        bindDevice({ orderGroupGradeclsListId: student.orderGroupGradeclsListId, deviceName }).then(res => {
          Toast.clear();
          const { curBindStudent } = this.data;
          curBindStudent.index = studentIndex;
          curBindStudent.name = student.name;
          curBindStudent.deviceName = res.data || deviceName;
          curBindStudent.success = true;
          curBindStudent.failMsg = '绑定成功';
          student.deviceName = res.data || deviceName;
          this.setData({ curBindStudent, travelNameList, deviceBindPopopShow: true });
        }).catch(err => {
          Toast.clear();
          const { curBindStudent } = this.data;
          curBindStudent.index = studentIndex;
          curBindStudent.name = student.name;
          curBindStudent.deviceName = res.data || deviceName;
          curBindStudent.success = false;
          curBindStudent.failMsg = err.data.msg;
          this.setData({ curBindStudent, deviceBindPopopShow: true });
        })
      },
      fail: () => {
        Toast.clear();
      }
    })
  },

  closeDeviceBindPopop() {
    this.setData({ deviceBindPopopShow: false });
  },

  toSafeFence() {
    const { travelNameList } = this.data;
    wx.navigateTo({
      url: `/pages/common/safeFence/index?groupId=${travelNameList.orderGroupId}`,
    })
  },

  toSafeFenceByStudent({ currentTarget: { dataset: { student } } }) {
    if (student.nameType === '学生') {
      const { travelNameList } = this.data;
      wx.navigateTo({
        url: `/pages/common/safeFence/index?groupId=${travelNameList.orderGroupId}&studentId=${student.orderGroupGradeclsListId}`,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ taskDetail }) {
    this.initEnums();
    const taskDetailObj = JSON.parse(taskDetail);
    this.getNameList(taskDetailObj.id);
    this.setData({ taskDetail: taskDetailObj });
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