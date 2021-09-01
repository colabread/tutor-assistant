import { page } from '../api';
import { taskStateEnum } from '../../../utils/enums';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestParams: {
      pageNo: 1,
      pageSize: 10
    },
    scrollTop: 0,
    refreshing: false,
    totalPage: 0,
    activeTab: 0,
    taskList: [],
    enums: {},
    enumArray: {},
    isCurrentPage: false,  // 标识变量：标识小程序当前是否停留在该页面
  },

  /**
   * 查询分页数据
   * @param mode: refresh-刷新列表，add-追加
   */
  search(mode='refresh') {
    const { requestParams, taskList } = this.data;
    page(requestParams).then(res => {
      let taskListTemp = [];
      if (mode === 'add') {
        taskListTemp = taskList.concat(res.data.records);
        this.setData({ 
          refreshing: false,
          taskList: taskListTemp,
          totalPage: Number(res.data.totalPage)
        });
      } else if (mode === 'refresh') {
        taskListTemp = res.data.records;
        this.setData({ 
          scrollTop: 0,
          refreshing: false,
          taskList: taskListTemp,
          totalPage: Number(res.data.totalPage)
        });
      }
    })
  },

  changeTab({ detail: { name } }) {
    const { requestParams } = this.data;
    if (name) requestParams.executeStatus = name;
    else delete requestParams.executeStatus;
    requestParams.pageNo = 1;
    this.setData({ requestParams, activeTab: name }, this.search)
  },

  scrollToBottom(e) {
    const { requestParams, totalPage } = this.data;
    if (requestParams.pageNo >= totalPage) {
      wx.showToast({
        icon: 'none',
        title: '没有更多数据了',
      });
    } else {
      requestParams.pageNo += 1;
      this.setData({ requestParams }, () => { this.search('add') });
    }
  },

  refresh() {
    const { requestParams } = this.data;
    requestParams.pageNo = 1;
    this.setData({ refreshing: true, requestParams }, this.search);
  },

  toDetail({ currentTarget: { dataset: { taskId } } }) {
    wx.navigateTo({
      url: `/pages/task/detail/index?taskId=${taskId}`,
    })
  },

  initEnums() {
    const taskStateEnumArray = Object.keys(taskStateEnum).map(key => ({
      key,
      label: taskStateEnum[key].text
    }));
    this.setData({
      enums: {
        taskStateEnum,
      },
      enumArray: {
        taskStateEnumArray
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initEnums();
    this.search();
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
    if (app.globalData.isReloadTask) {
      this.setData({ activeTab: app.globalData.taskState });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.isReloadTask = false;
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