const util = require('../../../utils/util.js');
const tmUrl = require('../../../utils/tmUrl.js');


//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    // 最后一次单击事件点击发生时间
    lastTapTime: 0,
    // 单击事件点击后要触发的函数
    lastTapTimeoutFunc: null, 

    userinfo:null,
    userName: '',
    idCardNo: '',
    img1:"/resource/image/shenfenzheng2.png",
    img2: "/resource/image/shenfenzheng1.png",
    imgid1:'',
    imgid2: '',
  },
  
  onLoad: function () {
    let that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        that.setData({
          userinfo: res.data,
          userName: res.data.userName,
          idCardNo: res.data.idCardNo,
          imgid1: res.data.fileId.split(',')[0],
          imgid2: res.data.fileId.split(',')[1],
        });

        if (that.data.imgid1.length > 0) {
          wx.request({
            url: tmUrl.getFileurl,
            data: {
              id: that.data.imgid1,
            },
            success(v) {
              let url = v.data.data[0].replace('..', "");
              that.setData({
                img1: tmUrl.imgageHost + url
              });
            }
          })
        }

        if (that.data.imgid2.length > 0) {
          wx.request({
            url: tmUrl.getFileurl,
            data: {
              id: that.data.imgid2,
            },
            success(v) {

              let url = v.data.data[0].replace('..', "");
              that.setData({
                img2: tmUrl.imgageHost + url
              });
            }
          })
        }
      },

     
    })

   

  },

  /// 长按
  longTap: function (e) {
    this.chooseImage(e);
  },

  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },

  /// 单击、双击
  multipleTap: function (e) {
    var that = this
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.touchEndTime - that.touchStartTime < 350) {
      // 当前点击的时间
      var currentTime = e.timeStamp
      var lastTapTime = that.lastTapTime
      // 更新最后一次点击时间
      that.lastTapTime = currentTime

      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        // 成功触发双击事件时，取消单击事件的执行
        clearTimeout(that.lastTapTimeoutFunc);
      } else {
        // 单击事件延时300毫秒执行，这和最初的浏览器的点击300ms延时有点像。
        that.lastTapTimeoutFunc = setTimeout(function () {
        
          const idx = e.target.dataset.idx

          if (idx == '1' && that.data.imgid1.length > 0)
            return that.handleImagePreview(e);
          else if (idx == '2' && that.data.imgid2.length > 0)
            return that.handleImagePreview(e);

          that.chooseImage(e);

        }, 100);
      }
    }
  },

  chooseImage(e) {
   
    var that = this

    const idx = e.target.dataset.idx

    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        if (idx == '1') {
          that.setData({
            img1: res.tempFilePaths[0]
          })

          //上传文件
          wx.uploadFile({
            url: tmUrl.uploadurl, //仅为示例，非真实的接口地址
            filePath: that.data.img1,
            name: Date.parse(new Date()).toString(),
            success(res) {
              
              const result = JSON.parse(res.data);
              
              that.data.imgid1 = result.data[0];
              
              util.getuserinfo();
            }
          })
        }
        else if (idx == '2'){
          that.setData({
            img2: res.tempFilePaths[0]
          })

          //上传文件
          wx.uploadFile({
            url: tmUrl.uploadurl, //仅为示例，非真实的接口地址
            filePath: that.data.img2,
            name: Date.parse(new Date()).toString(),
            success(res) {
              const result = JSON.parse(res.data);
              
              that.data.imgid2 = result.data[0]; 
              
              util.getuserinfo();

            }
          })
        }
      }
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx
    if (idx == '1') {
      this.setData({
        img1: ""
      })
    }
    else if (idx == '2') {
      this.setData({
        img2: ""
      })
    }
  },

  handleImagePreview(e) {
    const image = e.target.dataset.url
    wx.previewImage({
      current: image,  //当前预览的图片
      urls: [image],  //所有要预览的图片
    })
  },


  //提交表单
  formSubmit: function (e) {
    this.setData({
      userName: e.detail.value.userName,
      idCardNo: e.detail.value.idCardNo,
    });

    if (this.data.userName.length == 0 || this.data.idCardNo.length == 0)
      return wx.showToast({
        title: '请输入真实姓名和身份证号',
        icon: 'none',
      })

    if (this.data.imgid1.length == 0 || this.data.imgid2.length == 0)
      return wx.showToast({
        title: '请上传身份证正面和反面照片',
        icon: 'none',
      })

      //调用接口
      this.submitData();
  },

  //调用接口
  submitData() {
    var that = this;

    var getAppInfo = app.globalData.userInfo;


    let requestParams = {
      "id": getAppInfo.id,
      "idCardNo": this.data.idCardNo,
      "fileId": this.data.imgid1 + ',' + this.data.imgid2,
      "userName": this.data.userName,
    };

    util.requestLoading(tmUrl.url_editidcard, requestParams, '正在保存..', function (res) {
        wx.showModal({
          title: '提示',
          content: '提交成功',
          showCancel: false
        })


      that.getuserinfo();

      wx.navigateBack();

     
    });
  },


//更新用户信息
  getuserinfo(){
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

                app.globalData.userInfo = v.data.data[0];
                console.log('设置userinfo成功');
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
  }
})
