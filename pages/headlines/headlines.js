const app = getApp();
Page({
  data: {
    news:[],
    empty:true
  },

  onLoad: function () {
  
  },

  onReady: function () {
    let that = this;
    wx.showLoading({title: '加载中',})
    app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'newsHotList','size':9999}, function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.data.code == 1) {
        var empty = res.data.data.length > 0 ? true : false;
        that.setData({
          news:res.data.data,
          empty: empty
        });
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请求失败'
        });
      }
    });
  },

  onShow: function () {
  
  }
})