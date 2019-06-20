// pages/wode/qiehuanRole.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isfbf: true,
    isbgx: true,
    islw: true,
    iscls: true
  },
  click_: function(e) {
    //清除全局消息定时器
    clearTimeout(app.globalData.xiaoxiTime);
    var role = e.currentTarget.dataset.text;
    switch (role) {
      case "发包方":
        app.globalData.roleIndex = 0;
        wx.setStorageSync('roleIndex', 0);
        wx.redirectTo({
          url: '../login/login',
        })
        break;
      case "包工侠":
        app.globalData.roleIndex = 1;
        wx.setStorageSync('roleIndex', 1);
        wx.redirectTo({
          url: '../login/login',
        })
        break;
      case "劳务":
        app.globalData.roleIndex = 2;
        wx.setStorageSync('roleIndex', 2);
        wx.redirectTo({
          url: '../login/login',
        })
        break;
      case "材料商":
        wx.showToast({
          title: '功能升级中',
          icon: 'none'
        })
        // app.globalData.roleIndex = 3;
        // wx.redirectTo({
        //   url: '../login/login',
        // })
        break;
      default:
        wx.redirectTo({
          url: '../login/login',
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //当前角色
    var role = app.globalData.roles[app.globalData.roleIndex];
    switch (role) {
      case "发包方":
        that.setData({
          isfbf: false,
          isbgx: true,
          islw: true,
          iscls: true
        })
        break;
      case "包工侠":
        that.setData({
          isfbf: true,
          isbgx: false,
          islw: true,
          iscls: true
        })
        break;
      case "劳务":
        that.setData({
          isfbf: true,
          isbgx: true,
          islw: false,
          iscls: true
        })
        break;
      case "材料商":
        that.setData({
          isfbf: true,
          isbgx: true,
          islw: true,
          iscls: false
        })
        break;
    }
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