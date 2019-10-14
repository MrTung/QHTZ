const util = require('../../utils/util.js');
const tmUrl = require('../../utils/tmUrl.js');
var app = getApp();

Page({
  data: {
    dataProvider: [], // 订单列表
    dataProvider0: [], // 自己的订单

    tabs: ['我的订单', '推广订单'],
    // tabs: ['我的订单', '推广订单', '待发货', '待收货', '待评价'],

    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0,
    //是否竖直方向滑动
    YScroll: true,
    //当前第几页
    curPage: 1,
    hasmore: 1,
    pageSize: 20, // 每页的数量
  },


//订单map
  getOrdername(type) {
    const statusMap = {
      3: "待付款",
      5: "已付款",
      6: "已发货",
      100: "交易完成"
    };
    return statusMap[type];
  },
  onShow: function () {
    
  },

  onLoad: function (options) {
    this.getDataProvider();
    try {
      let { tabs } = this.data;
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
      this.data.stv.windowWidth = res.windowWidth;
      this.setData({ stv: this.data.stv })
      this.tabsCount = tabs.length;
    } catch (e) {
    }

    var res = wx.getSystemInfoSync()
    this.setData({
      activeTab: options.ordertype,

    });

    this._updateSelectedPage(options.ordertype);

  },
  handlerStart(e) {
    let { clientX, clientY } = e.touches[0];
    this.startX = clientX;
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.data.stv.tStart = true;
    this.tapStartTime = e.timeStamp;
    this.setData({ stv: this.data.stv })
  },
  handlerMove(e) {

    let { clientX, clientY } = e.touches[0];
    let { stv } = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    stv.offset += offsetX;
    if (stv.offset <= 0) {
      stv.offset = 0;
    } else if (stv.offset >= stv.windowWidth * (this.tabsCount - 1)) {
      stv.offset = stv.windowWidth * (this.tabsCount - 1);
    }
    this.setData({
      stv: stv,
      YScroll: false
    });
  },
  handlerCancel(e) {

  },
  handlerEnd(e) {
    if (this.data.YScroll == false) {
      let { clientX, clientY } = e.changedTouches[0];
      let endTime = e.timeStamp;
      let { tabs, stv, activeTab } = this.data;
      let { offset, windowWidth } = stv;
      //快速滑动
      if (endTime - this.tapStartTime <= 300) {
        //向左
        if (Math.abs(this.tapStartY - clientY) < 50) {
          if (this.tapStartX - clientX > 5) {
            if (activeTab < this.tabsCount - 1) {
              this.setData({ activeTab: ++activeTab })
            }
          } else {
            if (activeTab > 0) {
              this.setData({ activeTab: --activeTab })
            }
          }
          stv.offset = stv.windowWidth * activeTab;
        } else {
          //快速滑动 但是Y距离大于50 所以用户是左右滚动
          let page = Math.round(offset / windowWidth);
          if (activeTab != page) {
            this.setData({ activeTab: page })
          }
          stv.offset = stv.windowWidth * page;
        }
      } else {
        let page = Math.round(offset / windowWidth);
        if (activeTab != page) {
          this.setData({ activeTab: page })
        }
        stv.offset = stv.windowWidth * page;
      }
      stv.tStart = false;
      this.setData({
        stv: this.data.stv,
        YScroll: true
      })
      this.getDataProvider();
    }
  },
  _updateSelectedPage(page) {
    let { tabs, stv, activeTab } = this.data;
    activeTab = page;
    this.setData({ activeTab: activeTab })
    stv.offset = stv.windowWidth * activeTab;
    this.setData({
      stv: this.data.stv,
      curPage: 1,
      dataProvider: []
    })

    this.getDataProvider();
  },
  handlerTabTap(e) {
    this._updateSelectedPage(e.currentTarget.dataset.index);
  },


  bindscrolltolowerHandler: function () {

    if (this.data.hasmore > 0) {
      this.setData({
        curPage: this.data.curPage + 1
      })

      this.getDataProvider();
    }

  },



//获取订单列表数据
  getDataProvider: function (searchKeyword) {
    var that = this;

    var ordertype = "";
    switch (parseInt(this.data.activeTab)) {
      case 0:
        ordertype = "";
        break;
      case 1:
        ordertype = "waitingPaymentOrder";
        break;

      case 2:
        ordertype = "waitingShippingOrder";
        break;

      case 3:
        ordertype = "waitingConfirmReceiveOrder";
        break;

      case 4:
        ordertype = "waitingReviewOrder";
        break;
    }

    var requestParams = {
      pageSize: that.data.pageSize,
      pageNum: that.data.curPage,
      orderButtonEnum: ordertype
    };
    if (searchKeyword) {
      requestParams.searchKeyword = searchKeyword;
    }

    var getAppInfo = app.globalData.userInfo;
    // 13575784241 getAppInfo.userId
    wx.request({
      url: tmUrl.url_allorderlist,
      data: {
        mobile: getAppInfo.userId,
        _uiName_: 'eleme',
        _pagination: { "pageNumber": 1, "pageSize": 10 }
      },
      success(res) {
        console.log(res);
        res.data.data[0].list.forEach(function (item) {
          item.statename = that.getOrdername(item.state);
        });

        that.setData({
          dataProvider: res.data.data[0].list
        })
      }
    })


    wx.request({
      url: tmUrl.url_myallorderlist,
      data: {
        mobile: getAppInfo.userId,
        _uiName_: 'eleme',
        _pagination: { "pageNumber": 1, "pageSize": 10 }
      },
      success(res) {

        res.data.data[0].full_order_info_list.forEach(function (item) {
          item.full_order_info.order_info.created = util.formatTime(item.full_order_info.order_info.created, 'Y-M-D h:m:s');
        });
       
        that.setData({
          dataProvider0: res.data.data[0].full_order_info_list
        })

        
      }
    })
    
  },

  

  //刷新处理
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },



});