const app = getApp();
Page({
  data: {
    tab_bar: [{ 'name': '区域', 'selected': 1, 'type': 0 }, { 'name': '价格', 'selected': 0, 'type': 1 }, { 'name': '类型', 'selected': 0, 'type': 2 }, { 'name': '状态', 'selected': 0, 'type': 3 }],//选项卡
    type_list_show: false,//筛选列表是否显示
    mask: false,
    history: false,//搜索历史
    search_name: '',//初始搜索名称
    type0_list: [],// 区域筛选列表
    type1_list: [],// 价格筛选列表
    type2_list: [],// 类型筛选列表
    type3_list: [{ id: "", title: "不限", active: 1, flag: 3 }, { id: "1", title: "待售", active: 0 }, { id: "2", title: "现房", active: 0 },{ id: "3", title: "售完", active: 0 }],// 房源状态筛选列表写死
    type: 0,
    area_id: '',//搜索条件区域
    priceTypeid: '',//搜索条件价格
    areasTypeid: '',//搜索条件面积类型
    houseTypeId: '',//搜索条件房子建筑类型
    search_type: 1,//搜索条件房源类型
    house_status: '',//搜索条件房源状态
    goods: [],//房源列表
    empty:true
  },

  onLoad: function (e) {
    this.areasType();//获取区域筛选列表
    this.priceType();//获取价格筛选列表
    this.houseType();//获取类型筛选列表
  },

  onReady: function () {
    this.get_goods();
  },

  onShow: function () {
    this.setData({
      search_name: ''
    });
    if(this.data.flag==1){
      this.get_goods();
    }
    this.setData({flag:1});
  },
  search: function (e) {//搜索
    let search_name = e ? e.detail.value : '';
    this.setData({
      search_name: search_name
    });
    let that = this;
    this.get_goods();
  },
  save_key(e) {
    let search_name = e ? e.detail.value : '';
    this.setData({
      search_name: search_name
    });
  },
  search_btn() {
    this.get_goods();
  },
  get_goods() {//获取列表
    let that = this;
    wx.showLoading({
      title: '载入中..',
    });
    app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'searchHome', 'area_id': this.data.area_id, 'title': this.data.search_name, 'priceTypeid': this.data.priceTypeid, 'areasTypeid': this.data.areasTypeid, 'houseTypeId': this.data.houseTypeId, 'type': this.data.search_type, 'house_status': this.data.house_status, 'is_vip': app.globalData.userInfo.is_vip }, function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.data.code == 1) {
        var empty = res.data.data.length > 0 ? true : false;
        app.globalData.new_house = res.data.data;
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
    app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'priceType', 'type': '1' }, function (res) {
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
    app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'houseType', 'type': '1' }, function (res) {
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
        house_status: e.currentTarget.dataset.id
      });
    }
    that.get_goods();
    that.setData({
      type_list_show: false,
      mask: false
    });
  },
  set(){
    this.setData({flag:0});
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
              var new_house = app.globalData.new_house;
              new_house[e.target.dataset.key]['is_show'] = 1;
              that.setData({
                goods: new_house,
              });
            });
          } else if (sm.cancel) {//取消
          }
        }
      });
    }
  }
})