//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null,
    statusname:'',
    masterInfo:null,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
    var getAppInfo = app.globalData.userInfo;

    this.setData({
      masterInfo: getAppInfo.masterInfo,
    });
    
    switch (getAppInfo.userStatus/1) {
      case 0:
        this.setData({
          statusname: '待认证'
        })
        break;
      case 1:
        this.setData({
          statusname: '已认证'
        })
        break;
      case 2:
        this.setData({
          statusname: '已提交,待审核'
        })
        break;
      case -1:
        this.setData({
          statusname: '未通过'
        })
        break;
      default:
        this.setData({
          statusname: ''
        })
        break;
    } 
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
