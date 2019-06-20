// pages/login/login.js
import {
  $wuxSelect
} from '../component/index';
var interval = null;
var app = getApp();
Page({
  data: {
    //角色
    value1: '',
    title1: '',
    //角色下标
    roleIndex: -1,
    //当前标签页
    current: '密码登录',
    //手机号
    tel: "",
    //密码
    pwd: "",
    //用户名
    username: "",
    //登录令牌
    token: '',
    //倒计时初始秒数
    yzmInitTime: 61,
    //倒计时初始字段
    yzmTime: '获取验证码',
    //验证码显示与隐藏
    yzmDisabled: false,
    yanzhengma: ''
  },
  //切换标签页
  onChange(e) {
    console.log('onChange', e)
    this.setData({
      current: e.detail.key,
    })
  },
  //下拉列表角色选择
  onClick1() {
    $wuxSelect('#wux-select1').open({
      value: this.data.value1,
      options: [
        '发包方',
        '包工侠',
        '劳务'
      ],
      onConfirm: (value, index, options) => {
        console.log(value, index, options)
        this.setData({
          value1: value,
          title1: options[index],
          roleIndex: index
        })
      },
    })
  },
  //获取手机号
  tel: function(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  //获取密码
  pwd: function(e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  //获取验证码
  yanzhengma: function(e) {
    this.setData({
      yanzhengma: e.detail.value
    })
  },
  //非空验证公共函数
  ValueIsNull: function(that) {
    if (that.data.roleIndex == -1) {
      wx.showToast({
        title: '请选择角色',
        icon: 'none'
      })
      return;
    }
    if (!that.data.tel) {
      wx.showToast({
        title: '手机号不为空',
        icon: 'none'
      })
      return;
    }
  },
  //登录返回结果集处理
  loginRes: function(that, res) {
    try {
      wx.setStorageSync('tel', that.data.tel);
      wx.setStorageSync('username', res.data.userName);
      wx.setStorageSync('roleIndex', parseInt(that.data.roleIndex));
      if (that.data.pwd) {
        wx.setStorageSync('pwd', that.data.pwd);
      }
    } catch (e) {
      wx.showToast({
        title: e,
        icon: 'none'
      })
    }
    app.globalData.token = res.data.token;
    app.globalData.roleIndex = parseInt(that.data.roleIndex);
    app.globalData.perfectStatus = parseInt(res.data.perfectStatus);
    app.globalData.touxiang = res.data.headPortrait ? res.data.headPortrait : app.globalData.touxiang;
    app.globalData.infoId = res.data.infoId;
    //判断是否已完善基本信息
    if (parseInt(res.data.perfectStatus) === 0) { //待完善信息
      wx.showModal({
        title: '未完善信息',
        content: '当前角色未完善信息，不能进行其他操作',
        confirmText: "去完善",
        cancelText: "返回",
        success: function(res) {
          if (res.confirm) {
            if (parseInt(that.data.roleIndex) === 0) { //发包方
              wx.redirectTo({
                url: '../fbfCenter/fabaofangPersonalInfo',
              })
            } else if (parseInt(that.data.roleIndex) === 1) { //包工侠
              wx.redirectTo({
                url: '../bgxCenter/bgxPersonalInfo',
              })
            } else if (parseInt(that.data.roleIndex) === 2) { //劳务
              wx.redirectTo({
                url: '../lwCenter/lwPersonalInfo',
              })
            }
          } else {
            //全局变量初始化
            app.globalData.token = '';
            wx.clearStorageSync('tel');
            wx.clearStorageSync('username');
            wx.clearStorageSync('roleIndex');
            if (that.data.pwd) {
              wx.clearStorageSync('pwd');
            }
            app.globalData.roleIndex = -1;
            app.globalData.perfectStatus = 0;
            app.globalData.touxiang = '/pages/images/touxiang.png';
            wx.switchTab({
              url: '../index/index'
            })
          }
        }
      });
    } else { //已完善信息
      wx.switchTab({
        url: '../index/index'
      })
      //消息的总条数
      app.showXiaoxiTotal();
    }
  },
  //密码登录
  pwdlogin: function(e) {
    var that = this;
    //非空验证
    that.ValueIsNull(that);
    if (!that.data.pwd) {
      wx.showToast({
        title: '密码不为空',
        icon: 'none'
      })
      return;
    }
    //登录接口
    wx.showLoading({
      title: '加载中',
    })
    var data = {};
    data.phone = that.data.tel;
    data.passWord = that.data.pwd;
    data.role = parseInt(that.data.roleIndex) + 1;
    app.ajax.req('user_api_controller/bgxlogin', data, 'GET', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        that.loginRes(that, res);
      } else {
        wx.showToast({
          title: res.errorDesc,
          icon: 'none'
        })
      }
    })
  },
  //验证码登录
  yzmlogin: function(e) {
    var that = this;
    //非空验证
    that.ValueIsNull(that);
    if (!that.data.yanzhengma) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    //角色处理
    var data = {};
    data.phone = that.data.tel;
    data.code = that.data.yanzhengma;
    data.role = parseInt(that.data.roleIndex) + 1;
    app.ajax.req('user_api_controller/phonelogin', data, 'GET', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        that.loginRes(that, res);
      } else {
        wx.showToast({
          title: res.errorDesc,
          icon: none
        })
      }
    })
  },
  onLoad: function(options) {
    var that = this;
    //已有角色
    if (wx.getStorageSync('roleIndex') == 0) {
      that.setData({
        value1: '发包方'
      })
    } else if (wx.getStorageSync('roleIndex') == 1) {
      that.setData({
        value1: '包工侠'
      })
    } else if (wx.getStorageSync('roleIndex') == 2) {
      that.setData({
        value1: '劳务'
      })
    }
    that.setData({
      tel: wx.getStorageSync('tel'),
      pwd: wx.getStorageSync('pwd'),
      roleIndex: wx.getStorageSync('roleIndex'),
    })
    if (that.data.pwd !== '') {
      this.pwdlogin();
    }
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
      return;
    }
    if (parseInt(that.data.tel.length) !== 11) {
      wx.showToast({
        title: '手机号长度有误',
        icon: 'none'
      })
      return;
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
    }, 1000);
    //点击获取验证码
    var data = {};
    data.phone = that.data.tel;
    app.ajax.req('public_api_controller/bgxsendcode', data, 'GET', function(res) {
      if (parseInt(res.errorCode) !== 200) {
        wx.showToast({
          title: res.errorDesc,
          icon: 'none'
        })
        return;
      }
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