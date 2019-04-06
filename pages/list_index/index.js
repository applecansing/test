const app = getApp();
Page({
  data: {
    tab_bar: [{ 'name': '区域', 'selected': 1, 'type': 0 }, { 'name': '价格', 'selected': 0, 'type': 1 }, { 'name': '类型', 'selected': 0, 'type': 2 }, { 'name': '面积', 'selected': 0, 'type': 3 }],//选项卡
    type_list_show: false,//筛选列表是否显示
    mask: false,
    history: false,//搜索历史
    search_name: '',//初始搜索名称
    type0_list: [],// 区域筛选列表
    type1_list: [],// 价格筛选列表
    type2_list: [],// 类型筛选列表
    type3_list: [],// 面积筛选列表
    type: 0,
    area_id: '',//搜索条件区域
    priceTypeid: '',//搜索条件价格
    areasTypeid: '',//搜索条件面积类型
    houseTypeId: '',//搜索条件房子建筑类型
    search_type: '',//搜索条件房源类型
    house_status: '',//搜索条件房源状态
    goods: [],//房源列表,
    empty:true
  },

  onLoad: function (e) {
    console.log(e);
    this.setData({
      search_type:e.type
    });
    wx.setNavigationBarTitle({
      title: e.type==3?'租房':'商铺'
    });
    this.areasType();//获取区域筛选列表
    this.priceType();//获取价格筛选列表
    this.houseType();//获取类型筛选列表
    this.acreage();//获取面积筛选列表
  },

  onReady: function () {
    this.get_goods();
  },

  onShow: function () {

  },
  search: function (e) {//搜索
    let search_name = e ? e.detail.value : '';
    this.setData({
      search_name: search_name
    });
    let that = this;
    if (e) {
      app.tools.search_key(e.detail.value);//保存搜索关键字
    }
    this.get_goods();
  },
  get_goods() {//获取列表
    let that = this;
    wx.showLoading({
      title: '载入中..',
    });
    app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'searchHome', 'area_id': this.data.area_id, 'title': this.data.search_name, 'priceTypeid': this.data.priceTypeid, 'areasTypeid': this.data.areasTypeid, 'houseTypeId': this.data.houseTypeId, 'type': this.data.search_type, 'house_status': this.data.house_status }, function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.data.code == 1) {
        var empty = res.data.data.length > 0 ? true : false;
        that.setData({
          goods: res.data.data,
          empty: empty
        });
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请求失败'
        });
      }
    });
  },
  // 选项卡,请先自定义属性index
  select(e) {
    console.log(e.currentTarget.dataset.type);
    let tab_bar = this.data.tab_bar;
    tab_bar.forEach((value, index) => {
      if (index == e.currentTarget.dataset.index) {
        value.selected = 1;
      } else {
        value.selected = 0;
      }
    });
    this.setData({
      tab_bar: tab_bar,
      type_list_show: true,
      mask: true,
      type: e.currentTarget.dataset.type
    });
  },
  areasType() {//区域类型
    let that = this;
    app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'areasType', 'city_name': app.globalData.city }, function (res) {
      console.log(res);
      if (res.data.code == 1) {
        let type0_list = [{ area_id: "", name: "不限", active: 1, flag: 0 }];
        that.setData({
          type0_list: type0_list.concat(that.add_status(res.data.data))
        });
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请求失败'
        });
      }
    });
  },
  priceType() {//价格类型
    let that = this;
    var obj = {};
    if (that.data.search_type == '3') {
      obj = { 'api_name': 'priceType', 'type': '2' };
    } else if (that.data.search_type == '5') {
      obj = { 'api_name': 'getshopsPrice' };
    }   
    app.wxRequest('/Wxsite/Homepage/api', obj, function (res) {
      console.log(res);
      if (res.data.code == 1) {
        let type1_list = [{ id: "", title: "不限", active: 1, flag: 1 }];
        that.setData({
          type1_list: type1_list.concat(that.add_status(res.data.data))
        });
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请求失败'
        });
      }
    });
  },
  houseType() {//房子类型
    let that = this;
    var obj={};
    var str='';
    if (that.data.search_type=='3'){
      str ='/Wxsite/Myuser/apiN';
      obj = { 'api_name': 'houseType', 'type': '2' };
    } else if (that.data.search_type == '5'){
      str ='/Wxsite/Homepage/api';
      obj = { 'api_name': 'getType'};
    }
    console.log(obj);
    app.wxRequest(str, obj, function (res) {
      console.log(res);
      if (res.data.code == 1) {
        let type2_list = [{ id: "", title: "不限", active: 1, flag: 2 }];
        that.setData({
          type2_list: type2_list.concat(that.add_status(res.data.data))
        });
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请求失败'
        });
      }
    });
  },
  acreage() {//面积类型
    let that = this;
    app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'acreage' }, function (res) {
      console.log(res);
      if (res.data.code == 1) {
        let type3_list = [{ id: "", title: "不限", active: 1, flag: 3 }];
        that.setData({
          type3_list: type3_list.concat(that.add_status(res.data.data))
        });
      } else {
        wx.showToast({
          icon: 'loading',
          title: '请求失败'
        });
      }
    });
  },
  add_status(arr) {//往列表每一项添加一个active的字段
    arr.forEach((item, index) => {
      item.active = 0;
    });
    return arr;
  },
  type_list_tap(e) {
    console.log(e);
    let that = this;
    let type_list = e.currentTarget.dataset.list;
    type_list.forEach((item, index) => {
      if (index == e.currentTarget.dataset.index) {
        item.active = 1;
      } else {
        item.active = 0;
      }
    });
    if (type_list[0].flag == 0) {
      that.setData({
        type0_list: type_list,
        area_id: e.currentTarget.dataset.id
      });
    } else if (type_list[0].flag == 1) {
      that.setData({
        type1_list: type_list,
        priceTypeid: e.currentTarget.dataset.id
      });
    } else if (type_list[0].flag == 2) {
      that.setData({
        type2_list: type_list,
        houseTypeId: e.currentTarget.dataset.id
      });
    } else if (type_list[0].flag == 3) {
      that.setData({
        type3_list: type_list,
        areasTypeid: e.currentTarget.dataset.id
      });
    }
    that.get_goods();
    that.setData({
      type_list_show: false,
      mask: false
    });
  }
})