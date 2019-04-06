var app = getApp();
Page({
  data: {
    house_id: '',
    type: '',
    msg: [],
    delete_onOff:0
  },
  onLoad: function (e) {
    console.log(e);
    this.setData({
      house_id: e.id
    });
  },
  onReady: function () {

  },
  onShow: function () {
    let that = this;
    wx.showLoading({
      title: '载入中..',
    });
    app.wxRequest('/Wxsite/Myuser/api', { 'api_name': 'housesInfo', 'token': app.globalData.token, 'id': this.data.house_id }, function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.data.code == 1) {
        if (res.data.data.type == 1 || res.data.data.type == 2 || res.data.data.type == 5) {
          wx.setNavigationBarTitle({
            title: '出售详情'
          })
        } else {
          wx.setNavigationBarTitle({
            title: '出租详情'
          })
        }
        that.setData({
          msg: res.data.data,
          type: res.data.data.type
        });
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请求失败'
        });
      }
    });
  },
  edit() {//编辑
    if (this.data.type) {
      wx.navigateTo({
        url: '/pages/publish_edit/index?id=' + this.data.house_id + '&type=' + this.data.type
      })
    }
  },
  delete(e) {//删除删除
    if (this.data.delete_onOff){return false;}
    let that = this;
    wx.showModal({
      title: '提示',
      content: '删除发布后不再显示在列表中,确定删除此订单？',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            delete_onOff:1
          });
          app.wxRequest(
            '/Wxsite/Myuser/api',
            { 'api_name': 'housesDel', 'token': app.globalData.token, 'id': e.currentTarget.dataset.id },
            function (res) {
              console.log(res);
              if (res.data.code == 1) {
                wx.showToast({
                  title: '删除成功'
                });
                setTimeout(function () {
                  wx.navigateBack();
                }, 2000);
              }else{
                that.setData({
                  delete_onOff: 0
                });
              }
            })
        }
      }
    })
  }
})