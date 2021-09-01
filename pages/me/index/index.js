import { taskStatistics } from '../api';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    taskStatistics: {},
    envSwitcherShow: false,
    isCurrentPage: false,  // 标识变量：标识小程序当前是否停留在该页面
  },

  fetchStatics() {
    taskStatistics().then(res => {
      this.setData({ 
        taskStatistics: {
          toTravel: Number(res.data.toTravel),
          inTheTravel: Number(res.data.inTheTravel),
        }
      });
    })
  },

  toBasic() {
    wx.navigateTo({
      url: '/pages/me/basic/index',
    })
  },

  toTaskPage({ currentTarget: { dataset: { taskState } } }) {
    app.globalData.taskState = taskState ? taskState : 0;
    app.globalData.isReloadTask = true;
    wx.switchTab({
      url: '/pages/task/index/index',
    });
  },

  closeEnvSwitcher() {
    this.setData({ envSwitcherShow: false });
  },

  handleLongTap() {
    this.setData({ envSwitcherShow: true });
  },

  refresh() {
    this.fetchStatics();
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo });
    this.refresh();
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