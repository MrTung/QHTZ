const util = require('./utils/util.js');
const tmUrl = require('./utils/tmUrl.js');


App({
  globalData: {
   userInfo:null,
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


    let that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
           wx.request({
            url: tmUrl.url_getuserinfo,
            data: {
              code: res.code,
            },
            success(v) {
              console.log(v)

              wx.setStorage({
                key: 'userinfo',
                data: v.data.data[0],
              });

              that.globalData.userInfo = v.data.data[0];
              console.log('设置userinfo成功');

              

            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });

  },
 
})