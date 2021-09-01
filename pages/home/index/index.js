import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import moment from '../../../miniprogram_npm/moment/index';

import { todayGroup, closeFence, openFence } from '../api';
import { loading } from '../../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    today: '',
    groupList: [],
    isCurrentPage: true,  // 标识变量：标识小程序当前是否停留在该页面
    curSwiper: 0
  },

  fetchTodayGroup() {
    loading();
    todayGroup().then(res => {
      Toast.clear();
      const groupList = res.data || [];
      groupList.forEach(item => {
        // item.leader = false;  // 测试用
        if (item.warningCount) item.warningCount = Number(item.warningCount);
        else item.warningCount = 0;
        item.interval = moment(item.backDate).diff(moment(item.goDate), 'days') + 1;
        item.goDate = moment(item.goDate).format('YYYY.MM.DD');
        item.backDate = moment(item.backDate).format('YYYY.MM.DD');
      })
      this.setData({ groupList, refreshing: false });
    }).finally(() => {
      Toast.clear();
    })
  },

  initTodayDate() {
    const today = moment().format('YYYY/MM/DD');
    this.setData({ today });
  },

  toAlarmList({ target: { dataset: { groupId } } }) {
    wx.navigateTo({
      url: `/pages/common/alarmList/index?groupId=${groupId}`,
    })
  },

  toSafeFence({ currentTarget: { dataset: { groupId } } }) {
    wx.navigateTo({
      url: `/pages/common/safeFence/index?groupId=${groupId}`,
    })
  },

  switchAlarmSite({ currentTarget: { dataset: { groupId, site, siteList } } }) {
    const { groupList } = this.data;
    const group = groupList.find(item => item.orderGroupId === groupId);
    if (!group.leader) {
      wx.showToast({
        title: '非领队不能操作',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if (site.open) {
      Dialog.confirm({
        title: '关闭后，安全预警将关闭',
        message: '请确认是否学生开始出围栏',
      }).then(() => {
        closeFence({ orderGroupId: groupId }).then(res => {
          Toast.success('已关闭');
          this.fetchTodayGroup();
        });
      }).catch(() => {});
    } else {
      const isOpenAlarm = siteList.some(item => item.open);
      if (isOpenAlarm) {
        wx.showToast({
          title: '预警开关每次只能开启一个',
          icon: 'none',
          duration: 3000
        });
      } else {
        Dialog.confirm({
          title: '开启后，安全预警将打开',
          message: '请确认是否所有学生进入围栏',
        }).then(() => {
          openFence({ electricFenceId: site.id, orderGroupId: groupId }).then(res => {
            Toast.success('已开启');
            this.fetchTodayGroup();
          });
        }).catch(() => {});
      }
    }
  },

  refresh() {
    this.setData({ curSwiper: 0 });
    this.fetchTodayGroup();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initTodayDate();
    this.fetchTodayGroup();
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