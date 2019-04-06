const app = getApp();
Page({
  data: {
    details: []
  },

  onLoad: function (e) {
    this.setData({
      news_id: e.news_id
    });
  },

  onReady: function () {
    let that = this;
    wx.showLoading({ title: '加载中', })
    app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'newsInfo', 'news_id': this.data.news_id}, function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.data.code == 1) {
        that.setData({
          details:res.data.data
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