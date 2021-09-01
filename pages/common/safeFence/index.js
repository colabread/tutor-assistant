import { openRoutePlan } from '../../../utils/businessUtils';
import gcoord from '../../../miniprogram_npm/gcoord/index';
import { searchFence } from '../api';
import { isEmpty } from '../../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: '',
    studentId: '',
    fenceArea: [],
    markers: [],
    keyword: '',
  },

  changeKeyword({ detail }) {
    this.setData({ keyword: detail });
  },

  createFence(fenceData) {
    if (isEmpty(fenceData)) {
      wx.showToast({
        title: '未查询到围栏数据',
        icon: 'none'
      });
      return;
    }
    const fenceArea = [{
      strokeWidth: 3,
      strokeColor: '#FF8000',
      points: fenceData.map(item => {
        let coordinate = gcoord.transform(
          [item.latLng.lng, item.latLng.lat],    // 经纬度坐标
          gcoord.BD09,               // 当前坐标系
          gcoord.GCJ02                 // 目标坐标系
        );
        return { latitude: coordinate[1], longitude: coordinate[0] };
      })
    }];
    this.setData({ fenceArea });
  },

  // 创建学生点，bubbleShow：是否要显示气泡框
  createMarkers(markerData, bubbleShow) {
    if (isEmpty(markerData)) {
      wx.showToast({
        title: '未查询到学生数据',
        icon: 'none'
      });
      return;
    }
    const markers = markerData.map((item, index) => {
      // let coordinate = gcoord.transform(
      //   [item.lng, item.lat],    // 经纬度坐标
      //   gcoord.BD09,               // 当前坐标系
      //   gcoord.GCJ02                 // 目标坐标系
      // );
      let coordinate = [item.lng, item.lat];
      return {
        id: index + 1,
        latitude: coordinate[1],
        longitude: coordinate[0],
        iconPath: '/images/position.png',
        width: 20,
        height: 20,
        callout: {
          display: bubbleShow ? 'ALWAYS' : 'BYCLICK',
          content: item.studentName + (item.offLine ? '（离线）' : ''),
          color: '#171719',
          fontSize: 14,
          borderRadius: 10,
          padding: 10
        },
        type: item.outOf ? 'out' : 'in'
      }
    });
    this.setData({ markers });
  },

  search({ detail }) {
    if (isEmpty(detail)) return;
    detail = detail.trim();
    const { groupId } = this.data;
    searchFence({ orderGroupId: groupId, keyword: detail }).then(res => {
      this.createFence(res.data.fenceCoordinates);
      this.createMarkers(res.data.studentCoordinates, true);
      if (!isEmpty(res.data.studentCoordinates)) {
        this.locateToStudent(res.data.studentCoordinates[0]);
      }
    })
  },

  // 进入路线规划
  callouttap({ detail: { markerId } }) {
    const { markers } = this.data;
    const marker = markers.find(item => item.id === markerId);
    openRoutePlan(marker);
  },

  // 地图缩放、移动事件处理程序
  regionchange({ causedBy }) {
    if (causedBy === 'scale') {
      this.mapContext.getScale({
        success: res => {
          const { scale } = res;
          const { markers } = this.data;
          if (scale > 16) {
            // 显示围栏外学生的名字
            markers.forEach(item => {
              if (item.type === 'out') {
                item.callout.display = 'ALWAYS';
              }
            });
          } else {
            // 隐藏围栏外学生的名字
            markers.forEach(item => {
              if (item.type === 'out') {
                item.callout.display = 'BYCLICK';
              }
            });
          }
          this.setData({ markers });
        }
      })
    }
  },

  // 定位到默认位置：天府广场
  moveToDefaultLocation() {
    this.mapContext.moveToLocation({ longitude: 104.065773, latitude: 30.65744 });
  },

  locateToMe() {
    const _this = this;
    wx.getLocation({
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude
        this.mapContext.moveToLocation({ longitude, latitude });
      },
      fail: () => {
        wx.showModal({
          title: '获取经纬度失败',
          content: '是否打开权限设置',
          success: function({ confirm }) {
            if (confirm) {
              wx.openSetting({
                success({ authSetting }) {
                  if (authSetting['scope.userLocation']) {
                    wx.getLocation({
                      success: (res) => {
                        const latitude = res.latitude
                        const longitude = res.longitude
                        _this.mapContext.moveToLocation({ longitude, latitude });
                      },
                      fail: () => {
                        _this.moveToDefaultLocation();
                      }
                    });
                  }
                }
              });
            }
          }
        })
      }
    })
  },

  locateToStudent(stuPos) {
    // const coordinate = gcoord.transform(
    //   [stuPos.lng, stuPos.lat],    // 经纬度坐标
    //   gcoord.BD09,               // 当前坐标系
    //   gcoord.GCJ02                 // 目标坐标系
    // );
    const coordinate = [stuPos.lng,  stuPos.lat];
    this.mapContext.moveToLocation({ longitude: coordinate[0], latitude: coordinate[1] });
  },

  createSafeFence(groupId, studentId) {
    let requestData = { orderGroupId: groupId };
    if (studentId) requestData.orderGroupGradeclsListId = studentId;
    searchFence(requestData).then(res => {
      this.createFence(res.data.fenceCoordinates);
      this.createMarkers(res.data.studentCoordinates, !!studentId);
      if (studentId) {
        // 地图中心定为学生所在位置
        if (!isEmpty(res.data.studentCoordinates)) {
          this.locateToStudent(res.data.studentCoordinates[0]);
        } else {
          this.locateToMe();
        }
      } else {
        // 地图中心定为当前用户所在位置
        this.locateToMe();
      }
    }).catch(() => {
      this.locateToMe();
    })
  },

  refresh() {
    const { groupId, studentId } = this.data;
    this.createSafeFence(groupId, studentId);
    this.setData({ keyword: '' });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ groupId, studentId }) {
    this.mapContext = wx.createMapContext('mapContext', this);
    this.createSafeFence(groupId, studentId);
    this.setData({ groupId, studentId });
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