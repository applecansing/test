//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    motto: '来宾房产网欢迎您',
    userInfo: {},
    animationData: {}
  },
  //事件处理函数
  onLoad: function () {
    let that = this;
    app.tools.wx_login(function (flag, userInfo){
      if(flag==1){
        that.setData({
          userInfo: userInfo
        });
      }else if(flag == 2){
        wx.switchTab({
          url: '/pages/index/index',
        });
      }
    },app);
  },
  onShow: function () {
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 10000,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation

    animation.rotate(90).step()

    this.setData({
      animationData: animation.export()
    })
  }
})
