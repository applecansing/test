const app = getApp();
Page({
  data: {
    city:'来宾',//当前定位城市,
    headline:[],
    goods:[],//房子推荐列表,
    empty:true,
    animationData: {},
    top:0,
    uhide: null,
    uhidea: null
  },
  onLoad: function () {
  },
  onReady:function(){
    var that = this;
    app.tools.get_city(function (res) {//获取当前城市定位
      console.log(res);
      app.globalData.city = res.result.ad_info.city;//保存当前定位城市
      that.setData({
        city: res.result.ad_info.city
      });
      that.recommend();//获取首页推荐
    });
    app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'newsHot'}, function (res) {//头条只显示两条
    console.log(res)
      if (res.data.code == 1) {
        // let headline = [];
        // res.data.data.forEach((item, index)=>{
        //   if (index > 1) {
        //     return false;
        //   } else {
        //     headline.push(item);
        //   }
        // });
        that.setData({
          headline: res.data.data
        });   
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请求失败'
        });
      }
    });
    
  },
  onShow:function(){
    if (this.data.flag == 1) {
      this.recommend();//获取首页推荐
    }
    this.setData({ flag: 1 });
  },
  recommend(){//首页推荐
    let that =this;
    wx.showLoading({ title: '加载中', })
    app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'recommend', 'size': 999, 'area_id': this.data.city, 'is_vip':app.globalData.userInfo.is_vip}, function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.data.code == 1) {
        var empty = res.data.data.length > 0 ? true : false;
        that.setData({
          goods: res.data.data,
          empty: empty,
          isVip: app.globalData.userInfo.is_vip
        });
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请求失败'
        });
      }
    });
  },
  set() {
    this.setData({ flag: 0 });
  },
  onShareAppMessage: function () {
    return {
      title: '来宾房产网',
      path: '/pages/index/index'
    }
  },
  //点击VIP图片
  showVipContent: function (e) {
    var that = this;
    var toggleBtnVal = that.data.uhide;
    let itemId = (e.currentTarget.dataset.id);
    if (toggleBtnVal == itemId) {
      that.setData({
        uhide: 0,
        uhidea: []
      })
    } else {
      app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'getvipcontent', 'id': itemId }, function (res) {
        var is_vip = app.globalData.userInfo.is_vip;
        if (is_vip !== '2') {
          var yzipone = res.data.owner_phone;
          var yzipone_front = yzipone.substring(0, 3);
          var yzipone_after = yzipone.substring(7, 11);
          res.data.owner_phone = yzipone_front + '****' + yzipone_after;
        }
        that.setData({
          uhide: itemId,
          uhidea: res.data
        })
      });
    }
  },
  //修改未展示的状态
  show: function (e) {
    var that = this;
    var itemId = e.target.dataset.id;
    if (itemId != '') {
      wx.showModal({
        title: '提示',
        content: '是否提交展示',
        cancelText: '否',
        success: function (sm) {
          if (sm.confirm) {//提交
            app.wxRequest('/Wxsite/Homepage/apiN', {
              'api_name': 'upshow',
              'house_id': itemId,
              'token': app.globalData.token
            }, function (res) {
              that.recommend();
            });
          } else if (sm.cancel) {//取消
          }
        }
      });
    }
  }
})