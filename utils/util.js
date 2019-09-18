const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTimeStr(date, type) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join(type)
}

function priceSplit(nowPrice, delPrice) {

  let priceStr = nowPrice + ''
  let priceArr = priceStr.split('.');

  let priceObj = {
    priceLeft: priceArr[0],
    priceRight: priceArr[1] ? '.' + priceArr[1] : '',
    delPrice: delPrice ? delPrice + '' : ''
  }

  return priceObj;
}

//无进度条的网络请求
function request(url, params, success, fail) {
  this.requestLoading(url, params, "", success, fail)
}


// 展示进度条的网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
function requestLoading(url, params, message, success, fail) {

  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: url,
    data: params,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    success: function (res) {
      if (message != "") {
        wx.hideLoading()
      }
      if (res.statusCode == 200) {
        success(res.data.data[0])
      } else {
        wx.showToast({
          title: '请求失败',
          image: '/resource/image/error2.png'
        })
      }

    },
    fail: function (res) {
      if (message != "") {
        wx.hideLoading()
      }

      wx.showToast({
        title: '请求失败',
        image: '/resource/image/error2.png'
      })
    },
    complete: function (res) {

    },
  })
}


/*
网络请求
@param: params
  {
    type: '', // 可以取值  'GET'(默认)、 'POST'(POST请求， 以 'application/json'编码请求数据)、 'POST_FORM'(POST请求，以 'x-www-form-urlencoded' 方式编码请求数据)

    loadingMessage: '', // 加载中的提示消息， 默认为'加载数据中...'。 为空表示不显示加载中消息

    headerParams: null, // 放在 http请求头中的参数, 类型是 js 对象； 默认带上 app.globalData.tmService.session_v2

    data: null, // 请求数据
  }
@param: successCallback
  参数是后台返回的数据
@param : app 调用处要穿过来，微信小程序的app对象，用来添加 session 这个 http请求头
@param failCallback
  参数： {"code": <...>, "data": null, "message": "...", "time": null }  其中 -999999 是小程序自定义的错误码，表示网络请求失败或者后台返回的数据不是合法json
@说明
  土猫网小程序后台的接口 的统一格式 {code: '', data: '', message: ''}
  //code响应码，0-操作成功；-1-操作失败；40001-未授权，禁止访问；40002-权限校验失败；40009-接口授权失败，系统异常；-999-系统异常，请联系管理员
*/
function httpRequest(url, params, successCallback, app, failCallback){
  if(!url) return;
  var default_headerParams = null;
  if (typeof app != 'undefined' && app && app.globalData && app.globalData.tmService && app.globalData.tmService.session_v2){
    default_headerParams = {
      session: app.globalData.tmService.session_v2
    }
  }
  params = Object.assign({}, {
    type: 'GET',
    loadingMessage: '加载数据中...',
    headerParams: default_headerParams, 
    data: null,
  }, params);
  if (params.type){
    params.type = params.type.toUpperCase();
  }
  if (params.loadingMessage != '') {
    wx.showLoading({
      title: params.loadingMessage,
    })
  }
  var my_method = (params.type == 'GET' ? 'GET' : 'POST');
  var my_header = {};
  if (params.type == 'POST_FORM'){
    my_header['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
  }
  if (params.headerParams){
    for (let key in params.headerParams){
      my_header[key] = params.headerParams[key];
    }
  }
  wx.request({
    url: url,
    data: params.data || {},
    header: my_header || {},
    method: my_method,
    success: function (res) {
      if (params.loadingMessage != '') {
        wx.hideLoading()
      }
      if (res.statusCode == 200) {
        if (res.data.code === 0 || res.data.code === '0'){
          if (typeof successCallback != 'undefined' && successCallback) {
            successCallback(res.data.data);          
          }     
        }else{
          if(typeof failCallback != 'undefined' && failCallback){
            failCallback(res.data);
          }else{
            wx.showToast({
              title: res.data.message || '加载数据失败',
              image: '/resource/image/error2.png'
            });
          }
        }
      } else {
        if(typeof failCallback != 'undefined' && failCallback){
          failCallback({
            "code": -999999,
            "data": null,
            "message": "加载数据失败",
            "time": null
          });
        }else{
          wx.showToast({
            title: '加载数据失败',
            image: '/resource/image/error2.png'
          });
        }
      }

    },
    fail: function (res) {
      if (params.loadingMessage != '') {
        wx.hideLoading()
      }
      if(typeof failCallback != 'undefined' && failCallback){
        failCallback({
          "code": -999999,
          "data": null,
          "message": "加载数据失败",
          "time": null
        });
      }else{
        wx.showToast({
          title: '加载数据失败',
          image: '/resource/image/error2.png'
        });
      }
    },
    complete: function (res) {
    },
  })
}


/**
 * 处理产品列表数据的  image ，  使图片路径都以  https:// 开头
 * @param prdsList  ,  数组， 每一项都是有 image属性的 对象
 *    方法直接改变了 prdsList
 * @return 把prdsList返回去（已经改变了）
 */
function normallizePrdsImage(prdsList){
  if (prdsList && prdsList.length){
    prdsList.forEach(function (item) {
      if (item && item.image){
        if (item.image.indexOf('http://') === 0) {
          item.image = item.image.replace('http://', 'https://');
        } else if (item.image.indexOf('//') === 0) {
          item.image = item.image.replace('//', 'https://');
        }
      }
    });
  }
  return prdsList;
}

function normallizeImage(prdImage){
  var newImg = prdImage;
  if(typeof prdImage == 'string'){
    if (prdImage.indexOf('http://') === 0) {
      newImg = prdImage.replace('http://', 'https://');
    } else if (prdImage.indexOf('//') === 0) {
      newImg = prdImage.replace('//', 'https://');
    }else{
      newImg = prdImage;
    }
  }
  return newImg;
}

// 把 url 的查询字符串 type=jsview 换成 type=mini
// 或者加上 查询字符串 type=mini
function normallizeUrlType(url){
  var result = url;
  if(typeof url == 'string'){
    // if (url.indexOf('http://') === 0) {
    //   result = url.replace('http://', 'https://');
    // } else if (url.indexOf('//') === 0) {
    //   result = url.replace('//', 'https://');
    // }

    result = result.replace('type=jsview', 'type=mini');
    if(result.indexOf('type=mini') < 0){
      if(result.indexOf('?') > 0){
        result += '&type=mini';
      }else{
        result += '?type=mini';
      }
    }
  }
  return result;
}

/*
* 解析日期字符串
* @param: time_str,  日期时间字符串， 如 '2017-06-23 17:00:00'
* @return 一个 Date对象
* */
function parseDate(time_str) {
  var time = time_str.replace(/-/g,':').replace(' ',':'); // 注意，第二个replace里，是' '，中间有个空格，千万不能遗漏
  time = time.split(':');
  var date1;
  if(time.length == 3){
    date1 = new Date(time[0],(time[1]-1),time[2]);
  }else{
    date1 = new Date(time[0],(time[1]-1),time[2],time[3],time[4],time[5]);
  }
  return date1;
}

/*
* clone  深度克隆，但不包括function
* @param:val  类型 对象或数组
* @return 克隆的数组或对象
* */
function clone(obj) {
  if(typeof val == 'function'){
    throw new Error('不能克隆function');
  }
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    var copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr) && typeof attr != 'function') copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};

