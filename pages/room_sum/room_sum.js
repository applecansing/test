// pages/room_sum/room_sum.js
var tools = require('../../utils/tools.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    sumValue:'',
    type1Arr: ['房屋总价', '期望租金', '商铺总价']
  },
  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      sumValue: e.detail.value
    })
  },
  confirm:function(){
    var sumValue = this.data.sumValue;
    var get_prevPage = tools.get_prevPage(1);
    get_prevPage.data.sumValue = sumValue;
    wx.navigateBack({
      delta:1
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    var text = '';
    (type == 1 || type == 2) ? text = this.data.type1Arr[0] : type == 5 ? text = this.data.type1Arr[2] : text = this.data.type1Arr[1];
    wx.setNavigationBarTitle({
      title: text
    })

    this.setData({
      type: type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var type = that.data.type;
    var status;
    (type == 1 || type == 2 || type == 5) ? status = 1 : status = 2;
    //获取数据
    wx.showLoading({
      title: '加载中',
    })
    app.wxRequest(
      '/Wxsite/Homepage/api',
      { 'api_name': 'priceType', 'type': status },
      function (res) {
        wx.hideLoading();
        console.log(res);
        if (res.data.code == 1) {
          var data = res.data.data;
          var obj = { id: '', title: '不限', checked: true };
          if (data) {
            data.unshift(obj);
          }
          console.log(data)
          that.setData({
            list: data,
            sumValue: data[0].id + ',' + data[0].title
          })
        }
      })  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})