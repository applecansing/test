var tools = require('../../utils/tools.js');
var app = getApp();
Page({
  data: {
    tab_bar: [],//选项卡
    nav: [],
    nav1: [{ 'name': '二手房', 'selected': 1, 'type': 2 }, { 'name': '新房', 'selected': 0, 'type': 1 }, { 'name': '商铺', 'selected': 0, 'type': 5 }],//选项卡
    nav2: [{ 'name': '租房', 'selected': 1 ,'type':3}, { 'name': '商铺', 'selected': 0 ,'type':4}],
    goods:[],
    empty:true
  },

  onLoad: function (e) {
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  onReady: function () {
    if (app.globalData.token) { } else {
      wx.showLoading({ title: '加载中...' });
      app.tools.wx_login(function (flag, userInfo) {
        if (flag == 2) { wx.hideLoading(); }
      }, app);
    }
  },

  onShow: function () {
    this.setData({
      tab_bar: [{ 'name': '出售', 'selected': 1, 'type': 2 }, { 'name': '出租', 'selected': 0, 'type': 3 }],
      nav: this.data.nav1
    });
    this.get_list(2);
  },
  // 选项卡,请先自定义属性index
  select(e){
    this.get_list(e.currentTarget.dataset.type);
    let nav = [];
    if (e.currentTarget.dataset.index == 0){
      nav = this.data.nav1;
    }else{
      nav = this.data.nav2;
    }
    let tab_bar = this.data.tab_bar;
    tab_bar.forEach(function (value,index) {
      if (index == e.currentTarget.dataset.index){
        value.selected = 1;
      }else{
        value.selected = 0;
      }
    });
    this.setData({
      tab_bar: tab_bar,
      nav:nav
    });
  },
  nav(e){
    this.get_list(e.currentTarget.dataset.type);
    let tab_bar = this.data.nav;
    tab_bar.forEach(function (value,index) {
      if (index == e.currentTarget.dataset.index){
        value.selected = 1;
      }else{
        value.selected = 0;
      }
    });
    this.setData({
      nav: tab_bar
    });
  },
  get_list(type){//获取列表
    let that = this;
    wx.showLoading({
      title: '载入中..',
    });
    app.wxRequest('/Wxsite/Myuser/api', { 'api_name': 'housesList', 'token': app.globalData.token, 'type': type,'size':9999}, function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.data.code == 1) {
        var empty = res.data.data.length > 0 ? true : false;
        that.setData({
          goods:res.data.data,
          empty:empty
        });
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请求失败'
        });
      }
    });
  },
  onShareAppMessage: function (e) {
    console.log(e);
    var that = this;
    if (e.from === 'button') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '来宾房产网',
      path: '/pages/house_details/details?id=' + e.target.dataset.id,
      success: function (res) {
        console.log(res);
        if (res.errMsg == 'shareAppMessage:ok') {
          // 转发成功
          app.wxRequest(
            '/Wxsite/Homepage/apiN',
            { 'api_name': 'share', 'token': app.globalData.token, 'house_id': e.target.dataset.id },
            function (res) {
              console.log(res);
              if (res.data.code == 1) {
                wx.showToast({
                  title: '分享成功'
                });
              }
            })
        }
      },
      fail: function (e) {
        if (e.errMsg == 'shareAppMessage:fail cancel') {
          //转发取消
        } else {
          // 转发失败
          console.log(e);
        }
      }
    }
  },
  delete(e){//列表删除
    let that = this;
    wx.showModal({
      title: '提示',
      content: '删除发布后不再显示在列表中,确定删除此订单？',
      success: function (res) {
        if (res.confirm) {
          app.wxRequest(
            '/Wxsite/Myuser/api',
            { 'api_name': 'housesDel', 'token': app.globalData.token, 'id': e.currentTarget.dataset.id},
            function (res) {
              console.log(res);
              if (res.data.code == 1) {
                wx.showToast({
                  title: '删除成功'
                });
                setTimeout(function(){
                  that.get_list(e.currentTarget.dataset.type);
                },1000);
              }
            })
        }
      }
    })
  }
});