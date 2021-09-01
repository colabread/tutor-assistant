import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

import { gradeEnum, classEnum } from '../../../utils/enums';
import { loading } from '../../../utils/util';
import { alarmList } from '../api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: '',
    alarmInfo: {
      alarmList: []
    },
    enums: {}
  },

  initEnums() {
    this.setData({ 
      enums: {
        gradeEnum,
        classEnum
      }
    })
  },

  fetchAlarmList(groupId) {
    loading();
    alarmList({ orderGroupId: groupId }).then(res => {
      Toast.clear();
      const alarmInfo = res.data;
      if (alarmInfo.wraningCount) alarmInfo.wraningCount = Number(alarmInfo.wraningCount);
      else alarmInfo.wraningCount = 0;
      this.setData({ alarmInfo });
    })
  },

  refresh() {
    const { groupId } = this.data;
    this.fetchAlarmList(groupId);
  },

  toSafeFence({ currentTarget: { dataset: { studentId } } }) {
    const { groupId } = this.data;
    wx.navigateTo({
      url: `/pages/common/safeFence/index?groupId=${groupId}&studentId=${studentId}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ groupId }) {
    this.initEnums();
    this.fetchAlarmList(groupId);
    this.setData({ groupId });
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