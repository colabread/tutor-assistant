import { detail, phoneBookList } from '../api';
import { gradeEnum, classEnum, workTypeEnum } from '../../../utils/enums';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskDetail: {},
    phoneList: [],
    enums:{}
  },

  initEnums() {
    this.setData({
      enums: {
        gradeEnum,
        classEnum,
        workTypeEnum
      }
    })
  },

  getPhoneList(taskId) {
    phoneBookList({ executeTaskId: taskId }).then(res => {
      this.setData({ phoneList: res.data })
    })
  },

  call({ currentTarget: { dataset: { phone } } }) {
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ taskDetail }) {
    this.initEnums();
    const taskDetailObj = JSON.parse(taskDetail);
    this.getPhoneList(taskDetailObj.id);
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