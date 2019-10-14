// var api_host = "http://39.100.235.160:8011/admin";  

var api_host = "https://apis.dzzky.com/admin";  


module.exports = {

  imgageHost:'https://apis.dzzky.com',

  //上传文件的地址
  uploadurl: api_host + '/sys/file',

  //根据id获取文件路径
  getFileurl: api_host + '/sys/file/url',

  //发送短信验证码
  sendsms: api_host + '/sendSms',

  // 用微信的用户code登录（或注册一个新账号，后台会请求微信的用户数据的）
  url_getuserinfo: api_host + '/wechat/userinfo',

  // 手机号码
  url_editphone: api_host + '/wechat/userinfo/phone',

  // 编辑用户信息 id wxNum bankName  bankNo bankSubName
  url_editinfo: api_host + '/wechat/userinfo/editinfo',

  // 编辑实名认证信息 id  idCardNo  fileId   userName
  url_editidcard: api_host + '/wechat/userinfo/editidcard',

  //获取订单列表 分销订单
  url_allorderlist: api_host + "/getyzsalesmantrades",

  //获取订单列表 自己订单
  url_myallorderlist: api_host + "/salesman/order/list",

  //获取客户列表
  url_yzsalescustomers: api_host + "/getyzsalescustomers",

   //获取小程序码
  url_getwxacodeunlimit: api_host + "/wechat/getwxacodeunlimit",

  //绑定用户关系
  url_relationship: api_host + "/userinfo/relationship",

 //获取客户列表
  url_relationshiplist: api_host + "/userinfo/relationship/list/uid"


};