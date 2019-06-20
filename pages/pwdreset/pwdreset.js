// pages/pwdreset/pwdreset.js
var interval = null //倒计时函数
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "tel": "",
    "yzm": "",
    "pwd": "",
    "repwd": "",
    //倒计时初始秒数
    yzmInitTime: 61,
    //倒计时初始字段 
    yzmTime: '获取验证码',
    //验证码显示与隐藏
    yzmDisabled: false,
    //提交按钮的状态
    buttonDisable: false
  },
  //获取手机号
  tel: function(e) {
    var that = this;
    that.setData({
      tel: e.detail.value
    })
  },
  //获取密码
  pwd: function(e) {
    var that = this;
    that.setData({
      pwd: e.detail.value
    })
  },
  //再次获取密码
  repwd: function(e) {
    var that = this;
    that.setData({
      repwd: e.detail.value
    })
  },
  //获取验证码
  yzm: function(e) {
    var that = this;
    that.setData({
      yzm: e.detail.value
    })
  },
  pwdreset: function() {
    var that = this;
    if (!that.data.tel) {
      wx.showToast({
        title: '手机号不为空',
        icon: 'none'
      })
      return false;
    } else if (!that.data.yzm) {
      wx.showToast({
        title: '验证码不为空',
        icon: 'none'
      })
      return false;
    } else if (!that.data.pwd) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return false;
    } else if (!that.data.repwd) {
      wx.showToast({
        title: '请再次输入密码',
        icon: 'none'
      })
      return false;
    } else if (that.data.pwd !== that.data.repwd) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      })
      return;
    }
    //设置按钮不能点击
    that.setData({
      buttonDisable: true
    })
    wx.showLoading({
      title: '修改中',
    })
    let data = {};
    data.phone = that.data.tel;
    data.code = that.data.yzm;
    data.pwd = that.data.pwd;
    app.ajax.req('user_api_controller/bgxresterpwd', data, 'GET', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '修改密码成功',
          duration: 1000
        })
        setTimeout(function() {
          wx.redirectTo({
            url: '../login/login',
          })
        }, 1500)
      }
      that.setData({
        buttonDisable: false
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  //获取手机验证码
  getCode: function(options) {
    var that = this;
    if (that.data.yzmDisabled) {
      return;
    }
    if (!that.data.tel) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return false;
    }
    if (parseInt(that.data.tel.length) !== 11) {
      wx.showToast({
        title: '手机号长度有误',
        icon: 'none'
      })
      return false;
    }
    //设置验证码不可点击
    that.setData({
      yzmDisabled: true
    })
    var data = {};
    data.phone = that.data.tel;
    //点击获取验证码
    app.ajax.req('public_api_controller/bgxsendcode', data, 'GET', function(res) {
      if (parseInt(res.errorCode) !== 200) {
        wx.showToast({
          title: res.errorDesc,
          icon: 'none'
        })
        return;
      }
      //处理倒计时
      var currentTime = that.data.yzmInitTime;
      interval = setInterval(function() {
        currentTime--;
        that.setData({
          yzmTime: currentTime + '秒'
        })
        if (currentTime <= 0) {
          clearInterval(interval)
          that.setData({
            yzmTime: '重新发送',
            yzmInitTime: 91,
            yzmDisabled: false
          })
        }
      }, 1000)
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