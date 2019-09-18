//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
    var getAppInfo = app.globalData.userInfo;
  

  },

  myinfo: function () {
    wx.navigateTo({
      url: '/pages/my/myinfo/myinfo',
    })
  },

  realname: function () {
    wx.navigateTo({
      url: '/pages/my/realname/realname',
    })
  },

  
})
