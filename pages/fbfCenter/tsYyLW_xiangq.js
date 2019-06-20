// pages/fbfCenter/tsYyLW_xiangq.js
var tcity = require("../../utils/citys.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lw_info: {},
    canWorkAddr: '',
    jiaxiang: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options);
    var wid = options.wid;
    var pid = options.pid;
    if (wid) {
      wx.showLoading({
        title: '加载中',
      })
      var data = {};
      data.token = app.globalData.token;
      data.w_id = wid;
      data.p_id = pid;
      app.ajax.req('workerproject_api_controller/bgxworkerinfo', data, 'GET', function(res) {
        wx.hideLoading();
        if (parseInt(res.errorCode) === 200) {
          that.setData({
            lw_info: res.data
          })
          //可施工地匹配
          var canWorkAddr = app.getWorkAddr(res.data.workAddress);
          let arr = [];
          for (let i = 0; i < canWorkAddr.length; i++) {
            arr.push(canWorkAddr[i].name);
          }
          that.setData({
            canWorkAddr: arr.join(',')
          })
          //家乡地址匹配
          var region = app.regionalParse(res.data.region);
          var jiaxiang = region.province.name + '_' + region.city.name + '_' + region.county.name ? region.county.name : '';
          that.setData({
            jiaxiang: jiaxiang
          })
        }
      })
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