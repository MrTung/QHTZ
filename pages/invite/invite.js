const util = require('../../utils/util.js');
const tmUrl = require('../../utils/tmUrl.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageCode:null,
    imgUrl: "https://apis.dzzky.com/upload/codebg.jpg", //图片链接
    pWidth:"",
    pHeight:"",
  },

  share(){
    this.savePhoto();
  },

  //获取小程序码
  getQrcode() {
    let that = this;
    wx.request({
      url: tmUrl.url_getwxacodeunlimit,
      data: {
        scene: app.globalData.userInfo.id
      },
      success: function (res) {
        that.setData({
          imageCode: tmUrl.imgageHost + res.data.data[0].replace('..', "")
        })
      }
    })
  },

  handleImagePreview(e) {
    return;
    const image = e.target.dataset.url
    wx.previewImage({
      current: image,  //当前预览的图片
      urls: [image],  //所有要预览的图片
    })
  },


  /**
   * 生命周期函数--监听页面加载 用户扫码进入后的逻辑
   */
  onLoad: function (options) {

    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        that.setData({
          pWidth: clientWidth,
          pHeight: clientHeight
        });
      }
    });
   
    this.getQrcode();
  
  },

  savePhoto: function () {
    let that = this
    // 提示用户正在合成，否则用户可能有不当操作或者以为手机卡死
    wx.showLoading({
      title: '保存中...',
    });

    // 需要下载图片，因为画布不能直接绘制网络图片
    wx.downloadFile({
      url: 'https://apis.dzzky.com/upload/codebg.jpg', // 绘制的第一张图片的下载路径
      success(res) {
        // 创建画布对象
        const ctx = wx.createCanvasContext("myCanvas", that)
        // 获取图片信息，要按照原图来绘制，否则图片会变形
        wx.getImageInfo({
          src: 'https://apis.dzzky.com/upload/codebg.jpg',
          success: function (res) {
            // 根据 图片的大小 绘制底图 的大小
            // console.log(" 绘制底图 的图片信息》》》", res)
            let imgW = 1080
            let imgH = 1920
            let imgPath = res.path

            that.setData({
              canvasHeight: imgH,
              canvasWidth: imgW
            })
            // 绘制第二张图片 二维码
            ctx.drawImage(imgPath, 0, 0, imgW, imgH)
            wx.getImageInfo({
              src: that.data.imageCode, // 二维码图拍呢的路径
              success: function (res) {
                // console.log(" 绘制二维码》》》", res)
                // 绘制二维码，图片固定为300px，留白50px,固定在图片右下角，具体放置位置 你可以进行计算，因为画布的大小你是知道的，所以确定位置也很简单
                ctx.drawImage(res.path, (imgW - 260)/2,1400,260, 260)
                ctx.draw();

               // 这里用了延时截屏，防止图片没加载完成，截图出现白屏的现象
                  wx.canvasToTempFilePath({
                    canvasId: 'myCanvas',
                    success: function (res) {
                      var tempFilePath = res.tempFilePath

                      // 保存到相册
                      wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success(res) {

                          wx.hideLoading()

                          wx.showModal({
                            title: '温馨提示',
                            content: '图片保存到相册中，可分享给好友',
                            showCancel: false
                          })
                        },
                        fail(res) {
                          wx.hideLoading()
                          wx.showModal({
                            title: '温馨提示',
                            content: '图片保存失败，请重试',
                            showCancel: false
                          })
                        }
                      })
                      console.log("生成的图片", tempFilePath)
                    },
                    fail: function (res) {
                      console.log("生成的图片 失败 fail fail fail ",res)
                    }
                  }, this)
              },
            })
          }
        })
      }
    })
  },

})