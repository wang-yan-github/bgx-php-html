// pages/xiaoxi/SystemXiaoxi.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    info: '',
    list: []
  },
  messageList: function() {
    var that = this;
    var data = {};
    data.token = app.globalData.token;
    wx.showLoading({
      title: '加载中',
    })
    app.ajax.req('message_api_controller/messageInfo', data, 'get', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        console.log(res.data);
        that.setData({
          list: res.data.list
        })
      }
    })
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
    this.messageList();
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