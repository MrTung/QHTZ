const util = require('../../../utils/util.js');
const tmUrl = require('../../../utils/tmUrl.js');

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userinfo: null,
    mobile: '',
    wxNum:'',
    bankName: '',
    bankNo: '',
    bankSubName: '',
    hiddenmodalput:true,
    code:'',
  },
  //绑定输入框的值
  bindKeyInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  //手机验证码
  bindCodeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },

  onLoad: function () {
    
    let that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {

        that.setData({
          userinfo: res.data,
          mobile: res.data.userId,
          wxNum: res.data.wxNum,
          bankName: res.data.bankName,
          bankNo: res.data.bankNo,
          bankSubName: res.data.bankSubName,
        });
      },
    })
  },


//提交表单
  formSubmit: function (e) {

    let that = this;
    this.setData({
      wxNum: e.detail.value.wxNum,
      bankName: e.detail.value.bankName,
      bankNo: e.detail.value.bankNo,
      bankSubName: e.detail.value.bankSubName
    });

    let requestParams = {
      "id": this.data.userinfo.id,
      "wxNum": this.data.wxNum,
      "bankName": this.data.bankName,
      "bankNo": this.data.bankNo,
      "bankSubName": this.data.bankSubName,
    };

    util.requestLoading(tmUrl.url_editinfo, requestParams, '正在保存', function (res) {
      wx.showModal({
        title: '提示',
        content: '保存成功',
        showCancel: false
      })

      that.setData({
        hiddenmodalput: true,
        code: '',
      })

      wx.setStorage({
        key: 'userinfo',
        data: res,
      });

      util.getuserinfo();

      wx.navigateBack();

    });
  },

  //获取验证码
  getcode: function () {

    let that = this;
    if (!this.data.mobile || this.data.mobile.length != 11)
     return wx.showToast({
        title: '请输入有效手机号码',
        icon: 'none',
      })

    let requestParams = {
      "id": this.data.userinfo.id,
      "phone": this.data.mobile,
    };

    wx.showLoading();

    wx.request({
      url: tmUrl.sendsms,
      data: requestParams,
      success(v) {
        wx.hideLoading();
        that.setData({
          hiddenmodalput: !that.data.hiddenmodalput
        })
      }
    })
  },

  //确认
  confirm: function () {
   
    let that = this;

    if (this.data.code.length == 0)
     return wx.showToast({
      title: '请输入6位数验证码',
      icon: 'none',
    })

    let requestParams = {
      "id": this.data.userinfo.id,
      "phone": this.data.mobile,
      "code": this.data.code,
    };

    util.requestLoading(tmUrl.url_editphone, requestParams, '正在绑定', function (res) {
      console.log(res);
      // if(res.)
      // return wx.showToast({
      //   title: '绑定失败',
      //   icon: 'none',
      // })
        wx.showModal({
          title: '提示',
          content: '绑定成功',
          showCancel: false
        })

        that.setData({
          hiddenmodalput: true,
          code:'',
        })

        wx.setStorage({
          key: 'userinfo',
          data: res,
        });

        app.globalData.userInfo = res;
     
    });
  }
})
