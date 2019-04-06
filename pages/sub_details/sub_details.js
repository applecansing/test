// pages/sub_details/sub_details.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    imgArr: ['../../img/room1.png', '../../img/room2.png', '../../img/room3.png', '../../img/room4.png','../../img/room5.png'],
    list:[],
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var id = that.data.id;
    wx.showLoading({
      title: '加载中',
    })
    app.wxRequest(//获取列表
      '/Wxsite/Myuser/api',
      { 'api_name': 'ShareInfo', 'token': app.globalData.token, id:id,'size': 999 },
      function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.code == 1) {
          var data = res.data.data;
          var loading = data.houses.length>0? true : false;
          that.setData({
            list: data,
            loading: loading,
          })
        }
      })  
  },
  details:function(e){
    wx.navigateTo({
      url: '/pages/house_details/details?id=' + e.currentTarget.dataset.id,
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