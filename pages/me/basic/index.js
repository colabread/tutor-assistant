import { 
  dateFormat, 
  violenceCopy, 
  isValidIdCard, 
  getBirthAndGenderFromIdDard,
  isEmpty
} from '../../../utils/util';
import { setBasicInfo, basicInfoDetail } from '../api';
import { workTypeEnum } from '../../../utils/enums';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum: '',
    postData: {
      labels: {},
      times: {}
    },
    datePickerType: '',
    datePickerShow: false,
    areaPickerShow: false,
    workTypePickerShow: false,
    maxSelectDate: Date.now()
  },

  changeFieldValue({ detail, target: { dataset: { type } } }) {
    const { postData } = this.data;
    postData[type] = detail;
    if (type === 'idCard') {
       if (isValidIdCard(detail)) {
         // 根据身份证，自动填充生日和性别
         let info = getBirthAndGenderFromIdDard(detail);
         postData.birthday = info.birthDay;
         postData.times.birthday = new Date(info.birthDay).getTime();
         postData.gender = info.sex === 1 ? 'MALE' : 'FEMALE';
       }
    }
    this.setData({ postData });
  },

  openWorkTypePicker() {
    this.setData({ workTypePickerShow: true });
  },

  changeWorkType({ detail }) {
    const { postData } = this.data;
    postData.jobCategories = detail.map(item => item.key);
    postData.labels.jobCategories = detail.map(item => item.value).join('，')
    this.setData({ postData, workTypePickerShow: false });
  },

  closeWorkTypePicker() {
    this.setData({ workTypePickerShow: false });
  },

  openDatePicker({ target: { dataset: { dateType } } }) {
    this.setData({ datePickerShow: true, datePickerType: dateType });
  },

  closeDatePicker() {
    this.setData({ datePickerShow: false });
  },

  confirmDate({ detail }) {
    const { postData, datePickerType } = this.data;
    postData.times[datePickerType] = detail;
    postData[datePickerType] = dateFormat(detail, 'YYYY-mm-dd');
    this.setData({ postData, datePickerShow: false });
  },

  openAreaPicker() {
    this.setData({ areaPickerShow: true });
  },

  closeAreaPicker() {
    this.setData({ areaPickerShow: false });
  },

  changeArea({ detail }) {
    const { postData } = this.data;
    postData.countryId = detail[0]?.id;
    postData.countryName = detail[0]?.nameCn;
    postData.provinceId = detail[1]?.id;
    postData.provinceName = detail[1]?.nameCn;
    postData.cityId = detail[2]?.id;
    postData.cityName = detail[2]?.nameCn;
    this.setData({ postData, areaPickerShow: false });
  },

  validForm() {
    const { postData } = this.data;
    if (isEmpty(postData.name)) {
      wx.showToast({
        icon: 'none',
        title: '请输入姓名',
      });
      return false;
    }
    if (postData.name.length > 50) {
      wx.showToast({
        icon: 'none',
        title: '姓名不能超过50位',
      });
      return false;
    }
    if (isEmpty(postData.jobCategories)) {
      wx.showToast({
        icon: 'none',
        title: '请选择工作性质',
      });
      return false;
    }
    if (isEmpty(postData.idCard)) {
      wx.showToast({
        icon: 'none',
        title: '请输入身份证',
      });
      return false;
    }
    if (!isValidIdCard(postData.idCard)) {
      wx.showToast({
        icon: 'none',
        title: '身份证格式不正确',
      });
      return false;
    }
    if (isEmpty(postData.countryId) || isEmpty(postData.provinceId) || isEmpty(postData.cityId)) {
      wx.showToast({
        icon: 'none',
        title: '请选择现住地',
      });
      return false;
    }
    if (!isEmpty(postData.address) && postData.address.length > 100) {
      wx.showToast({
        icon: 'none',
        title: '详细地址不能超过100个字',
      });
      return false;
    }
    if (!isEmpty(postData.guideCard) && postData.guideCard.length > 100) {
      wx.showToast({
        icon: 'none',
        title: '导游编号不能超过100个字',
      });
      return false;
    }
    return true;
  },

  save() {
    if (this.validForm()) {
      const { postData } = this.data;
      let data = violenceCopy(postData);
      delete data.labels;
      delete data.times;
      setBasicInfo(data).then(res => {
        wx.showToast({
          title: '保存成功',
        });
        const hasSet = wx.getStorageSync('hasSet');
        if (hasSet) {
          setTimeout(() => {
            wx.navigateBack();
          }, 500);
        } else {
          wx.setStorageSync('hasSet', true);
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/task/index/index'
            })
          }, 500);
        }
      })
    }
  },

  getBasicInfo() {
    basicInfoDetail().then(res => {
      let postData = {
        name: res.data.name,
        jobCategories: res.data.jobCategories,
        idCard: res.data.idCard,
        gender: res.data.gender,
        birthday: res.data.birthday,
        countryId: res.data.countryId,
        countryName: res.data.countryName,
        provinceId: res.data.provinceId,
        provinceName: res.data.provinceName,
        cityId: res.data.cityId,
        cityName: res.data.cityName,
        address: res.data.address,
        guideCard: res.data.guideCard,
        labels: {
          jobCategories: res.data.jobCategories.map(item => workTypeEnum[item]).join('，')
        },
        times: {
          birthday: new Date(res.data.birthday).getTime()
        }
      };
      this.setData({ postData, phoneNum: res.data.phone });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBasicInfo();
    const hasSet = wx.getStorageSync('hasSet');
    if (!hasSet) {
      wx.hideHomeButton();  // 隐藏home按钮
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