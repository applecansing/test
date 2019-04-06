var tools = require('../../utils/tools.js');
var app = getApp();
Page({
  data: {
    src: '',
    house_msg: {
      house_type: [],//房型
      house_type_index: [0, 0, 0],//房型下标
      build:[],//建筑类型
      build_index:[],//建筑类型下标
      area: [],//区域
      area_index: [],//区域下标
      floor: [],//楼层
      floor_index: [0, 0],//楼层下标
      decorate: [],//装修
      decorate_index: [],//装修下标
      identity: [{ 'id': 1, 'name': '经纪人' }, { 'id': 2, 'name': '个人' }],
      identity_index:0,
      state: [{ 'id': 1, 'name': '待售' }, { 'id': 2, 'name': '现房' }, { 'id': 3, 'name': '售完' }],//状态
      state_index: [0,0,0],//状态下标
      type: '', //房屋类型 1新房 2二手房 3 出租 4商铺(出租) 5商铺（出售） 由上页获取
      id: '',//当前房源id 由上页获取
      lat: '',//lat,lng 保存经度纬度
      lng: ''
    },
    tab_bar: [{ 'name': '二手房', 'selected': 1 ,'type':2}, { 'name': '新房', 'selected': 0 ,'type':1}, { 'name': '商铺', 'selected': 0,'type':5}],//选项卡
    lispic: [],//概况图片列表
    lispic_path: [],//概况图片列表路径
    indexpic: '',//主图
    indexpic_path: '',//主图路径
    msg:{},
    type:2,
    onOff:0
  },

  onLoad: function (e) {
    let house_msg = this.data.house_msg;
    house_msg.house_type = app.dataJs.house_type();//房型选择器，写死，数据在data.js
    house_msg.floor = app.dataJs.floor();//楼层选择器，写死，数据在data.js
    this.setData({
      house_msg: house_msg
    });
    this.areasType();
    this.descriptionType();
    this.build();
  },

  onReady: function () {
    this.get_details();
    let msg = this.data.msg;
    msg.type = 2;
    this.setData({
      msg:msg
    });
  },

  onShow: function () {
    
  },
  // 选项卡,请先自定义属性index
  select:function(e){
    console.log(e);
    if (e.currentTarget.dataset.selected == 1){//点的是自己
      return false;
    }
    this.get_details(e.currentTarget.dataset.type);
    let tab_bar = this.data.tab_bar;
    let type = '';
    tab_bar.forEach((item,index)=>{
      if (index == e.currentTarget.dataset.index){
        item.selected = 1;
        type = item.type;
      }else{
        item.selected = 0;
      }
    });
    let house_msg = this.data.house_msg;
    house_msg.build_index = '';
    house_msg.house_type_index = [0, 0, 0];
    house_msg.area_index = '',
    house_msg.floor_index = [0, 0];
    house_msg.decorate_index = '';
    this.setData({
      tab_bar: tab_bar,
      type:e.currentTarget.dataset.type,
      house_msg: house_msg
    });
    app.tools.goTop();
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  house_type(e) {//房型选择器
    let house_msg = this.data.house_msg;
    house_msg.house_type_index = e.detail.value;
    this.setData({
      house_msg: house_msg
    })
  },
  building(e){//建筑类型选择器
    let house_msg = this.data.house_msg;
    house_msg.build_index = e.detail.value;
    this.setData({
      house_msg: house_msg
    })
  },
  area(e) {//区域选择器
    let house_msg = this.data.house_msg;
    house_msg.area_index = e.detail.value;
    this.setData({
      house_msg: house_msg
    })
  },
  floor(e){//楼层选择器
    console.log(e);
    if (e.detail.value[0] > e.detail.value[1]){
      wx.showModal({
        title: '提示',
        content: '当前楼层不能大于总楼层,请重新选择',
      });
      return false;
    }
    let house_msg = this.data.house_msg;
    house_msg.floor_index = e.detail.value;
    this.setData({
      house_msg: house_msg
    })
  },
  decorate(e){//装修方式选择器
    let house_msg = this.data.house_msg;
    house_msg.decorate_index = e.detail.value;
    this.setData({
      house_msg: house_msg
    })
  },
  identity(e){//经济人*个人
    console.log(e);
    let house_msg = this.data.house_msg;
    house_msg.identity_index = e.detail.value;
    this.setData({
      house_msg: house_msg
    })
  },
  state(e) {//状态选择器
    let house_msg = this.data.house_msg;
    house_msg.state_index = e.detail.value;
    this.setData({
      house_msg: house_msg
    })
  },
  find() {
    let that = this;
    wx.chooseLocation({
      success(res) {
        console.log(res);
        let house_msg = that.data.house_msg;
        house_msg.lat = res.latitude;
        house_msg.lng = res.longitude;
        that.setData({
          house_msg: house_msg
        });
      }
    });
  },
  get_details(type){
    let that = this;
    let msg = app.dataJs.msg();
    msg.type = type;
    console.log(msg);
    that.setData({
      msg: msg
    });
  },
  build(){//建筑类型列表，picker使用
    let that = this;
    app.wxRequest('/Wxsite/Myuser/apiN', { 'api_name': 'houseType','type':1}, function (res) {
      console.log(res);
      if (res.data.code == 1) {
        let build_index = Array.apply(null, Array(res.data.data.length)).map(function (item, i) {
          return 0;
        });
        let house_msg = that.data.house_msg;
        house_msg.build = res.data.data;
        that.setData({
          house_msg: house_msg,
          build_index: build_index
        });
      }
    });
  },
  areasType() {//区域列表，picker使用
    let that = this;
    app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'areasType', 'city_name': app.globalData.city }, function (res) {
      console.log(res);
      if (res.data.code == 1) {
        let area_index = Array.apply(null, Array(res.data.data.length)).map(function (item, i) {
          return 0;
        });
        let house_msg = that.data.house_msg;
        house_msg.area = res.data.data;
        that.setData({
          house_msg: house_msg,
          area_index: area_index
        });
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请求失败'
        });
      }
    });
  },
  descriptionType() {//装修类型
    let that = this;
    app.wxRequest('/Wxsite/Myuser/apiN', { 'api_name': 'descriptionType' }, function (res) {
      if (res.data.code == 1) {
        let decorate_index = Array.apply(null, Array(res.data.data.length)).map(function (item, i) {
          return 0;
        });
        let house_msg = that.data.house_msg;
        house_msg.decorate = res.data.data;
        that.setData({
          house_msg: house_msg,
          decorate_index: decorate_index
        });
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请求失败'
        });
      }
    });
  },
  indexpic_delete(e) {//房源删除图片
    let lispic = this.data.lispic;
    let lispic_path = this.data.lispic_path;
    lispic.splice(e.currentTarget.dataset.index, 1);
    lispic_path.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      lispic: lispic,
      lispic_path: lispic_path
    });
  },
  choice(e) {//上传图片
    let type = e.currentTarget.dataset.type; //type == 1 主图  type ==2 房源概况
    let that = this;
    app.uploadFile(type, function (flag, idx, msg, data) {
      if (flag == 1) {
        let res = msg.tempFilePaths;
        console.log(type);
        if (type == 1) {
          that.setData({
            indexpic: res[0]
          });
        } else {
          console.log('length:'+that.data.lispic.length)
          if (that.data.lispic.length < 6) {
            that.setData({
              lispic: that.data.lispic.concat(res)
            });
          } else {
            wx.showModal({
              title: '提示',
              content: '最多只能上传6张图片...'
            });
            wx.setStorageSync('allowPicNum', 0);
            return false;
          }
        }
      } else if (flag == 2) {
        if (type == 1) {//主图
          that.setData({
            indexpic_path: msg
          });
        } else {//房源概况
          if (that.data.lispic_path.length < 6) {
            that.data.lispic_path.push(msg);
          }
          console.log(that.data.lispic_path);
        }
      }
    }, { 'api_name': 'pic' }, '', 6-that.data.lispic_path.length)
  },
  formSubmit(e) {//表单提交
    if(this.data.onOff){return false;};
    let that = this;
    let res = e.detail.value;
    if (app.tools.isNull(res.title)) {
      wx.showToast({
        icon: 'loading',
        title: '请输入标题'
      });
    }else if (that.data.type == 3 || that.data.type == 4) {
      if (app.tools.isNull(res.price)) {
        wx.showToast({
          icon: 'loading',
          title: '请输入租金'
        });
      }
    } else if (app.tools.isNull(res.room)) {
      wx.showToast({
        icon: 'loading',
        title: '请选择房型'
      });
    } else if (app.tools.isNull(res.house_type_id)) {
      wx.showToast({
        icon: 'loading',
        title: '选择建筑类型'
      });
    } else if (that.data.type == 1 && app.tools.isNull(res.house_status)) {//type==1 新房时才传
      wx.showToast({
        icon: 'loading',
        title: '请选择状态'
      });
    } else if (that.data.type == 1 && app.tools.isNull(res.totalprice)) {
      wx.showToast({
        icon: 'loading',
        title: '请输入售价'
      });
    } else if (app.tools.isNull(res.areas)) {
      wx.showToast({
        icon: 'loading',
        title: '请输入面积'
      });
    } else if (app.tools.isNull(res.village)) {
      wx.showToast({
        icon: 'loading',
        title: '请输入小区'
      });
    } else if (app.tools.isNull(res.area_id)) {
      wx.showToast({
        icon: 'loading',
        title: '请选择区域'
      });
    }
    // else if (app.tools.isNull(res.address)) {
    //   wx.showToast({
    //     icon: 'loading',
    //     title: '请输入地址'
    //   });
    // } 
    else if (that.data.type == 1 && app.tools.isNull(res.lat)) {//type==1 新房时才传
      wx.showModal({
        title: '提示',
        content: '请使用地图找房选择房源地址,让你的房源能在地图上准确展示',
      })
    } else if (app.tools.isNull(res.floor)) {
      wx.showToast({
        icon: 'loading',
        title: '请选择楼层'
      });
    } else if (app.tools.isNull(res.direction_type_id)) {
      wx.showToast({
        icon: 'loading',
        title: '请选择装修'
      });
    }
    //  else if (app.tools.isNull(res.years)) {
    //   wx.showToast({
    //     icon: 'loading',
    //     title: '请输入年代'
    //   });
    // }
    else if (app.tools.isNull(res.owner)) {
      wx.showToast({
        icon: 'loading',
        title: '请输入联系人'
      });
    } else if (app.tools.isNull(res.phone)) {
      wx.showToast({
        icon: 'loading',
        title: '请输入手机号'
      });
    } else if (!app.tools.checkPhone(res.phone)) {
      wx.showToast({
        icon: 'loading',
        title: '手机号格式有误'
      });
    }
    // else if (that.data.indexpic == '') {
    //   wx.showToast({
    //     icon: 'loading',
    //     title: '请上传主图'
    //   });
    // }
    else if (app.tools.isNull(res.introduce)) {
      wx.showToast({
        icon: 'loading',
        title: '请输入房源概况'
      });
    }
    //  else if (that.data.lispic.length == 0) {
    //   wx.showToast({
    //     icon: 'loading',
    //     title: '请上传房源图片'
    //   });
    // }
    else {
      that.setData({
        onOff: 1
      });
      wx.showModal({
        title: '提示',
        content: '是否展示？',
        cancelText: '否',
        success: function (sm) {
          if (sm.confirm) {
            var is_show = 1;
          } else if (sm.cancel) {
            var is_show = 0;
          }
          let data = {
            'is_show': is_show,
            'api_name': 'housesAdd',
            'token': app.globalData.token,
            'type': that.data.msg.type,
            'title': res.title,
            'areas': res.areas,
            'price': res.price,
            'totalprice': res.totalprice,
            'village': res.village,
            'floor': res.floor,
            'direction_type_id': res.direction_type_id,
            'owner': res.owner,
            'phone': res.phone,
            'introduce': res.introduce,
            'indexpic': that.data.indexpic_path,
            'lispic': that.data.lispic_path.join(','),
            'lat': res.lat,
            'lng': res.lng,
            'room': res.room,
            'house_status': res.house_status,
            'area_id': res.area_id,
            'house_type_id': res.house_type_id,
            'is_type': res.is_type,
            'src':src
          };
          app.wxRequest('/Wxsite/Myuser/api', data, function (res) {
            console.log(res);
            if (res.data.code == 1) {
              wx.showToast({
                title: '保存成功',
              });
              setTimeout(function () {
                wx.navigateBack();
              }, 2000);
            } else {
              that.setData({
                onOff: 0
              });
              wx.showModal({
                title: '提示',
                content: res.data.msg,
              })
            }
          });
        }
      });
    }
  },
  chooseVideo: function () {
    var that = this
    wx.chooseVideo({
      success: function (res) {
        var src = res.tempFilePath
        that.setData({ src: src })
      }
    })
  },
})