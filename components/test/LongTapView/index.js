// components/test/LongTapView/index.js
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
    startTime: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchstart({ timeStamp }) {
      this.setData({ startTime: timeStamp });
    },
    touchend({ timeStamp }) {
      const { startTime } = this.data;
      let interval = timeStamp - startTime;
      if (interval > 1000) {
        this.triggerEvent('longTap');
      }
    }
  }
})
