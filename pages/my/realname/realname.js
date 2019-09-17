//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    name: '张三',
    cardid: '330303030303033030030',
    img1:"/resource/image/shenfenzheng2.png",
    img2: "/resource/image/shenfenzheng1.png",
  },
  
  onLoad: function () {
    
  },

  chooseImage(e) {
    const idx = e.target.dataset.idx

    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        if (idx == '1') {
          this.setData({
            img1: res.tempFilePaths[0]
          })
        }
        else if (idx == '2'){
          this.setData({
            img2: res.tempFilePaths[0]
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


  //事件处理函数
  submitForm(e) {
    const title = this.data.title
    const content = this.data.content

    if (title && content) {
      wx.showLoading({
        title: '正在创建...',
        mask: true
      })

      // 将选择的图片组成一个Promise数组，准备进行并行上传
      const arr = this.data.images.map(path => {
        return wxUploadFile({
          url: config.urls.question + '/image/upload',
          filePath: path,
          name: 'qimg',
        })
      })

      // 开始并行上传图片
      Promise.all(arr).then(res => {
        // 上传成功，获取这些图片在服务器上的地址，组成一个数组
        return res.map(item => JSON.parse(item.data).url)
      }).catch(err => {
        console.log(">>>> upload images error:", err)
      }).then(urls => {
        // 调用保存问题的后端接口
        return createQuestion({
          title: title,
          content: content,
          images: urls
        })
      }).then(res => {
        // 保存问题成功，返回上一页（通常是一个问题列表页）
        const pages = getCurrentPages();
        const currPage = pages[pages.length - 1];
        const prevPage = pages[pages.length - 2];

        // 将新创建的问题，添加到前一页（问题列表页）第一行
        prevPage.data.questions.unshift(res)
        $digest(prevPage)

        wx.navigateBack()
      }).catch(err => {
        console.log(">>>> create question error:", err)
      }).then(() => {
        wx.hideLoading()
      })
    }
  }
})
