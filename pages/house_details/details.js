const app = getApp();
Page({

  data: {
    details: [],
    empty: true
  },

  onLoad: function (e) {
    console.log(e);
    this.setData({
      house_id: e.id,
      is_vip: app.globalData.userInfo.is_vip
    });
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  onReady: function () {
    let that = this;
    wx.showLoading({
      title: '载入中..',
    });
    app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'houseInfo', 'house_id': this.data.house_id }, function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.data.code == 1) {
        var empty = res.data.data.indexpic ? true : false;
        that.setData({
          details: res.data.data,
          empty: empty
        });
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请求失败'
        });
      }
    });
    if (app.globalData.token) {

    } else {
      wx.showLoading({ title: '加载中...' });
      app.tools.wx_login(function (flag, userInfo) {
        if (flag == 2) { wx.hideLoading(); }
      }, app);
    }
  },

  onShow: function () {
    if (app.tools.get_prevPage(1).set) {
      app.tools.get_prevPage(1).set();
    }
  },
  call: function () {//立即咨询
    let that = this;
    if (that.data.details) {
      wx.makePhoneCall({
        phoneNumber: that.data.details.phone
      })
    }
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
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '来宾房产网',
      path: '/pages/house_details/details?id=' + that.data.house_id,
      success: function (res) {
        console.log(res);
        if (res.errMsg == 'shareAppMessage:ok') {
          // 转发成功
          app.wxRequest(
            '/Wxsite/Homepage/apiN',
            { 'api_name': 'share', 'token': app.globalData.token, 'house_id': that.data.house_id },
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
      fail: function (res) {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          //转发取消
        } else {
          // 转发失败
          console.log(res);
        }
      }
    }
  },
  collect() {//收藏
    let that = this;
    app.wxRequest(
      '/Wxsite/Homepage/apiN',
      { 'api_name': 'addCollect', 'token': app.globalData.token, 'house_id': that.data.house_id },
      function (res) {
        console.log(res);
        if (res.data.code == 1) {
          wx.showToast({
            title: '收藏成功',
          });
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success:function(res){
              if(res.confirm){
                wx.navigateTo({
                  url: '/pages/share/share',
                })
              }
            }
          })
        }
      })
  }
})