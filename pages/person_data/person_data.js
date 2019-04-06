// pages/person_data/person_data.js
var app = getApp();
var tools = require('../../utils/tools.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['','男', '女'],
    arraytype:['拍照','从相册选择'],
    sourceType: ['camera', 'album'],
    index: '',
    index1:0,
    mask:false,
    status:false,
    name:'',
    header_img:''
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
    var that = this;
    wx.showLoading({ title: '加载中...' });    
    app.wxRequest(
      '/Wxsite/Homepage/apiN',
      { 'api_name': 'personageEd', 'token': app.globalData.token },
      function (res) {
        wx.hideLoading();
        if (res.data.code == 1) {
          var data = res.data.data;
          that.setData({
            header_img: data.head_img,
            nickname: data.nickname,
            mobile: data.mobile,
            index:data.sex
          })
        }
      }) 
  },
  uploadimg:function(e){
    var that=this;
    var index = e.detail.value;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [that.data.sourceType[index]], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          header_img1: tempFilePaths[0]
        })
        wx.showLoading({ title: '上传中...' });
        //上传图片
        wx.uploadFile({
          url: app.globalData.dlcurl +'/Wxsite/Myuser/apiN', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: { 'api_name':'pic'},
          success: function (res) {
            var data = res.data;
            data = data.trim();
            data = JSON.parse(data);
            // console.log(data);
            if(data.code==1){
              that.uploadImage(data.data);
            }else{
              wx.showToast({
                title: '上传失败',
                icon: 'fail',
                duration: 2000
              })              
            }
          }
        })
      }
    })  
  },
  b_phone:function(){
    if(this.data.mobile){
      wx.navigateTo({
        url: '/pages/gaiPhone/gaiPhone?phone=' + this.data.mobile
      })
    }else{
      wx.navigateTo({
        url: '/pages/b_phone/b_phone'
      })
    }
  },
  bindPickerChange: function (e) {
    var that = this;
    var index = e.detail.value;
    wx.showLoading({title: '上传中...'});
    app.wxRequest(
      '/Wxsite/Homepage/apiN',
      { 'api_name': 'personageEd', 'token': app.globalData.token, 'sex': index },
      function (res) {
        wx.hideLoading()
        if (res.data.code == '1') {
          that.setData({
            index: index
          })
          wx.showToast({
            title: '修改成功!',
            icon: 'success',
            duration: 2000
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
  gaiName:function(e){
    console.log(e);
    this.setData({
      mask: true,
      status:true
    })
  },
  close:function(){
    this.setData({
      mask: false,
      status: false
    })
  },
  nameInput:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  confirm:function(){
    var that=this;
    var name = this.data.name;
    if (tools.isNull(name)){
      wx.showToast({
        title: '请输入昵称',
        icon: 'loading',
        duration: 2000
      })   
    }else{
      wx.showLoading({ title: '上传中...' });
      app.wxRequest(
        '/Wxsite/Homepage/apiN',
        { 'api_name': 'personageEd', 'token': app.globalData.token, 'nickname': name},
        function (res) {
          console.log(res);
          wx.hideLoading()
          if (res.data.code == '1') {
            that.setData({
              mask: false,
              status: false,
              nickname: name
            })
            wx.showToast({
              title: '修改成功!',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'fail',
              duration: 2000
            })
          }
        })
    }
  },
  uploadImage:function(url){
    var that = this;
    app.wxRequest(
      '/Wxsite/Homepage/apiN',
      { 'api_name': 'personageEd', 'token': app.globalData.token, 'image': url },
      function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.code == '1') {
          that.setData({
            header_img: that.data.header_img1
          })
          wx.showToast({
            title: '修改成功!',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'fail',
            duration: 2000
          })
        }
      })    
  }
})