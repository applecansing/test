const app = getApp();
Page({
  data: {
    win_height:'',//设备高度
    win_width:'',//设备宽度
    markers:[],//地图marker
    onOff:0,
    controls: [{
      id: -1,
      position: {
        left: 177.5 * wx.getStorageSync("kScreenW"),
        top: 261.5 * wx.getStorageSync("kScreenH"),
        width: 21 * wx.getStorageSync("kScreenW"),
        height: 47 * wx.getStorageSync("kScreenW")
      },
      iconPath: '../../img/ico31.png',
      clickable: false,
    }]
  },

  onLoad: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        //设置map高度，根据当前设备宽高满屏显示
        that.setData({
          view: {
            win_height: res.windowHeight,
            win_width: res.windowWidth
          }
        });
      }
    });
    that.getLocation_fn();
  },

  onReady: function () {
    this.mapCtx = wx.createMapContext('map');
  },

  onShow: function () {
  
  },

  getLocation_fn(){//定位
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res);//定位获取成功
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        that.show_markers(res.latitude, res.longitude);
      }
    })
  },
  drag_map(e){
    console.log(e);
    let that = this;
    //获取当前地图的中心经纬度
    if(e.type == 'end'){
      this.mapCtx.getCenterLocation({
        success: function (res) {
          that.show_markers(res.latitude, res.longitude);
        }
      })
    }
  },
  show_markers(lat,lng){//获取marker并完成页面渲染
    let that = this;
    let markers = [];
    new Promise(function (resolve, reject) {
      app.wxRequest('/Wxsite/Homepage/api', { 'api_name': 'branch', 'lat': lat, 'lng': lng }, function (res) {
        console.log(res);
        if (res.data.code == 1) {
          res.data.data.forEach((item, index) => {
            markers.push({
              id:item.id,
              latitude: item.lat,
              longitude: item.lng,
              width: 40,
              height: 43,
              name: 'hello',
              iconPath: "../../img/marker.png",
              title: "",
              anchor: { x: .5, y: .5 }
            });
          });
        } else {
          wx.showToast({
            icon: 'loading',
            title: '请求失败'
          });
        }
        that.setData({
          markers: markers,
          onOff:0
        });
        resolve();
      });
    });
  },
  //点击merkers,获取marker信息
  markertap(e) {
    console.log(e);
    if (e.markerId < 0) {
      return false;
    } else {
      wx.navigateTo({
        url: '/pages/house_details/details?id='+e.markerId,
      });
    }
  }
})