// pages/wode/setting.js
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isfbf: false
  },
  //联系我们
  settingBanbenInfo: function() {
    wx.navigateTo({
      url: 'setting_banben',
    })
  },
  //我的标签
  settingWodeTag: function() {
    wx.showToast({
      title: '敬请期待',
      icon: 'none'
    })
  },
  //工作状态
  settingWorkStatus: function() {
    wx.navigateTo({
      url: 'setting_workStatus',
    })
  },
  //实名认证
  settingNameOK: function() {
    wx.navigateTo({
      url: 'certification',
    })
  },
  //设置手机号
  settingPhone: function() {
    wx.navigateTo({
      url: 'editPhone',
    })
  },
  //设置密码
  settingpwd: function() {
    wx.navigateTo({
      url: '../pwdreset/pwdreset',
    })
  },
  //意见反馈
  yijianfankui: function() {
    wx.navigateTo({
      url: 'yijianfankui'
    })
  },
  //帮助中心
  helpCenter: function() {
    wx.navigateTo({
      url: 'helpCenter'
    })
  },
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
    if (app.globalData.roleIndex == 0) {
      this.setData({
        isfbf: true
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