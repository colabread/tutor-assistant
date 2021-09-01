import { areaList } from '../../../utils/commonAPI';

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    areaList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getCountry() {
      let countryList = wx.getStorageSync('countryList');
      if (!countryList) {
        countryList = [];
        let res = await areaList({ type: 'COUNTRY' });
        countryList = res.data;
        wx.setStorageSync('countryList', countryList);
      }
      return countryList;
    },

    async getProvince(countryId) {
      if (!countryId) return [];
      let provinceMap = wx.getStorageSync('provinceMap');
      if (!provinceMap) provinceMap = {};
      let provinceList = provinceMap[countryId];
      if (!provinceList) {
        provinceList = [];
        let res = await areaList({ type: 'PROVINCE', parentId: countryId });
        provinceList = res.data;
        provinceMap[countryId] = provinceList;
        wx.setStorageSync('provinceMap', provinceMap);
      }
      return provinceList;
    },

    async getCity(provinceId) {
      if (!provinceId) return [];
      let cityMap = wx.getStorageSync('cityMap');
      if (!cityMap) cityMap = {};
      let cityList = cityMap[provinceId];
      if (!cityList) {
        cityList = {};
        let res = await areaList({ type: 'CITY', parentId: provinceId });
        cityList = res.data;
        cityMap[provinceId] = cityList;
        wx.setStorageSync('cityMap', cityMap);
      }
      return cityList;
    },

    async initArea() {
      let countryList = await this.getCountry();
      let chinaIndex = countryList.findIndex(item => item.nameCn === '中国');
      let provinceList = await this.getProvince(countryList[chinaIndex]?.id);
      let sichuanIndex = provinceList.findIndex(item => item.nameCn === '四川省');
      let cityList = await this.getCity(provinceList[sichuanIndex]?.id);
      const { areaList } = this.data;
      areaList.push({
        values: countryList,
        defaultIndex: chinaIndex
      });
      
      areaList.push({
        values: provinceList,
        defaultIndex: sichuanIndex
      });
      areaList.push({
        values: cityList
      });
      this.setData({ areaList });
    },

    async handleChange({ detail: { index, value } }) {
      const { areaList } = this.data;
      if (index == 0) {
        // 选择国家
        let provinceList = await this.getProvince(value[index].id);
        let cityList = await this.getCity(provinceList[0]?.id);
        areaList.splice(1, 2);
        areaList.push({ values: provinceList });
        areaList.push({ values: cityList });
      } else if (index == 1) {
        // 选择省份
        let cityList = await this.getCity(value[index].id);
        areaList.splice(2, 1);
        areaList.push({ values: cityList });
      } else if (index == 2) {
        // 选择城市
      }
      this.setData({ areaList });
    },

    handleConfirm({ detail: { value } }) {
      this.triggerEvent('confirm', value);
    },

    handleCancel() {
      this.triggerEvent('cancel');
    }
  },

  lifetimes: {
    created: function() {
      this.initArea();
    }
  }
})
