// pages/edit_sub/edit_sub.js
var tools = require('../../utils/tools.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sumValue:'',//房屋总价
    expectValue:'',//期望厅室
    addrValue: [],
    sumVal: '',
    expectVal: '',
    type: '',
    type1Arr: ['房屋总价', '期望租金', '商铺总价'],
    type2Arr: ['期望厅室', '期望面积'],
    identity: [{ 'id': 1, 'name': '经纪人' }, { 'id': 2, 'name': '个人' }],
    identity_index: 0,
    addrVal: [],
    hidden: true,
    id:'',
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type; 
    var id = options.id;
    this.setData({
      type: type,
      id:id
    })

  },
  // 提交
  subscribe: function () {
    var that = this;
    var sumVal = this.data.sumVal;
    var expectVal = this.data.expectVal;
    var addrVal = this.data.addrVal;
    var type = this.data.type;
    var id = this.data.id;
    sumVal == null ? sumVal='' : sumVal;
    if (tools.isNull(addrVal.join())){
      wx.showToast({
        title: '请选择期望地点',
        icon: 'loading',
        duration: 2000
      })
    }
     else {
      var arr2 = [];
      for (let i in this.data.addrValue) {
        arr2.push(this.data.addrValue[i].split(',')[0]);
      }
      that.setData({ disabled: true });
      wx.showLoading({
        title: '提交中...',
      })
      app.wxRequest(
        '/Wxsite/Myuser/api',
        { 'api_name': 'myShareInfo', 'token': app.globalData.token, 'id': id, 'state': 2, 'area': arr2.join(), 'price': that.data.sumValue.split(',')[0], 'layout_s': that.data.expectValue.split(',')[0], 'type': type, 'is_status': that.data.identity_index * 1 + 1},
        function (res) {
          wx.hideLoading();
          console.log(res);
          if (res.data.code == '1') {
            wx.showToast({
              title: '修改成功!',
              icon: 'success',
              duration: 1500
            })
            var get_prevPage = tools.get_prevPage(1);
            get_prevPage.data.reload = true;
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
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
  add_area: function () {
    wx.navigateTo({
      url: '/pages/address/address'
    })
  },
  room_sum:function(){
    wx.navigateTo({
      url: '/pages/room_sum/room_sum?type=' + this.data.type
    })
  },
  expect_rooms:function(){
    wx.navigateTo({
      url: '/pages/expect_rooms/expect_rooms?type=' + this.data.type
    })
  },
  //删除地点
  close:function(e){
    var idx = e.currentTarget.dataset.idx;
    var addrValue = this.data.addrValue;
    var arr=this.clear(addrValue,idx);
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
      { 'api_name': 'housesCount', 'type': that.data.type },
      function (res) {
        wx.hideLoading();
        console.log(res)
        if (res.data.code == '1') {
          var data = res.data;
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
    //详情
    app.wxRequest(
      '/Wxsite/Myuser/api',
      { 'api_name': 'myShareInfo', 'id': that.data.id, 'state': 1,'token':app.globalData.token },
      function (res) {
        wx.hideLoading();
        console.log(res)
        if (res.data.code == '1') {
          var data = res.data.data;
          //地点
          var area_name= data.area_name.split(',');
          var area_id = data.want_area_ids.split(',');
          var arr=[];
          for (let i in area_id){
              arr.push(area_id[i] + ',' + area_name[i]);
          }
          that.data.addrValue = that.arr(arr);
          var addrValue = that.data.addrValue;
          var arr1 = [];
          for (let i in addrValue) {
            arr1.push(addrValue[i].split(',')[1]);
          }
           //最多选三个
          if (arr1.length == 3) {
            that.setData({
              hidden: false
            })
          }
          that.setData({
            addrValue: addrValue,
            addrVal: arr1,
            identity_index: data.is_status*1-1
          })
          //总价或租金
          var sumValue = data.price_search_id + ',' + data.title;
          that.setData({
            sumValue: sumValue,
            sumVal: data.title
          }) 
          //面积---1.期望厅室 2.期望面积
          var expectValue;
          if (data.type == 1 || data.type == 2 || data.type == 3){//期望厅室
            var area = data.want_layout_s;
            area = area == 1 ? '一室' : area == 2 ? '二室' : area == 3 ? '三室' : area == 4 ? '四室' : area == 5 ? '四室以上' : '不限';
            expectValue = data.want_layout_s + ',' + area;
          }
          if(data.type ==4 || data.type == 5){//期望面积
            expectValue = data.areas_search_id + ',' + data.areatitle;
          }
          that.setData({
            expectValue: expectValue,
            expectVal: expectValue.split(',')[1]
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
        sumVal: sumValue.split(',')[1] == 'null' ? '不限' : sumValue.split(',')[1]
      })
    }
    if (expectValue) {//面积
      this.setData({
        expectValue: expectValue,
        expectVal: expectValue.split(',')[1]     
      })
    }
    if (addrValue) {//地点
      this.data.addrValue = this.arr(addrValue);//去重
      addrValue = this.data.addrValue;
      console.log(addrValue);
      var arr1 = [];
      for (let i in addrValue) {
        arr1.push(addrValue[i].split(',')[1]);
      }
      console.log(arr1);
      //最多选三个
      if (arr1.length == 3) {
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
  clear:function(arr,idx){
    var i = arr.length;
    while (i--) {
      if (i == idx) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }
})