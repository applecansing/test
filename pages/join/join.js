// pages/join/join.js
var app=getApp();
var tools = require('../../utils/tools.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    loading:false,
    name:'',
    phone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  name:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  baocun:function(){
    var that=this;
    var name=this.data.name;
    var phone=this.data.phone;
    if(tools.isNull(name)){
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'loading',
        duration: 2000
      })  
    } else if (tools.isNull(phone)) {
      wx.showToast({
        title: '请输入联系方式',
        icon: 'loading',
        duration: 2000
      })
    } else if (!tools.checkPhone(phone)){
      wx.showToast({
        title: '手机号有误',
        icon: 'loading',
        duration: 2000
      })
    }else{
      that.setData({
        loading: true,
        disabled: true
      })
      app.wxRequest(
        '/Wxsite/Homepage/apiN',
        { 'api_name': 'applyMember', 'real_name': name, 'mobile': phone, 'token': app.globalData.token },
        function (res) {
          if (res.data.code == '1') {
            console.log(res);
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 1500
            })
            setTimeout(() => {
              wx.navigateBack({ delta: 1})
            }, 1500);
          } else {
            that.setData({
              loading: false,
              disabled: false
            })
            wx.showToast({
              title: res.data.msg,
              icon: 'fail',
              duration: 2000
            })
          }
        })      
    }
  }
})