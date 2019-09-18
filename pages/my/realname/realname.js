const util = require('../../../utils/util.js');
const tmUrl = require('../../../utils/tmUrl.js');


//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
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

  chooseImage(e) {

    let that = this;
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

    let requestParams = {
      "id": this.data.userinfo.id,
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
     
    });
  }
})
