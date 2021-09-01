import { login } from './api';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneRequesterShow: false,
    avatarUrl: '',
    envSwitcherShow: false,
  },

  handleLogin() {
    wx.getUserProfile({
      desc: '用于完善你的基础信息',
      success: (res) => {
        this.setData({ avatarUrl: res.userInfo.avatarUrl });
        wx.setStorageSync('userInfo', res.userInfo);
        wx.login({
          success: (res) => {
            app.globalData.loginRes = res;
            this.setData({ phoneRequesterShow: true });
          },
          fail: (err) => {
            wx.showToast({
              title: '微信登录失败',
              icon: 'none'
            })
          }
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '未授权个人信息，无法登录',
          icon: 'none'
        })
      }
    })
  },

  getPhoneNum({ detail }) {
    if (detail.errMsg.indexOf('ok') !== -1) {
      const userInfo = wx.getStorageSync('userInfo');
      login({
        "avatarUrl": userInfo.avatarUrl,
        "encryptedData": detail.encryptedData,
        "iv": detail.iv,
        "jsCode": app.globalData.loginRes.code,
        "nickName": userInfo.nickName
      }).then(res => {
        wx.setStorageSync('token', res.data.token);
        wx.setStorageSync('hasSet', res.data.hasSet);
        if (res.data.hasSet) {
          wx.switchTab({
            url: '/pages/home/index/index',
          });
        } else {
          wx.reLaunch({
            url: '/pages/me/basic/index',
          });
        }
      })
    } else {
      wx.showToast({
        title: '未授权电话号码，无法登录',
        icon: 'none'
      })
    }
  },

  closeEnvSwitcher() {
    this.setData({ envSwitcherShow: false });
  },

  handleLongTap() {
    this.setData({ envSwitcherShow: true });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideHomeButton();  // 隐藏home按钮
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