const openAPI = {
  // 登录
  login: '/we/chat/auth/staff/login',
  // 文件上传
  uploadFile: '/base/simple/upload',
  multiUploadFile: '/base/upload',
  // 首页
  todayGroup: '/order/group/current-date/go',
  closeFence: '/order/group/electric-fence/close',
  openFence: '/order/group/electric-fence/open',
  // 任务部分
  taskPage: '/execute/task/page',
  taskDetail: '/execute/task/detail',
  taskStatistics: '/execute/task/status/statistics',
  clockIn: '/execute/task/clockIn',
  cancelClockIn: '/execute/task/clockIn/cancel',
  clockInDetail: '/execute/task/clockIn/detail',
  bindDevice: '/safe/device/bind',
  cancelBindDevice: '/safe/device/unbind',
  // 相册管理
  photoList: '/execute/task/photos/list',
  addPhoto: '/execute/task/photos/add',
  deletePhoto: '/execute/task/photos/delete',
  // 通讯录
  phoneBookList: '/execute/task/contact/list',
  // 出行名单
  nameList: '/execute/task/personnel/list',
  // 国家城市
  areaList: '/basic/location/list',
  // 基本信息
  setBasicInfo: '/resource/we/chat/staff/update',
  basicInfoDetail: '/resource/we/chat/staff/detail',
  // 预警名单
  alarmList: '/order/group/warning/personnel/list',
  // 围栏
  searchFence: '/order/group/student/coordinate',
  // 消息
  msgList: '/order/group/warning/messages',
};

export default openAPI;