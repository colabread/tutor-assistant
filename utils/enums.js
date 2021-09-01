export const taskStateEnum = {
  TO_TRAVEL: {
    text: '待出行',
    color: '#FF9E00',
    bgColor: '#fff0cc'
  },
  IN_THE_TRAVEL: {
    text: '出行中',
    color: '#00C660',
    bgColor: '#ccf4df'
  },
  COMPLETED: {
    text: '已完成',
    color: '#61697B',
    bgColor: '#e3e8f3'
  },
  CANCELED: {
    text: '已取消',
    color: '#E95833',
    bgColor: '#fbddd6'
  },
}

export const workTypeEnum = {
  TUTOR: '导师',
  SUPPORT_TUTOR: '导师助理',
  LOGISTICS: '后勤',
  MEDIC: '医护',
  LEADER: '领队',
  SECOND_LEADER: '副领队',
  DRILLMASTER: '教官',
  GUIDE: '导游',
}

export const clockInPointEnum = {
  IN_CLASS: '进班交接',
  GET_ON: '去程上车',
  ARRIVED: '抵达基地',
  RESTAURANT: '餐厅',
  GET_ON_BACK: '返程上车',
  BACK_TO_SCHOOL: '返校交接'
}

export const nameListTypeEnum = {
  HEAD_TEACHER: '班主任',
  FOLLOW_TEACHER: '随行老师',
  MASTER_TEACHER: '校长',
  ADMIN_TEACHER: '行政老师',
  STUDENT: '学生',
}

export const gradeEnum = {
  GRADE_ONE: '一年级',
  GRADE_TWO: '二年级',
  GRADE_THREE: '三年级',
  GRADE_FOUR: '四年级',
  GRADE_FIVE: '五年级',
  GRADE_SIX: '六年级',
  GRADE_SEVEN: '七年级',
  GRADE_EIGHT: '八年级',
  GRADE_NINE: '九年级'
}

export const classEnum = {
  CLASS_ONE: '一班',
  CLASS_TWO: '二班',
  CLASS_THREE: '三班',
  CLASS_FOUR: '四班',
  CLASS_FIVE: '五班',
  CLASS_SIX: '六班',
  CLASS_SEVEN: '七班',
  CLASS_EIGHT: '八班',
  CLASS_NINE: '九班',
  CLASS_TEN: '十班',
  CLASS_ELEVEN: '十一班',
  CLASS_TWELVE: '十二班',
  CLASS_THIRTEEN: '十三班',
  CLASS_FOURTEEN: '十四班',
  CLASS_FIFTEEN: '十五班'
}

export const clockInStateEnum = {
  UNCOMPLETED: '打卡取消',
  COMPLETED: '打卡完成'
}

export const alarmMsgTypeEnum = {
  OUT_OF_FENCE: {
    icon: '/images/msg-safe.png',
    title: '学生安全信息',
    subTitle: '学生离队',
    content: '跨越电子围栏区域，请核实！',
  },
  OFF_LINE: {
    icon: '/images/msg-device.png',
    title: '设备信息',
    subTitle: '设备离线',
    content: '设备已离线，无法定位，请核实！',
  },
}