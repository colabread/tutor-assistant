import { workTypeEnum } from '../../../utils/enums';
import { enumToList } from '../../../utils/util';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    initValue: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: [],
    workTypeList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    change({ detail }) {
      this.setData({ value: detail });
    },
    cancel() {
      this.triggerEvent('cancel');
    },
    confirm() {
      const { value } = this.data;
      const result = value.map(key => ({
        key,
        value: workTypeEnum[key]
      }))
      this.triggerEvent('confirm', result);
    },
  },

  observers: {
    'initValue': function(initValue) {
      this.setData({ value: initValue });
    }
  },

  lifetimes: {
    attached: function() {
      const workTypeList = enumToList(workTypeEnum);
      this.setData({ workTypeList });
    },
  }
})
