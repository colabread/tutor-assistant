import { calTimeIntervalLabel1 } from '../../../utils/businessUtils';
import { gradeEnum, classEnum } from '../../../utils/enums';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    task: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    labels: {}, // 用于显示一些需要转换后的字段
    enums: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  },

  lifetimes: {
    attached: function() {
      const { task } = this.properties;
      const { labels } = this.data;
      let time = calTimeIntervalLabel1(task.goDate, task.backDate);
      labels.time = time;
      labels.gradeName = gradeEnum[task.grade];
      labels.className = classEnum[task.cls];
      this.setData({ labels });
    },
  },
})
