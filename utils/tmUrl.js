var api_host = "http://39.100.235.160:8011/admin";  

module.exports = {

  imgageHost:'http://39.100.235.160:8011',

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
};