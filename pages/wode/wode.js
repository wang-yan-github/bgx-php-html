// pages/wode/wode.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    banzuShow: true,
    fabuShow: true,
    clsShow: true,
    tsYyLwShow: true,
    name: '',
    tel: '',
    role: '',
    touxiang: '',
    x_total: '',
    l_total: ''
  },
  reset: function() {
    //清除全局消息定时器
    clearTimeout(app.globalData.xiaoxiTime);
    //数据重置
    app.globalData.roleIndex = -1;
    app.globalData.token = '';
    wx.removeStorageSync('tel');
    wx.removeStorageSync('username');
    wx.removeStorageSync('pwd');
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  //推送预约劳务管理
  tsYyLwTap: function() {
    var that = this;
    //当前角色
    var role = app.globalData.roles[app.globalData.roleIndex];
    switch (role) {
      case "发包方":
        wx.navigateTo({
          url: '../fbfCenter/tsYyLW',
        })
        break;
      case "包工侠":
        wx.navigateTo({
          url: '../bgxCenter/bgx_tsYyLW',
        })
        break;
    }
  },
  setting: function() {
    wx.navigateTo({
      url: 'setting'
    })
  },
  //推送预约项目管理
  tsyyXmTap: function(e) {
    var that = this;
    //当前角色
    var role = app.globalData.roles[app.globalData.roleIndex];
    switch (role) {
      case "发包方":
        wx.navigateTo({
          url: '../fbfCenter/tsYyXM',
        })
        break;
      case "包工侠":
        wx.navigateTo({
          url: '../bgxCenter/bgx_tsYyXM',
        })
        break;
      case "劳务":
        wx.navigateTo({
          url: '../lwCenter/lw_tsYyXM',
        })
        break;
    }
  },
  //点击基本信息
  infoTap: function(e) {
    var that = this;
    //当前角色
    var role = app.globalData.roles[app.globalData.roleIndex];
    switch (role) {
      case "发包方":
        wx.navigateTo({
          url: '../fbfCenter/fabaofangPersonalInfo',
        })
        break;
      case "包工侠":
        wx.navigateTo({
          url: '../bgxCenter/bgxPersonalInfo',
        })
        break;
      case "劳务":
        wx.navigateTo({
          url: '../lwCenter/lwPersonalInfo',
        })
        break;
    }
  },
  fabuTap: function(e) {
    var that = this;
    if (app.globalData.perfectStatus == 0) {
      wx.showToast({
        title: '当前角色基本信息未审核通过，不能发布项目',
        icon: 'none'
      })
      return;
    }
    //当前角色
    var role = app.globalData.roles[app.globalData.roleIndex];
    console.log(role);
    if (role == "发包方") {
      wx.navigateTo({
        url: '../fbfCenter/fabuXM',
      })
    } else {
      wx.showToast({
        title: '请切换发包方角色',
        image: '/pages/images/icon_fail.png',
        duration: 2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (!app.globalData.token) {
      wx.showModal({
        title: '登录提醒',
        content: '您还未登录，不能查看消息',
        confirmText: "登录",
        cancelText: "返回",
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login',
            })
          } else {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      });
    } else {
      //当前角色
      var role = app.globalData.roles[app.globalData.roleIndex];
      that.setData({
        role: role,
        name: wx.getStorageSync('username'),
        tel: wx.getStorageSync('tel'),
        touxiang: app.globalData.touxiang
      })
      switch (role) {
        case "发包方":
          that.setData({
            banzuShow: false,
            fabuShow: true,
            tsYyLwShow: true
          })
          break;
        case "包工侠":
          that.setData({
            banzuShow: false,
            fabuShow: false,
            tsYyLwShow: true
          })
          break;
        case "劳务":
          that.setData({
            banzuShow: false,
            fabuShow: false,
            tsYyLwShow: false
          })
          break;
        case "材料商":
          that.setData({
            banzuShow: false,
            fabuShow: false,
            clsShow: false,
            tsYyLwShow: false
          })
          break;
      }
      let data = {};
      data.token = app.globalData.token;
      app.ajax.req('message_api_controller/bgxPushList', data, 'POST', function(res) {
        if (Number.parseInt(res.errorCode) === 200) {
          that.setData({
            x_total: res.data.x_total,
            l_total: res.data.l_total ? res.data.l_total : ''
          })
          //马上调用消息条数
          clearTimeout(app.globalData.xiaoxiTime);
          app.showXiaoxiTotal();
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})