// pages/add_room/add_room.js
var tools = require('../../utils/tools.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sumValue: '',//房屋总价
    expectValue: '',//期望厅室
    addrValue:[],
    type1Arr:['房屋总价','期望租金','商铺总价'],
    type2Arr: ['期望厅室', '期望面积'],
    identity: [{ 'id': 1, 'name': '经纪人' }, { 'id': 2, 'name': '个人' }],
    identity_index: 0,
    type:'',
    sumVal:'',
    expectVal:'',
    addrVal:[],
    hidden:true,
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    var text='';
    type == '1' ? text = '新房订阅' : type == '2' ? text = '二手房订阅' : type == '3' ? text = '租房订阅' : type == '4' ? text = '商铺出租订阅' : text='商铺出售订阅';
    wx.setNavigationBarTitle({
      title: text
    })
    this.setData({
      type:type
    })
      


  },
  // 提交-订阅
  subscribe: function () {
    var sumVal = this.data.sumVal;
    var expectVal = this.data.expectVal;
    var addrVal = this.data.addrVal;
    var type=this.data.type;
    var that=this;
    console.log(this.data.identity_index*1+1);
    if (tools.isNull(addrVal.join())) {
      wx.showToast({
        title: '请选择期望地点',
        icon: 'loading',
        duration: 2000
      })
    }else if (tools.isNull(sumVal)){
    type = (type == 1 || type == 2 || type == 5) ? this.data.type1Arr[0] : this.data.type1Arr[1];
      wx.showToast({
        title: '请选择' + type,
        icon: 'loading',
        duration: 2000
      }) 
    } else if (tools.isNull(expectVal)){
      type = (type == 1 || type == 2 || type == 5) ? this.data.type2Arr[0] : this.data.type2Arr[1];
      wx.showToast({
        title: '请选择' + type,
        icon: 'loading',
        duration: 2000
      }) 
    }else{
      var arr2=[];
      for (let i in this.data.addrValue) {
        arr2.push(this.data.addrValue[i].split(',')[0]);
      }     
      that.setData({ disabled:true});
      wx.showLoading({
        title: '提交中...',
      })
      app.wxRequest(
        '/Wxsite/Myuser/api',
        { 'api_name': 'myShareAdd', 'token': app.globalData.token, 'area': arr2.join(), 'price': that.data.sumValue.split(',')[0], 'layout_s': that.data.expectValue.split(',')[0], 'type': type, 'is_status': that.data.identity_index * 1 + 1},
        function (res) {
          console.log(res);
          wx.hideLoading();
          if (res.data.code == '1') {
            wx.showToast({
              title: '订阅成功!',
              icon: 'success',
              duration: 1500
            })
            var get_prevPage = tools.get_prevPage(2);
            get_prevPage.data.reload = true;
            setTimeout(() =>{
              wx.navigateBack({
                delta: 2
              })
            },2000)
          } else {
            that.setData({ disabled: false });
            wx.showToast({
              title: res.data.msg,
              icon: 'fail',
              duration: 2000
            })
          }
        })  
    }
  },
  identity(e) {//经济人*个人
    console.log(e);
    let identity_index = e.detail.value;
    this.setData({
      identity_index: identity_index
    })
  },
  //添加期望地点
  add_area:function(){
    wx.navigateTo({
      url: '/pages/address/address'
    })   
  },
  add_room1: function () {
    wx.navigateTo({
      url: '/pages/add_room_details1/add_room_details1?type=' + this.data.type
    })
  },
  add_room2: function () {
    wx.navigateTo({
      url: '/pages/add_room_details2/add_room_details2?type=' + this.data.type
    })
  },
  //删除地点
  close: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var addrValue = this.data.addrValue;
    var arr = this.clear(addrValue, idx);
    var arr1 = [];
    for (let i in arr) {
      arr1.push(arr[i].split(',')[1]);
    }
    this.setData({
      addrValue: arr,
      addrVal: arr1
    })
    if (arr1.length < 3) {
      this.setData({
        hidden: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //房源
    var that = this;
    wx.showLoading({ title: '加载中...' });
    app.wxRequest(
      '/Wxsite/Homepage/api',
      { 'api_name': 'housesCount', 'type':that.data.type },
      function (res) {
        wx.hideLoading();
        console.log(res)
        if (res.data.code == '1') {
          var data=res.data;
          that.setData({
            count: data.count
          })      
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'fail',
            duration: 2000
          })
        }
      })   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var sumValue = this.data.sumValue;
    var expectValue = this.data.expectValue;
    var addrValue = this.data.addrValue;
    console.log('sumValue=' + sumValue + ',expectValue=' + expectValue);
    if (sumValue) {//总价或租金
      this.setData({
        sumValue: sumValue,
        sumVal: sumValue.split(',')[1]
      })
    }
    if (expectValue) {//面积
      this.setData({
        expectValue: expectValue,
        expectVal: expectValue.split(',')[1]        
      })
    }
    if (addrValue) {//地点
      this.data.addrValue = this.arr(addrValue);
      addrValue = this.data.addrValue;
      var arr1=[];
      for (let i in addrValue){
        arr1.push(addrValue[i].split(',')[1]);
      }
      //最多选三个
      if(arr1.length==3){
        this.setData({
          hidden: false
        })
      }
      this.setData({
        addrValue: addrValue,
        addrVal: arr1
      })
    }
  },
  //数组去重
  arr: function (arr) {
    var res = [];
    var json = {};
    for (var i = 0; i < arr.length; i++) {
      if (!json[arr[i]]) {
        res.push(arr[i]);
        json[arr[i]] = 1;
      }
    }
    return res;
  },
  // 删除对应的地点
  clear: function (arr, idx) {
    var i = arr.length;
    while (i--) {
      if (i == idx) {
        arr.splice(i, 1);
      }
    }
    return arr;
  },
  onShareAppMessage: function () {
    return {
      title: '来宾房产网',
      path: '/pages/index/index'
    }
  }
})