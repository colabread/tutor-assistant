// components/business/ClockInTravel/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    travelList: {
      type: Array,
      value: [
        {
          travelNo: 1,
          date: '2021-07-20',
          clockInPointList: [
            {
              title: '进班交接',
              state: 1
            },
            {
              title: '去程上车打卡',
              state: 1
            },
            {
              title: '抵达基地',
              state: 0
            },
            {
              title: '回程上车打卡',
              state: 0
            },
            {
              title: '结束',
              state: 0
            },
          ]
        },
        {
          travelNo: 2,
          date: '2021-07-21',
          clockInPointList: [
            {
              title: '进班交接',
              state: 0
            },
            {
              title: '上车打卡',
              state: 0
            },
            {
              title: '抵达基地',
              state: 0
            },
          ]
        },
        {
          travelNo: 3,
          date: '2021-07-22',
          clockInPointList: [
            {
              title: '进班交接',
              state: 0
            },
            {
              title: '上车打卡',
              state: 0
            },
            {
              title: '抵达基地',
              state: 0
            },
          ]
        },
      ],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeTravel: [0],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    expandTravel({ currentTarget: { dataset: { index } } }) {
      const { activeTravel } = this.data;
      activeTravel.push(index);
      this.setData({ activeTravel });
    },
  
    shrinkTravel({ currentTarget: { dataset: { index } } }) {
      const { activeTravel } = this.data;
      const indexTemp = activeTravel.findIndex(item => item === index);
      activeTravel.splice(indexTemp, 1);
      this.setData({ activeTravel });
    },
  }
})
