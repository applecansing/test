const app = getApp();
Page({

  data: {
    news:{}
  },

  onLoad: function (e) {
    let that = this;
    let page_title = '';
   
    that.setData({
      page_type : e.type
    });
    switch(e.type*1){
      case 1:
        page_title = '房产过户';
        break;
      case 2:
        page_title = '商家活动';
        break;
      case 3:
        page_title = '装修咨询';
        break;
      case 4:
        page_title = '电话发布';
        break;
      case 5:
        page_title = '资产评估';
        break;
    }
    wx.setNavigationBarTitle({
      title: page_title
    });
  },

  onReady: function () {
    let that = this;
    wx.showLoading({
      title: '载入中..',
    });
    app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'Homepagenews', 'type': this.data.page_type},function(res){
      console.log(res);
      wx.hideLoading();
      if(res.data.code == 1){
        that.setData({
          news : res.data.data
        });
      }else{
        wx.showToast({
          icon: 'loading',
          title: '请求失败'
        });
      }
    });
  },

  onShow: function () {
  
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
  call:function(){
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.news.class_phone
    });
  }
})