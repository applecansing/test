// pages/center/center.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head_img:''
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
    this.person_data();
  },
  person_data:function(){
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.wxRequest(
      '/Wxsite/Homepage/apiN',
      { 'api_name': 'personageEd', 'token': app.globalData.token },
      function (res) {
        wx.hideLoading();
        if (res.data.code == 1) {
          var hidden;
          res.data.data.is_vip != '2' ? hidden = true : hidden = false;
          that.setData({
            head_img: res.data.data.head_img,
            hidden: hidden
          })
        }
      }) 
  },
  onShareAppMessage: function () {
    return {
      title: '来宾房产网',
      path: '/pages/index/index'
    }
  }
})