// pages/regist/regist.js
import {
  $wuxToast
} from '../component/index';
var app = getApp();
var interval = null //倒计时函数
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tel: "",
    yanzhengma: "",
    pwd: "",
    name: "",
    isAgree: false,
    //倒计时初始秒数
    yzmInitTime: 91,
    //倒计时初始字段 
    yzmTime: '获取验证码',
    //验证码显示与隐藏
    yzmDisabled: false
  },
  showToastErr() {
    $wuxToast().show({
      type: 'forbidden',
      duration: 1500,
      color: '#fff',
      text: '禁止操作',
      success: () => console.log('禁止操作')
    })
  },
  //获取手机号
  tel: function(e) {
    var that = this;
    that.setData({
      tel: e.detail.value
    })
  },
  //校验验证码
  yanzhengma: function(e) {
    var that = this;
    if (parseInt(e.detail.value.length) < 1) {
      return;
    }
    that.setData({
      yanzhengma: e.detail.value
    })
    console.log(that.data.yanzhengma);
    //校验验证码
    var data = {};
    data.verifyCode = that.data.yanzhengma;
    data.phone = that.data.tel;
    app.ajax.req('public_api_controller/bgxisphonecode', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '验证码有误',
          icon: 'none',
        })
      }
    })
  },
  //获取手机验证码
  getCode: function(options) {
    var that = this;
    if (!that.data.tel) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return false;
    } else if (parseInt(that.data.tel.length) !== 11) {
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
    var data = {};
    data.phone = that.data.tel;
    //点击获取验证码
    app.ajax.req('public_api_controller/bgxsendcode', data, 'GET', function(res) {
      if (parseInt(res.errorCode) !== 200) {
        wx.showToast({
          title: res.errorDesc,
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    })
  },
  //获取手机密码
  pwd: function(e) {
    var that = this;
    that.setData({
      pwd: e.detail.value
    })
    if (e.detail.value.length < 6) {
      wx.showToast({
        title: '密码最少6位',
        icon: 'none'
      })
    }
  },
  //获取姓名
  name: function(e) {
    var that = this;
    that.setData({
      name: e.detail.value
    })
  },
  //获取阅读条款的选中状态
  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
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
  regist: function() {
    var that = this;
    console.log(that.data.pwd);
    if (!that.data.tel) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
      })
      return;
    } else if (parseInt(that.data.tel.length) !== 11) {
      wx.showToast({
        title: '手机号长度有误',
        icon: 'none',
      })
      return;
    } else if (!that.data.yanzhengma) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
      })
      return;
    } else if (!that.data.pwd) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
      })
      return;
    } else if (that.data.pwd.length < 6) {
      wx.showToast({
        title: '密码长度有误',
        icon: 'none',
      })
      return;
    } else if (!that.data.name) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
      })
      return;
    } else if (!that.data.isAgree) {
      wx.showToast({
        title: '未勾选协议',
        icon: 'none',
      })
      return;
    }
    wx.showLoading({
      title: '注册中',
    })
    //用户注册接口
    var data = {};
    data.phone = that.data.tel;
    data.pwd = that.data.pwd;
    data.userName = that.data.name;
    data.code = that.data.yanzhengma;
    app.ajax.req('user_api_controller/bgxregister', data, 'GET', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) == 200) {
        wx.hideToast();
        wx.showToast({
          title: '注册成功！',
          icon: 'success',
          duration: 1000
        })
        //跳转到登录页面
        setTimeout(function() {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }, 1500);
      } else {
        wx.hideToast();
        wx.showToast({
          title: res.errorDesc,
          icon: 'none'
        })
      }
    })
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