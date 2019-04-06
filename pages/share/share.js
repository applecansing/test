// pages/share/share.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    loading:true
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
    this.list();
  },
  details: function (e) {
    wx.navigateTo({
      url: '/pages/house_details/details?id=' + e.currentTarget.dataset.id,
    })
  },
  //删除
  delShare:function(e){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '是否删除该收藏记录？',
      success: function (res) {
        if (res.confirm) {
          app.wxRequest(
            '/Wxsite/Homepage/apiN',
            { 'api_name': 'delCollect', 'token': app.globalData.token, 'id': e.currentTarget.dataset.id},
            function (res) {
              console.log(res);
              if (res.data.code == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1500
                })
                setTimeout(()=>{
                  that.list();
                },1500)
                
              }else{
                wx.showToast({
                  title: '删除失败',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
        }
      }
  })
  },
  list:function(){
    var that = this;
    wx.showLoading({ title: '加载中...' });
    app.wxRequest(//获取列表
      '/Wxsite/Homepage/apiN',
      { 'api_name': 'myCollect', 'token': app.globalData.token },
      function (res) {
        wx.hideLoading();
        console.log(res);
        if (res.data.code == 1) {
          var data = res.data.data;
          var loading = data.length > 0 ? true : false;
          that.setData({
            list: data,
            loading: loading
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