// 转码时把<>，空格符，&，'，""替换成html编码，解码就把html编码替换成对应的字符
/*1.用正则表达式实现html转码*/
function htmlEncode(str){
  var s = "";
  if(str.length == 0) return "";
  s = str.replace(/&/g,"&amp;");
  s = s.replace(/</g,"&lt;");
  s = s.replace(/>/g,"&gt;");
  s = s.replace(/ /g,"&nbsp;");
  s = s.replace(/\'/g,"&#39;");
  s = s.replace(/\"/g,"&quot;");
  return s;
}
/*2.用正则表达式实现html解码*/
function htmlDecode(str){
  var s = "";
  if(str.length == 0) return "";
  s = str.replace(/&amp;/g,"&");
  s = s.replace(/&lt;/g,"<");
  s = s.replace(/&gt;/g,">");
  s = s.replace(/&nbsp;/g," ");
  s = s.replace(/&#39;/g,"\'");
  s = s.replace(/&quot;/g,"\"");
  s = s.replace(/&oslash;/g, "ø");
  return s;
}



// 汪州 测试环境
//var api_host = "http://192.168.2.160:8280/app/";

// 沈华清 测试环境
// var api_host = "http://192.168.2.188:8080/app/";

// 145 测试环境
// var api_host = "http://192.168.100.145:80/app/";

// 正式环境
// var api_host = "https://www.toolmall.com/app/";



module.exports = {
  clone,

  normallizePrdsImage,

  normallizeImage,

  normallizeUrlType,

  parseDate,

  request: request,

  requestLoading: requestLoading,

  httpRequest,

  formatTime: formatTime,

  formatTimeStr: formatTimeStr,

  priceSplit: priceSplit,

  htmlEncode,

  htmlDecode,
  
};

