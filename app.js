
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录         // 发送 res.code 到后台换取 openId, sessionKey, unionId
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx8f7d21ab0675df05&secret=aea9d8ebbb657bb90f95b3a3cd806bd3&js_code=JSCODE&grant_type=authorization_code',
            data: {
              appid: 'wx8f7d21ab0675df05',
              secret: 'aea9d8ebbb657bb90f95b3a3cd806bd3',
              js_code: res.code,
              grant_type: 'authorization_code'
            },
            success(v) {
              console.log(v)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });


  },
  globalData: {
    userInfo: null
  }
})