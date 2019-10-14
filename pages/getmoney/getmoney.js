//index.js
//获取应用实例
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance:0.00,
    exchangevalue:'',
    needbank:true,
  },

  //绑定输入框的值
  bindKeyInput: function (e) {
    this.setData({
      exchangevalue: e.detail.value
    })
  },

 //添加银行卡
  gotoaddbank: function() {
    wx.navigateTo({
      url: '/pages/my/myinfo/myinfo',
    })
  },
  //财务界面
  all: function () {
    this.setData({
      exchangevalue: this.data.balance
    })
  },

  //确认提现
  sure: function () {

    var getAppInfo = app.globalData.userInfo;

    if (this.data.exchangevalue == 0)
      return wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
      })

    if (!getAppInfo.bankNo)
      return wx.showToast({
        title: '请先添加提现银行卡',
        icon: 'none',
      })

    if (this.data.exchangevalue/1 > this.data.balance)
      return wx.showToast({
        title: '提现金额不能大于可用余额',
        icon: 'none',
      })


    return wx.showToast({
      title: '提现申请已提交,请耐心等待',
      icon: 'none',
    })

  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var getAppInfo = app.globalData.userInfo;

    if (getAppInfo.bankNo && getAppInfo.bankNo != ''){
      this.setData({
        needbank: false
      })
    }else{
      this.setData({
        needbank: true
      })
    }
    
  },

  
})