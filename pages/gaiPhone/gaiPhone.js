// pages/gaiPhone/gaiPhone.js
var app = getApp();
var tools = require('../../utils/tools.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dis_btn:false,
    disabled: false,
    loading:false,
    phoneValue:'',
    codeValue:'',
    second:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        phone: options.phone
      })
  },
  getCode:function(){
    var phone=this.data.phoneValue;
    if(tools.isNull(phone)){
      wx.showToast({
        title: '请输入手机号',
        icon: 'loading',
        duration: 1500
      })       
    } else if(!tools.checkPhone(phone)){
      wx.showToast({
        title: '手机号有误',
        icon: 'loading',
        duration: 1500
      })      
    }else{
      var second = 60;
      var t = setInterval(()=> {
        if (second <= 0) {
          second = 0;
          this.setData({
            second: second,
            dis_btn: false
          })
          clearInterval(t);
        } else {
          second--;
          this.setData({
            second: second,
            dis_btn:true
          })
        }
      }, 1000);
      //获取短信验证码
      app.wxRequest(
        '/Wxsite/Homepage/api',
        { 'api_name': 'send_Verifi', 'mobile': phone },
        function (res) {
          if (res.data.code == '1') {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'loading',
              duration: 2000
            })
          }
        })
    }
  },
  //保存上传
  baocun:function(){
    var that=this;
    var phone = this.data.phoneValue;
    var code = this.data.codeValue;
    if (tools.isNull(phone)){
      wx.showToast({
        title: '请输入手机号',
        icon: 'loading',
        duration: 1500
      })    
    } else if (!tools.checkPhone(phone)) {
      wx.showToast({
        title: '手机号有误',
        icon: 'loading',
        duration: 1500
      })
    } else if (tools.isNull(code)){
      wx.showToast({
        title: '请输入验证码',
        icon: 'loading',
        duration: 1500
      })     
    } else{
      that.setData({
        loading: true,
        disabled: true
      })
      app.wxRequest(
        '/Wxsite/Homepage/apiN',
        { 'api_name': 'saveMobile', 'mobile': phone, 'code': code, 'token': app.globalData.token },
        function (res) {
          if (res.data.code == '1') {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 1500
            })
            setTimeout(() => {
              wx.navigateBack({ delta: 2 })
            }, 1500);
          } else {
            that.setData({
              loading: false,
              disabled: false
            })
            wx.showToast({
              title: res.data.msg,
              icon: 'loading',
              duration: 2000
            })
          }
        })
    }
  },
  //手机值
  phone:function(e){
    this.setData({
      phoneValue: e.detail.value
    })
  },
   //验证码值
  code: function (e) {
    this.setData({
      codeValue: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

 
})