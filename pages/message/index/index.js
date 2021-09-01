import { gradeEnum, classEnum, alarmMsgTypeEnum } from '../../../utils/enums';
import { msgList } from '../api';
import { timeToLabel } from '../../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [],
    enums: {},
    refreshing: false,
    isCurrentPage: false,  // 标识变量：标识小程序当前是否停留在该页面
  },
  
  initEnums() {
    this.setData({ 
      enums: {
        gradeEnum, 
        classEnum,
        alarmMsgTypeEnum
      }
    })
  },

  fetchMsgList() {
    msgList().then(res => {
      const msgList = res.data || [];
      msgList.forEach(item => {
        item.warningTime = timeToLabel(item.warningTime);
      })
      this.setData({ msgList, refreshing: false });
    })
  },

  refresh() {
    this.setData({ refreshing: true }, this.fetchMsgList);
  },

  toSafeFence({ currentTarget: { dataset: { msg } } }) {
    wx.navigateTo({
      url: `/pages/common/safeFence/index?groupId=${msg.orderGroupId}&studentId=${msg.orderGroupGradeclsListId}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initEnums();
    this.fetchMsgList();
    setInterval(this.fetchMsgList, 60000);
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
    this.setData({ isCurrentPage: false });
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

  },

  onTabItemTap: function (item) {
    const { isCurrentPage } = this.data;
    if (isCurrentPage) {  
      // 切换tab回到该页面时，isCurrentPage为false，不用刷新
      // 已在当前页面点击tabBar，则刷新
      this.refresh();
    }
    this.setData({ isCurrentPage: true });
  }
})