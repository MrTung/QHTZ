const util = require('../../utils/util.js');
const tmUrl = require('../../utils/tmUrl.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataProvider: [], // 客户列表
  },

  //获取客户列表数据
  getDataProvider: function () {
    var that = this;
    var getAppInfo = app.globalData.userInfo;
    // 13575784241
    wx.request({
      url: tmUrl.url_yzsalescustomers,
      data: {
        mobile: getAppInfo.userId,
        _uiName_: 'eleme',
        _pagination: { "pageNumber": 1, "pageSize": 100 }
      },
      success(res) {
        console.log(res);
        that.setData({
          dataProvider: res.data.data[0].customers
        })
      }
    })

    // wx.request({
    //   url: tmUrl.url_relationshiplist,
    //   data: {
    //     userId: getAppInfo.id,
    //   },
    //   success(res) {
    //     console.log(res);
    //     that.setData({
    //       dataProvider: res.data.data
    //     })
    //   }
    // })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataProvider();
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