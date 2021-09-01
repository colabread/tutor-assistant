// pages/boot/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideHomeButton();  // 隐藏home按钮
    const token = wx.getStorageSync('token');
    if (!token) {
      // 没有token，跳登录页
      wx.reLaunch({
        url: '/pages/login/index',
      });
    } else {
      const hasSet = wx.getStorageSync('hasSet');
      if (!hasSet) {
        // 没有设置基础信息，跳基础信息设置页
        wx.reLaunch({
          url: '/pages/me/basic/index',
        })
      } else {
        // 跳首页
        wx.switchTab({
          url: '/pages/home/index/index',
        })
      }
    }
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