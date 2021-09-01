import { workTypeEnum } from '../../../utils/enums';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    jobName: {
      type: String,
      value: 'XXXX'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    job: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

  observers: {
    'jobName': function(jobName) {
      if (jobName) {
        const job = workTypeEnum[jobName];
        this.setData({ job });
      }
    }
  }
})
