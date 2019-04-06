//app.js
const tools = require('./utils/tools.js');
const dataJs = require('./utils/data.js');
App({
    onLaunch: function (opt) {
        wx.removeStorage({
            key: 'type'
        });
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || [];
        logs.unshift(Date.now());
        wx.setStorageSync('logs', logs);
        
        wx.getSystemInfo({
          success: function (res) {
            var kScreenW = res.windowWidth / 375
            var kScreenH = res.windowHeight / 603
            wx.setStorageSync('kScreenW', kScreenW)
            wx.setStorageSync('kScreenH', kScreenH)
          }
        })
    },
    onShow: function (opt) {
        this.tools = tools;//全局注入tools.js
        this.dataJs = dataJs;//全局注入data.js
        if (opt.scene == 1044) {
            wx.getShareInfo({
                shareTicket: opt.shareTicket,
                success: function (res) {
                    console.log(res);
                    wx.setStorageSync('type', 3);
                    wx.setStorageSync('encryptedData', res.encryptedData);
                    wx.setStorageSync('iv', res.iv);
                    console.log('getShareInfo');
                },
                fail: function (err) {
                    console.log(err);
                }
            })
        } else if (opt.scene == 1007) {
            wx.setStorageSync('type', 4);
        } else {
            wx.setStorage({
                key: 'type',
                data: 1
            });
        }
    },
    /*
     cb(flag, name, result, data)
     name 为自已定义的标识符，回调会原样返回

     flag = 1  选择文件成功，result选择的结果，状态显示为正在上传文件
     flag = -1 选择文件失败，result为失败结果

     flag = 2 为上传文件成功，result为文件id传给服务器, data为上传文件src等详细数据
     flag = -2 为上传文件失败，result为失败结果
     flag = -3 为文件保存失败，result为失败原因

     flag = -4 最多只能上传10张
     */
    uploadFile: function (name, cb, data, params,count) {//name自定标识,cb回调函数,data其它表单json,params chooseImage参数{count:1}
        var that = this;
        var count;
        count = (name==1?1:count);
        var chooseParams = {
            count: count,
            success: function (res1) {
                console.log(res1);
                typeof cb == "function" && cb(1, name, res1);
                if (wx.getStorageSync('allowPicNum') && wx.getStorageSync('allowPicNum') <= 0) {
                    return false;
                }
                var tempFilePaths = wx.getStorageSync('allowPicNum') ? res1.tempFilePaths.slice(0, wx.getStorageSync('allowPicNum')) : res1.tempFilePaths;
                for (var tempFileIndex in tempFilePaths) {
                    wx.uploadFile({
                      url: that.globalData.dlcurl + '/Wxsite/Myuser/apiN',
                        filePath: tempFilePaths[tempFileIndex],
                        name: 'file',
                        formData: data || {},
                        success: function (res3) {
                            console.log(res3);
                            res3 = res3.data;
                            res3 = res3.trim();
                            res3 = JSON.parse(res3);
                            res3 = res3.data;
                            console.log(res3);
                            typeof cb == "function" && cb(2, name, res3);
                        },
                        fail: function (res2) {
                            typeof cb == "function" && cb(-2, name, res2);
                        }
                    })
                }
            },
            fail: function (res1) {
                typeof cb == "function" && cb(-1, name, res1);
            }
        };
        if (typeof params == 'object') {
            for (var i in params) chooseParams[i] = params[i];
        }
        wx.chooseImage(chooseParams)
    },
    //请求接口
    wxRequest: function (url, data, successCB, failCB) {
        var that = this;
        var requestUrl = that.globalData.dlcurl + url;
        var requestMethod = 'POST';
        var requestConType = 'application/x-www-form-urlencoded';
        if (typeof url != 'string') {
            requestUrl = url.url;
            requestMethod = url.method;
            requestConType = url.conType;
        }
        wx.request({
            url: requestUrl,
            header: {
                'content-type': requestConType,
                'token': that.globalData.userData ? that.globalData.userData.token : '',
                'lng': that.globalData.lng || '',
                'lat': that.globalData.lat || ''
            },
            data: data,
            method: requestMethod,
            success: function (res) {
                typeof successCB == "function" && successCB(res);
            },
            fail: function (res) {
                typeof failCB == "function" && failCB(res);
            }
        })
    },
    globalData: {
      // dlcurl: 'https://eshouse.https.xiaozhuschool.com',
      dlcurl: 'https://jk.0759hn.com',
      citys: '',
      old_house:'',
      new_house:''
    },
})
