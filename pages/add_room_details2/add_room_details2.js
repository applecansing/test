// pages/add_room_details2/add_room_details2.js
var tools = require('../../utils/tools.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list1: [
      { id: '', title: '不限', checked: 'true' },
      { id: '1', title: '一室' },
      { id: '2', title: '二室' },
      { id: '3', title: '三室' },
      { id: '4', title: '四室' },
      { id: '5', title: '四室以上' },
    ],
    list:[],
    expectValue: '',
    type2Arr: ['期望厅室', '期望面积']
  },
  radioChange: function (e) {
    this.setData({
      expectValue: e.detail.value
    })
  },
  confirm: function () {
    var expectValue = this.data.expectValue;
    var get_prevPage = tools.get_prevPage(1);
    get_prevPage.data.expectValue = expectValue;
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 种类
    console.log('种类type=' + options.type);
    var type = options.type;
    var text = '';
    (type == 1 || type == 2 || type == 3) ? text = this.data.type2Arr[0] : text = this.data.type2Arr[1];
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
    //获取数据
    if(type == 4 || type == 5){//商铺出租面积  
      wx.showLoading({
        title: '加载中',
      })
      app.wxRequest(
        '/Wxsite/Homepage/api',
        { 'api_name': 'acreage'},
        function (res) {
          wx.hideLoading();
          console.log(res);
          if (res.data.code == 1) {
            var data = res.data.data;
            var obj = { id: '', title: '不限', checked: true };
            if (data) {
              data.unshift(obj);
            }
            that.setData({
              list: data,
              expectValue: data[0].id + ',' + data[0].title,
            })
          }
        })  
    } else {//期望厅室---死数据 
      that.setData({
        list: that.data.list1,
        expectValue: this.data.list1[0].id + ',' + this.data.list1[0].title,//默认选中第一个
      })
    }
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
    return {
      title: '来宾房产网',
      path: '/pages/index/index'
    }
  }
})