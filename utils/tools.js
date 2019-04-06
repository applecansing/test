/**
 * 验证手机号码或电话号码
 */
function checkMobileAndTel(value) {
  return /^1(3|4|5|7|8)\d{9}$/.test(value);
};
/**
 * 去除左右空格
 */
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
/*判断是否为空*/
function checkNoNull(val) {
  return trim(val).length == 0 ? true : false;
}
/*秒转换成时间*/
function formatTime(second) {
  return [parseInt(second / 60 / 60) + '时', parseInt(second / 60 / 60) + '分', second % 60 + '分'].join(",").replace(/,/g, '');
}
/*时间戳转北京时间*/
function getLocalTime(nS) {
  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}
function toast(msg,icon){
  var icon=icon?icon:'loading';
  wx.showToast({
    title: msg,
    icon:icon
  })
}
function wx_login(cb,that){//登录
  wx.login({
    success: function (e) {
      wx.getUserInfo({
        success: function (res) {
          that.globalData.userCode = e.code;
          typeof cb == "function" && cb(1, res.userInfo);
          var userInfo = res.userInfo;
          var code = e.code;
          userInfo = {
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName,
            code: code,
            customer_id: 1
          };
          that.wxRequest(
            '/Wxsite/Base/register',
            userInfo,
            function (res) {
              console.log("登录返回的", res);
              if (res.data.code == 1) {
                that.globalData.userInfo = res.data.data;
                var token = res.data.token;
                that.globalData.token = token;
                typeof cb == "function" && cb(2, res.data.data);
              } else {
                wx.showToast({
                  title: '登录失败'
                })
              }
            })
        }
      })
    }
  })
}
function get_id(app,token, encrypteddata, iv, session_key,cb) {//获取群id
  console.log(token);
  console.log(encrypteddata);
  console.log(iv);
  console.log(session_key);
  app.wxRequest('/App/Activity/api', { 'api_name': 'getOpenGid', 'token': token, 'encrypteddata': encrypteddata, 'iv': iv, 'session_key': session_key }, function (res) {
      console.log('获取id返回的');
      console.log(res);
      var code = JSON.parse(res.data.trim()).code;
      res = JSON.parse(JSON.parse(res.data.trim()).data);
      console.log(res.openGId);
      if(code == 1){
        cb = cb(res.openGId);
      }else{
        cb = cb(false);
      }
  })
}
function get_city(cb){//获取当前位置详细信息
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      var QQMapWX = require('./qqmap-wx-jssdk.min.js');
      var qqMap = new QQMapWX({
        key: 'H3ABZ-W4UK3-RZY3H-3FPJ3-PNLES-L3BZG'
      });
      qqMap.reverseGeocoder({
        location: {
          longitude: res.longitude,
          latitude: res.latitude
        },
        success: function (data) {
          if (typeof cb === "function")cb(data);
        }
      })
    }
  })
}
function goTop(){
  if (wx.pageScrollTo) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  } else {
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，可能会影响您的使用。'
    })
  }
}
function get_prevPage(page) {
  var page = page ? (parseInt(page) + 1) : 2;
  var pages = getCurrentPages();
  var prevPage = pages[pages.length - page];
  if (prevPage == undefined || prevPage == null) return 0;
  return prevPage;
}
function search_key(name){
  if(this.isNull(name))return false;
  if(wx.getStorageSync('search_key')){
    let key = wx.getStorageSync('search_key');
    let onOff = false;
    key.forEach((item, index) => {
      if(item == name){onOff = true ;return false;}
    });
    if(onOff)return false;
    key.unshift(name);
    wx.setStorage({
      key: "search_key",
      data: key.splice(0,5)  //我只保存五个搜索记录
    });
  }else{
    let key = [];
    key.push(name);
    wx.setStorage({
      key: "search_key",
      data: key
    });
  }
}
module.exports = {
  checkPhone: checkMobileAndTel,//手机验证
  trim: trim,//去左右空格
  isNull: checkNoNull,//判断是否为空
  getTime: formatTime,
  getLocalTime: getLocalTime,
  toast:toast,
  wx_login: wx_login,
  get_id: get_id,
  get_city:get_city,//获取当前位置详细信息
  goTop: goTop,//回到顶部，
  get_prevPage:get_prevPage,
  search_key:search_key //保存搜索关键字
}