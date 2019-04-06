// pages/link_us/link_us.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    about_img:'',
    phoneNumber:''
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
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    app.wxRequest(
      '/Wxsite/Homepage/api',
      { 'api_name': 'contactUs'},
      function (res) {
        wx.hideLoading();
          console.log(res);
        if (res.data.code == 1) {
          var data = res.data.data;
          that.setData({
            about_img: data.about_img,
            phoneNumber:data.phone
          })
        }
      }) 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  call:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber//仅为示例，并非真实的电话号码
    })
  },
  previewImage: function (e) {
    console.log(e.target.dataset.url);
    wx.previewImage({
      current: e.target.dataset.url, // 当前显示图片的http链接
      urls: [e.target.dataset.url], // 需要预览的图片http链接列表
      success: function (res) {
        console.log(res);
      }
    })
  },
})