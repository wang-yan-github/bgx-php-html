// pages/xiaoxi/xiaoxi.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: ''
  },
  messageList: function() {
    var that = this;
    if (!app.globalData.token) {
      return false;
    }
    var data = {};
    data.token = app.globalData.token;
    wx.showLoading({
      title: '加载中'
    })
    //请求系统消息
    app.ajax.req('message_api_controller/messageList', data, 'POST', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        that.setData({
          info: res.data
        })
        //马上调用消息条数
        clearTimeout(app.globalData.xiaoxiTime);
        app.showXiaoxiTotal();
      }
    })
  },
  system_xiaoxi: function() {
    wx.navigateTo({
      url: 'SystemXiaoxi'
    })
  },
  liaotian: function() {
    if (this.data.info.l_total == 0) {
      wx.showToast({
        title: '暂无消息',
        icon: 'none'
      })
      return false;
    }
    wx.navigateTo({
      url: 'liaotianXiaoxi'
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
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!app.globalData.token) {
      wx.showModal({
        title: '登录提醒',
        content: '您还未登录，不能查看消息',
        confirmText: "登录",
        cancelText: "返回",
        success: function(res) {
          console.log(res);
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
      this.messageList();
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