App({
  onLaunch() {
    
  },
  onShow (options) {
    
  },
  onHide () {
    
  },
  require(path) {
    return require(`${path}`);
  },
  globalData: {
    userInfo: null,
    taskState: 0, // 任务状态，0：全部
    isReloadTask: false,  // 是否重载任务列表
  }
})
