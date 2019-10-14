// pages/money/money.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataProvider: [], 
    totalMoney:0.00,
    unlockMoney: 0.00,
  },

  //资金明细
  gotomoneydetail: function () {
    wx.navigateTo({
      url: '../moneydetail/moneydetail'
    })
  },

  getmoney:function(){
    if(this.data.unlockMoney == 0)
      return wx.showToast({
        title: '您的可提现金额为零，无法提现',
        icon: 'none',
      })

    wx.navigateTo({
      url: '../getmoney/getmoney'
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})