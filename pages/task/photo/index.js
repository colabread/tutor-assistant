import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import { photoList, addPhoto, deletePhoto } from '../api';
import { multiUploadFile } from '../../../utils/http';
import { filterUnImageFile } from '../../../utils/businessUtils';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: '',
    disabled: false,
    photoList: []
  },

  getPhotoList(taskId) {
    photoList({ executeTaskId: taskId }).then(res => {
      let photoList = res.data?.map(item => ({
        name: item.taskPhotosId,
        url: item.imageUrl
      })) || [];
      this.setData({ photoList });
    })
  },

  beforeRead({ detail: { callback, file } }) {
    const { photoList } = this.data;
    if (photoList.length + file.length > 100) {
      wx.showToast({
        title: '最多只能上传100张照片',
        icon: 'none'
      });
      callback(false);
    } else {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '上传中',
        selector: '#van-toast',
      });
      callback(true);
    }
  },

  async afterRead({ detail: { file } }) {
    const waitFiles = filterUnImageFile(file);
    try {
      let res1 = await multiUploadFile(waitFiles); // 首先调用批量上传文件接口，得到文件url
      const { taskId } = this.data;
      try {
        let res2 = await addPhoto({   // 再调用新增图片接口，得到文件id（删除时使用）
          "imageUrl": res1.data.map(item => item.url),
          "taskId": taskId
        });
        const { photoList } = this.data;
        for (let i = 0;i < res2.data.length;i++) {
          photoList.unshift({
            url: res1.data[i].url,
            name: res2.data[i]
          });
        }
        this.setData({ photoList }, () => { Toast.clear(); });
      } catch (e) {
        Toast.clear();
      } finally {
        Toast.clear();
      }
    } catch (e) {
      Toast.clear();
    } finally {
      Toast.clear();
    }
  },

  deletePhoto({ detail: { file: { name }, index } }) {
    Dialog.confirm({
      message: '是否确认删除？',
    }).then(() => {
      deletePhoto([name]).then(res => {
        const { photoList } = this.data;
        photoList.splice(index, 1);
        this.setData({ photoList });
      })
    }).catch(() => {
      // cancel
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ taskDetail }) {
    const taskDetailObj = JSON.parse(taskDetail);
    let taskId = taskDetailObj.id;
    let disabled = !(taskDetailObj.canExecute && taskDetailObj.executeStatus === 'IN_THE_TRAVEL');
    this.setData({ taskId, disabled });
    this.getPhotoList(taskId);
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