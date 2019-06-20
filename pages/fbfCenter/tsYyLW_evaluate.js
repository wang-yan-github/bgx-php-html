// pages/fbfCenter/tsYyLW_evaluate.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fenshu: 60,
    zishu: 0,
    text: '',
    wid: -1,
    wpid: -1,
    slider: 3
  },
  submit: function() {
    var data = {};
    data.token = app.globalData.token;
    data.r_id = this.data.wid;
    data.w_pid = this.data.wpid;
    data.firstScore = this.data.fenshu;
    if (!this.data.text) {
      wx.showToast({
        title: '请输入文字在提交',
      })
      return;
    }
    data.firstComment = this.data.text;
    app.ajax.req('review_api_controller/bgxreviewadd', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 1000
        })
        //返回列表页
        setTimeout(function() {
          wx.navigateBack();
        }, 1500);
      }
    })

  },
  text: function(e) {
    this.setData({
      zishu: e.detail.value.length,
      text: e.detail.value
    })
  },

  sliderChange(e) {
    this.setData({
      slider: e.detail.value,
      fenshu: e.detail.value * 20
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var wid = options.wid;
    var wpid = options.wpid;
    that.setData({
      wid: wid,
      wpid: wpid
    })
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