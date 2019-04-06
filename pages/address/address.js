// pages/address/address.js
var tools = require('../../utils/tools.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
    ],
    addrValue: '',
    city:'',
    loading: false
  },
  radioChange: function (e) {
    this.setData({
      addrValue: e.detail.value
    })
  },
  confirm: function () {
    var addrValue = this.data.addrValue;
    var get_prevPage = tools.get_prevPage(1);
    get_prevPage.data.addrValue.push(addrValue);
    wx.navigateBack({
      delta: 1
    })

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
    // 获取当前位置
    var that = this;
    if (app.globalData.citys) {
      that.setData({
        city: app.globalData.citys
      })
      that.areasType(app.globalData.citys);//获取地区
    } else {
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          console.log(res);
          var latitude = res.latitude
          var longitude = res.longitude
          var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
          var qqMap = new QQMapWX({
            key: 'H3ABZ-W4UK3-RZY3H-3FPJ3-PNLES-L3BZG'
          });
          qqMap.reverseGeocoder({
            location: {
              longitude: longitude,
              latitude: latitude
            },
            success: function (data) {
              console.log(data);
              app.globalData.citys = data.result.ad_info.city;
              that.setData({
                city: data.result.ad_info.city
              })
              that.areasType(data.result.ad_info.city);//获取地区
            }
          })
        }
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
  
  },
  areasType: function (city){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    app.wxRequest(
      '/Wxsite/Homepage/api',
      { 'api_name': 'areasType','city_name':city},
      function (res) {
        wx.hideLoading();
        console.log(res);
        if (res.data.code == 1) {
          var data = res.data.data;
          data[0].checked=true;
          that.setData({
            list: data,
            addrValue: data[0].area_id + ',' + data[0].name,
            loading: true
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