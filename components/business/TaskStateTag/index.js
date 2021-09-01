import { taskStateEnum } from '../../../utils/enums';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    state: {
      type: String,
      value: 'CANCELED'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    stateObj: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

  observers: {
    'state': function(state) {
      if (state) {
        const stateObj = taskStateEnum[state];
        this.setData({ stateObj });
      }
    }
  },
})
