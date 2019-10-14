const util = require('../../utils/util.js');
const tmUrl = require('../../utils/tmUrl.js')
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //我的订单界面
  gotoOrder: function () {
    wx.navigateTo({
      url: '../order/order'
    })
  },
  //我的订单界面
  gotoCustomer: function () {
    wx.navigateTo({
      url: '../customer/customer'
    })
  },
  //邀请界面
  gotoinvite: function () {
    var getAppInfo = app.globalData.userInfo;

    if (getAppInfo.grade && getAppInfo.grade > 0)
    {
      wx.navigateTo({
        url: '../invite/invite'
      })
    }
    else{
      wx.showToast({
        title: '您还不是经销商,请联系管理员',
        icon: 'none',
      })
    }
  },
  //财务界面
  gotomoney: function () {
    wx.navigateTo({
      url: '../money/money'
    })
  },

  onLoad: function (options) {
    
    if (options.scene) {
      
      //从二维码里面获取推荐人的id
      let masterId = decodeURIComponent(options.scene);
      //将推荐人id存在本地数据里
      wx.setStorage({
        key: 'masterId',
        data: masterId,
      });

      if (app.globalData.userInfo){
        let studentId = app.globalData.userInfo.id;
        //如果存在id,则绑定用户关系
        if (studentId && studentId != masterId) {
          let that = this;
          wx.request({
            url: tmUrl.url_relationship,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' 
            },
            data: {
              studentId: studentId,
              masterId: masterId
            },
            success: function (res) {
              wx.removeStorage({
                key: 'masterId',
                success: function (res) { },
              })
            }
          })
        }
      } 
    }
  }
})
