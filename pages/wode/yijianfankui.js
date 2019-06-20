// pages/wode/yijianfankui.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fankuiText: ''
  },
  fankui: function() {
    var data = {};
    data.token = app.globalData.token;
    data.content = this.data.fankuiText;
    app.ajax.req('feedback_api_controller/feedbackAdd', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '谢谢您的反馈！',
          icon: 'none',
          duration: 1000
        })
        setTimeout(function() {
          wx.navigateBack();
        }, 1500)
      }
    })
  },
  fankuiText: function(e) {
    this.setData({
      fankuiText: e.detail.value
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