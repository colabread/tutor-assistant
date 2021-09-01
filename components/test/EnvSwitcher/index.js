import { switchEnv } from '../../../utils/http';

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
    envList: ['dev', 'fat', 'pre', 'pro']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleConfirm({ detail: { value } }) {
      switchEnv(value);
    },
    handleCancel() {
      this.triggerEvent('cancel');
    }
  }
})
