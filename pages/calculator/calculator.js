// pages/calculator/calculator.js
var app = getApp();
var tools = require('../../utils/tools.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    oneIndex: 0,
    twoIndex: 0,
    threeIndex: 0,
    fourIndex: 0,
    fiveIndex: 0,
    month: ['12', '24', '36', '48', '60', '72', '84', , '96', '108', '120', '132', '144', '156', '168', '180', '192', '204', '216', '228', '240', '300', '360'],
    array: ['1年（12期）', '2年（24期）', '3年（36期）', '4年（48期）', '5年（60期）', '6年（72期）', '7年（84期）', '8年（96期）', '9年（108期）', '10年（120期）', '11年（132期）',
      '12年（144期）', '13年（156期）', '14年（168期）', '15年（180期）', '16年（192期）', '17年（204期）', '18年（216期）', '19年（228期）', '20年（240期）', '25年（300期）', '30年（360期）'
    ],
    array1: ['1年（12期）', '2年（24期）', '3年（36期）', '4年（48期）', '5年（60期）', '6年（72期）', '7年（84期）', '8年（96期）', '9年（108期）', '10年（120期）', '11年（132期）',
      '12年（144期）', '13年（156期）', '14年（168期）', '15年（180期）', '16年（192期）', '17年（204期）', '18年（216期）', '19年（228期）', '20年（240期）', '25年（300期）', '30年（360期）'
    ],
    array2: ['2成', '3成', '4成', '5成', '6成', '7成', '8成', '9成'],
    c_shu: ['2', '3', '4', '5', '6', '7', '8', '9'],
    index: 0,
    index1: 0,
    index2: 0,
    index3: 0,
    index4: 0,
    index5: 0,
    index6: 0,
    money: '0',
    money1: '0',
    money2: '0',
    money3: '0',
    money4:' 0',
    money5: '0',
    area1:'0',
    area2: '0',
    bank_rate: [],
    bank_rate1: [],
    //等额本息
    pay_money: '0.00',//月均还款
    pay_money4: '0.00',
    pay: '0.00',//支付利息
    daikuang_money: '0.00',//贷款总额
    huan_money: '0.00',//还款总额
    //等额本金
    money_start: '0.00',//首月还款
    money_end: '0.00',//末月还款
    pay_two: '0.00',//支付利息
    dk_money_two: '0.00',//贷款总额
    h_money_two: '0.00',//还款总额
    daikuang_money3: '0.00',
    daikuang_money4: '0.00',
    dk_money5: '0.00',
    daikuang_money6: '0.00',
    dk_money7: '0.00',
    daikuang_money_end: '0.00',
    dk_money_end1: '0.00',
    huan_money3: '0.00',
    huan_money4: '0.00',
    h_money5: '0.00',
    huan_money6: '0.00',
    h_money7: '0.00',
    huan_money_end: '0.00',
    h_money_end1: '0.00',
    pay3: '0.00',
    pay_four: '0.00',
    pay5: '0.00',
    pay6: '0.00',
    pay7: '0.00',
    pay_end: '0.00',
    pay_end1: '0.00',
    pay_money2: '0.00',
    pay_money3: '0.00',
    pay_money_end: '0.00',
    area_money3: '0.00',
    area_money4: '0.00',
    area_money6: '0.00',
    area_money7: '0.00',
    dk_money4: '0.00',
    h_money4: '0.00',
    pay4: '0.00',
    money_start1: '0.00',
    money_start2: '0.00',
    money_start3: '0.00',
    money_start4: '0.00',
    money_end1: '0.00',
    money_end2: '0.00',
    money_end3: '0.00',
    money_end4: '0.00',
    need_money1: '0.00',//首期还款
    need_money2: '0.00',
    need_money3: '0.00',
    need_money4: '0.00',
    phoneNumber: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  call: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber
    })
  },
  //页面滑动
  bindChange: function (e) {
    console.log(e);
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  // 点击tab切换 
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //商业贷款
  //点击总价tab切换
  jisuan: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    this.setData({
      oneIndex: id
    })
  },
  //点击等额本金tab切换
  huankuang: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    this.setData({
      twoIndex: id
    })
  },
  //总价选择器-按揭年数
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //监测input输入的值
  money_val: function (e) {
    this.setData({
      money: e.detail.value
    })
  },
  //单价选择器
  // 按揭年数
  bindPickerChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
  },
  // 按揭成数
  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index2: e.detail.value
    })
  },
  //监测input输入的值
  money_val1: function (e) {
    this.setData({
      money1: e.detail.value
    })
  },
  area1: function (e) {
    this.setData({
      area1: e.detail.value
    })
  },
  //商业贷款-开始计算
  doing: function (e) {
    console.log(e);
    //总价
    var rate = e.currentTarget.dataset.bankrate;
    var money = this.data.money;
    var month = this.data.month[this.data.index];
    var twoIndex = this.data.twoIndex;
    console.log(money + ',' + month + ',' + rate + ',' + twoIndex);
    //等额本金
    var rate1 = e.currentTarget.dataset.bankrateone;
    var money1 = this.data.money1;
    var area1 = this.data.area1;
    var month1 = this.data.month[this.data.index1];
    var c_shu = this.data.c_shu[this.data.index2];
    console.log(rate1 + ',' + money1 + ',' + area1 + ',' + month1 + ',' + c_shu);
    var sy_index = this.data.oneIndex;
    console.log(sy_index);
    if (sy_index == 0) {//总价
      if (tools.isNull(money)) {
        wx.showToast({
          title: '请输入贷款金额',
          icon: 'loading',
          duration: 2000
        })
      } else {
        if (twoIndex == '0') {//等额本息
          var res = this.result(money * 10000, month, rate);
          var daikuang_money = money * 10000;
          var pay = month * res - daikuang_money;
          var huan_money = daikuang_money + pay;
          console.log(res);
          this.setData({
            pay_money: res.toFixed(2),
            pay: pay.toFixed(2),
            daikuang_money: daikuang_money,
            huan_money: huan_money.toFixed(2),
          })
        } else {//等额本金
          var res_two = this.result_two(money * 10000, month, rate);
          console.log(res_two);
          var money_start = res_two[0];
          var money_end = res_two[1];
          var dk_money_two = money * 10000;
          var pay_two = res_two[2];
          var h_money_two = dk_money_two + pay_two;
          this.setData({
            money_start: money_start.toFixed(2),
            money_end: money_end.toFixed(2),
            dk_money_two: dk_money_two.toFixed(2),
            pay_two: pay_two.toFixed(2),
            h_money_two: h_money_two.toFixed(2),
          })
        }
      }
    } else {//单价
      if (tools.isNull(money1)) {
        wx.showToast({
          title: '请输入单价',
          icon: 'loading',
          duration: 2000
        })
      } else if (tools.isNull(area1)) {
        wx.showToast({
          title: '请输入面积',
          icon: 'loading',
          duration: 2000
        })
      } else {
        if (twoIndex == '0') {//等额本息 
          var need_money1 = money1 * area1 - (money1 * area1 * (c_shu * 0.1));
          var area_money3 = money1 * area1 * (c_shu * 0.1);
          var res = this.result(area_money3, month1, rate1);
          var daikuang_money3 = area_money3;
          var pay3 = month1 * res - daikuang_money3;
          var huan_money3 = daikuang_money3 + pay3;
          console.log(res);
          this.setData({
            need_money1: need_money1.toFixed(2),
            area_money3: (money1 * area1).toFixed(2),
            daikuang_money3: daikuang_money3.toFixed(2),
            pay_money2: res.toFixed(2),
            pay3: pay3.toFixed(2),
            huan_money3: huan_money3.toFixed(2),
          })
        } else {//等额本金
          var need_money2 = money1 * area1 - (money1 * area1 * (c_shu * 0.1));
          var area_money4 = money1 * area1 * (c_shu * 0.1);
          var res_two = this.result_two(area_money4, month1, rate1);
          var money_start1 = res_two[0];
          var money_end1 = res_two[1];
          var pay4 = res_two[2];
          var h_money4 = area_money4 + pay4;
          this.setData({
            need_money2: need_money2.toFixed(2),
            area_money4: (money1 * area1).toFixed(2),
            dk_money4: area_money4.toFixed(2),
            h_money4: h_money4.toFixed(2),
            pay4: pay4.toFixed(2),
            money_start1: money_start1.toFixed(2),
            money_end1: money_end1.toFixed(2),
          })
        }

      }

    }
  },
  //公积金贷款
  //点击总价tab切换
  jisuan1: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    this.setData({
      threeIndex: id
    })
  },
  //点击等额本金tab切换
  huankuang1: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    this.setData({
      fourIndex: id
    })
  },
  //总价选择器-按揭年数
  bindPickerChange3: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index3: e.detail.value
    })
  },
  //监测input输入的值
  money_val2: function (e) {
    this.setData({
      money2: e.detail.value
    })
  },
  //单价选择器
  // 按揭年数
  bindPickerChange5: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index5: e.detail.value
    })
  },
  // 按揭成数
  bindPickerChange4: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index4: e.detail.value
    })
  },
  //监测input输入的值
  money_val3: function (e) {
    this.setData({
      money3: e.detail.value
    })
  },
  area2: function (e) {
    this.setData({
      area2: e.detail.value
    })
  },
  //公积金贷款-开始计算
  doing2: function (e) {
    console.log(e);
    //总价
    var rate = e.currentTarget.dataset.bankrate;
    var money2 = this.data.money2;
    var month1 = this.data.month[this.data.index3];
    var fourIndex = this.data.fourIndex;
    console.log(money2 + ',' + month1 + ',' + rate + ',' + fourIndex);
    //等额本金
    var rate1 = e.currentTarget.dataset.bankrateone;
    var money3 = this.data.money3;
    var area2 = this.data.area2;
    var month2 = this.data.month[this.data.index5];
    var c_shu1 = this.data.c_shu[this.data.index4];
    console.log(rate1 + ',' + money3 + ',' + area2 + ',' + month2 + ',' + c_shu1);
    var sy_index1 = this.data.threeIndex;
    console.log(sy_index1);
    if (sy_index1 == 0) {//总价
      if (tools.isNull(money2)) {
        wx.showToast({
          title: '请输入贷款金额',
          icon: 'loading',
          duration: 2000
        })
      } else {
        if (fourIndex == '0') {//等额本息
          var res = this.result(money2 * 10000, month1, rate);
          var daikuang_money4 = money2 * 10000;
          var pay_four = month1 * res - daikuang_money4;
          var huan_money4 = daikuang_money4 + pay_four;
          console.log(res);
          this.setData({
            pay_money3: res.toFixed(2),
            pay_four: pay_four.toFixed(2),
            daikuang_money4: daikuang_money4.toFixed(2),
            huan_money4: huan_money4.toFixed(2),
          })
        } else {//等额本金
          var res_two = this.result_two(money2 * 10000, month1, rate);
          console.log(res_two);
          var money_start2 = res_two[0];
          var money_end2 = res_two[1];
          var dk_money5 = money2 * 10000;
          var pay5 = res_two[2];
          var h_money5 = dk_money5 + pay5;
          this.setData({
            money_start2: money_start2.toFixed(2),
            money_end2: money_end2.toFixed(2),
            dk_money5: dk_money5.toFixed(2),
            pay5: pay5.toFixed(2),
            h_money5: h_money5.toFixed(2),
          })
        }
      }
    } else {//单价
      if (tools.isNull(money3)) {
        wx.showToast({
          title: '请输入单价',
          icon: 'loading',
          duration: 2000
        })
      } else if (tools.isNull(area2)) {
        wx.showToast({
          title: '请输入面积',
          icon: 'loading',
          duration: 2000
        })
      } else {
        if (fourIndex == '0') {//等额本息 
          var need_money3 = money3 * area2 - (money3 * area2 * (c_shu1 * 0.1));
          var area_money6 = money3 * area2 * (c_shu1 * 0.1);
          var res = this.result(area_money6, month2, rate1);
          var daikuang_money6 = area_money6;
          var pay6 = month2 * res - daikuang_money6;
          var huan_money6 = daikuang_money6 + pay6;
          console.log(res);
          this.setData({
            need_money3: need_money3.toFixed(2),
            area_money6: (money3 * area2).toFixed(2),
            daikuang_money6: daikuang_money6.toFixed(2),
            pay_money4: res.toFixed(2),
            pay6: pay6.toFixed(2),
            huan_money6: huan_money6.toFixed(2),
          })
        } else {//等额本金
          var need_money4 = money3 * area2 - (money3 * area2 * (c_shu1 * 0.1));
          var area_money7 = money3 * area2 * (c_shu1 * 0.1);
          var res_two = this.result_two(area_money7, month2, rate1);
          var money_start3 = res_two[0];
          var money_end3 = res_two[1];
          var pay7 = res_two[2];
          var h_money7 = area_money7 + pay7;
          this.setData({
            need_money4: need_money4.toFixed(2),
            area_money7: (money3 * area2).toFixed(2),
            dk_money7: area_money7.toFixed(2),
            h_money7: h_money7.toFixed(2),
            pay7: pay7.toFixed(2),
            money_start3: money_start3.toFixed(2),
            money_end3: money_end3.toFixed(2),
          })
        }

      }

    }
  },
  //组合贷款
  //监测商业贷款input输入的值
  money_val4: function (e) {
    this.setData({
      money4: e.detail.value
    })
  },
  //监测公积金贷款input输入的值
  money_val5: function (e) {
    this.setData({
      money5: e.detail.value
    })
  },
  // 按揭年数
  bindPickerChange6: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index6: e.detail.value
    })
  },
  //点击等额本金tab切换
  huankuang2: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    this.setData({
      fiveIndex: id
    })
  },
  //组合贷款-开始计算
  doing3: function (e) {
    console.log(e);
    var rate = e.currentTarget.dataset.bankrate;
    var rate1 = e.currentTarget.dataset.bankrateone;
    var money4 = this.data.money4;
    var money5 = this.data.money5;
    var month = this.data.month[this.data.index6];
    var fiveIndex = this.data.fiveIndex;
    console.log(money4 + ',' + money5 + ',' + month + ',' + rate + ',' + rate1 + ',' + fiveIndex);
    if (tools.isNull(money4)) {
      wx.showToast({
        title: '请输入商业贷款金额',
        icon: 'loading',
        duration: 2000
      })
    } else if (tools.isNull(money5)) {
      wx.showToast({
        title: '请输入公积金贷款金额',
        icon: 'loading',
        duration: 2000
      })
    } else {
      if (fiveIndex == '0') {//等额本息 
        //商业
        var res = this.result(money4 * 10000, month, rate);
        var dk_moenys1 = money4 * 10000;
        var pays1 = month * res - dk_moenys1;
        var hk_moneys1 = dk_moenys1 + pays1;
        //公积金
        var res1 = this.result(money5 * 10000, month, rate1);
        var dk_moenys2 = money5 * 10000;
        var pays2 = month * res1 - dk_moenys2;
        var hk_moneys2 = dk_moenys2 + pays2;
        this.setData({
          daikuang_money_end: (dk_moenys1 + dk_moenys2).toFixed(2),
          huan_money_end: (hk_moneys1 + hk_moneys2).toFixed(2),
          pay_end: (pays1 + pays2).toFixed(2),
          pay_money_end: (res + res1).toFixed(2),
        })
      } else {//等额本金
        //商业
        var res_two = this.result_two(money4 * 10000, month, rate);
        var money_starts = res_two[0];
        var money_ends = res_two[1];
        var dk_moneys3 = money4 * 10000;
        var pays3 = res_two[2];
        var hk_moneys3 = dk_moneys3 + pays3;
        //公积金
        var res_two1 = this.result_two(money5 * 10000, month, rate1);
        var money_starts1 = res_two1[0];
        var money_ends1 = res_two1[1];
        var dk_moneys4 = money5 * 10000;
        var pays4 = res_two1[2];
        var hk_moneys5 = dk_moneys4 + pays4;
        this.setData({
          dk_money_end1: (dk_moneys3 + dk_moneys4).toFixed(2),
          h_money_end1: (hk_moneys3 + hk_moneys5).toFixed(2),
          pay_end1: (pays3 + pays4).toFixed(2),
          money_start4: (money_starts + money_starts1).toFixed(2),
          money_end4: (money_ends + money_ends1).toFixed(2),
        })
      }
    }
  },
  //商业贷款-公积金贷款-等额本息-算法
  result: function (money, month, rate) {
    var res_month = (money * (rate / 12) * Math.pow(1 + (rate / 12), month)) / (Math.pow(1 + (rate / 12), month) - 1);
    return res_month;
  },
  //商业贷款-公积金贷款-等额本金-算法
  result_two: function (money, month, rate) {
    var arr = [];
    var arr1 = [];
    for (var i = 0; i < month; i++) {
      arr1.push(money / month + (money - i * money / month) * rate / 12);
    }
    var money_start = arr1[0];
    arr.push(money_start);
    var money_end = arr1[month - 1];
    arr.push(money_end);
    var money_base = ((money / month + money * (rate / 12) + money / month * (1 + rate / 12)) / 2 * month - money);
    arr.push(money_base);
    return arr;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.wxRequest(//获取贷款利率
      '/Wxsite/Homepage/api',
      { 'api_name': 'getloanrate'},
      function (res) {
        if (res.data.code == '1') {
          that.setData({
            hidden: true,
            bank_rate: res.data.data.sydaikuan,
            bank_rate1: res.data.data.gjjdaikuan,
          });
        }
      })

    //获取客服电话
    app.wxRequest(
      '/Wxsite/Homepage/api',
      { 'api_name': 'contactUs' },
      function (res) {
        console.log(res);
        if (res.data.code == 1) {
          var data = res.data.data;
          that.setData({
            phoneNumber: data.phone
          })
        }
      }) 
  },
  onShareAppMessage: function () {
    return {
      title: '来宾房产网',
      path: '/pages/index/index'
    }
  }
})