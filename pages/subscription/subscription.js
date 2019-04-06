// pages/subscription/subscription.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    reload:false,
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //删除订阅
  delete:function(e){
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否要取消此订阅？',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.showLoading({
            title: '取消中...',
          })
          app.wxRequest(
            '/Wxsite/Myuser/api',
            { 'api_name': 'myShareDel', 'token': app.globalData.token, 'id': id },
            function (res) {
              wx.hideLoading();
              if (res.data.code == 1) {
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 2000
                })
                that.getList();
              }else{
                wx.showToast({
                  title: res.data.msg,
                  icon: 'fail',
                  duration: 2000
                })
              }
            })           
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })  
  },
  // 添加订阅
  subscribe:function(){
    wx.navigateTo({
      url: '/pages/add/add',
    })
  },
  //详情
  details:function(e){
    wx.navigateTo({
      url: '/pages/sub_details/sub_details?id=' + e.currentTarget.dataset.id,
    })
  },
  //编辑
  edit: function (e) {
    console.log(e);
    // type
    // 1 新房
    // 2 二手房
    // 3 租房
    // 4 商户出租
    // 5 商户出售 
    wx.navigateTo({
      url: '/pages/edit_sub/edit_sub?type=' + e.currentTarget.dataset.item.type+'&id=' + e.currentTarget.dataset.item.id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var reload=this.data.reload;
    if (reload){
      this.getList();
    }
  },
  getList:function(){//获取列表
      var that = this;
      wx.showLoading({
        title: '加载中',
      })
      app.wxRequest(
        '/Wxsite/Myuser/api',
        { 'api_name': 'mySubscribe', 'token': app.globalData.token, 'size': 999 },
        function (res) {
          console.log(res);
          wx.hideLoading();
          if (res.data.code == 1) {
            var data = res.data.data;
            var loading = data.length>0?true:false;
            that.setData({
              list: data,
              loading: loading
            })
          }
        }) 
  }
})