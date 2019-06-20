// pages/lwXQ/lwXQ.js
import {
  $wuxActionSheet
} from '../component/index';
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wid: null,
    touxiang: '',
    type_: '',
    //劳务名称
    lwname: '',
    //信用等级
    creditScore: '',
    //认证小图标
    renzheng: '/pages/images/weirenzheng.png',
    jineng: '',
    tel: '',
    introduceMyself: '',
    sex: '',
    age: '',
    addr: '',
    cy_time: 10,
    certificates: [],
    yeji: '',
    quyu: '',
    yeji_content_show: [],
    bsid: '',
    xmlist: [],
    pid: '',
    visible: false,
    reviewData: [],
    technicalType: ''
  },
  previewImage: function(e) {
    var arr = [];
    let images = e.currentTarget.dataset.images;
    for (let i = 0; i < images.length; i++) {
      arr.push(images[i].certificate);
    }
    let current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接		  
      urls: arr // 需要预览的图片http链接列表		
    })
  },
  previewImage1: function(e) {
    var arr = [];
    let images = e.currentTarget.dataset.images;
    for (let i = 0; i < images.length; i++) {
      arr.push(images[i].pFile);
    }
    let current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接		  
      urls: arr // 需要预览的图片http链接列表		
    })
  },
  lianxi: function() {
    //获得手机号
    // var wid = this.data.wid;
    // var data = {};
    // data.token = app.globalData.token;
    // data.w_id = wid;
    // app.ajax.req('bespeak_api_controller/bgxworkerinfo', data, 'GET', function(res) {
    //   if (parseInt(res.errorCode) !== 200) {
    //     wx.showToast({
    //       title: '哎哟！你的网络开小差了',
    //       icon: 'none'
    //     })
    //   } else {
    //     wx.makePhoneCall({
    //       phoneNumber: res.data.phone,
    //     })
    //   }
    // })

    //跳转到聊天界面
    let infoId = this.data.wid;
    let lwname = this.data.lwname;
    if (infoId == app.globalData.infoId) {
      wx.showToast({
        title: '不能联系自己',
        icon: 'none'
      })
      return false;
    }
    let type_ = ('发包方' == this.data.type_) ? 1 : ('包工侠' == this.data.type_) ? 2 : 3;
    wx.navigateTo({
      url: '../xiaoxi/pageXiaoxi?to_id=' + infoId + '&to_type=' + type_ + '&duty_name=' + lwname
    })
  },
  showActionSheet2() {
    var that = this;
    $wuxActionSheet('#wux-actionsheet').showSheet({
      titleText: '请选择关联项目',
      buttons: that.data.xmlist,
      buttonClicked(index, item) {
        that.setData({
          pid: item.p_id
        })
        console.log("pid:" + that.data.pid);
        var bs_id = that.data.bsid;
        if (that.data.type_ == '包工侠') {
          var bs_identity = 2;
        }
        if (that.data.type_ == '劳务') {
          var bs_identity = 3;
        }
        var p_id = that.data.pid;
        //2为预约劳务
        app.yuyue(bs_id, bs_identity, p_id, 2);
        return true;
      },
      cancelText: '取消',
      cancel() {}
    })
  },
  yuyue: function() {
    var that = this;
    if (app.globalData.roleIndex == 0) { //发包方
      let data = {};
      data.token = app.globalData.token;
      app.ajax.req('bespeak_api_controller/getProject', data, 'GET', function(res) {
        if (parseInt(res.errorCode) === 200) {
          if (res.data.length == 0) {
            wx.showToast({
              title: '您还没有发布项目或未审核通过的项目',
              icon: 'none'
            })
          } else {
            that.setData({
              xmlist: res.data
            })
            that.showActionSheet2();
          }
        }
      })
    } else {
      var bs_id = that.data.bsid;
      if (that.data.type_ == '包工侠') {
        var bs_identity = 2;
      }
      if (that.data.type_ == '劳务') {
        var bs_identity = 3;
      }
      //2为预约劳务
      app.yuyue(bs_id, bs_identity, '', 2);
    }
  },
  //查询业绩
  showYeji: function(that, wid) {
    let data = {};
    data.token = app.globalData.token;
    data.w_id = wid;
    data.offset = 1;
    data.limit = 10;
    app.ajax.req('achieve_api_controller/acgueveList', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        that.setData({
          yeji_content_show: res.data.list
        })
      }
    })
  },
  //查询详情
  showLWInfo: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var wid = that.data.wid;
    var data = {};
    data.token = app.globalData.token;
    data.w_id = wid;
    app.ajax.req('workerproject_api_controller/bgxworkerinfo', data, 'GET', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        //区域查询
        var quyu_code = res.data.region;
        var quyu = app.regionalParse(quyu_code);

        that.setData({
          touxiang: res.data.headPortrait,
          //劳务名称
          lwname: res.data.dutyName,
          type_: res.data.type,
          //信用等级
          creditScore: res.data.creditScore,
          //认证小图标
          // renzheng: res.data.registration,
          jineng: res.data.consType,
          tel: res.data.dutyPhone,
          introduceMyself: res.data.introduction,
          sex: res.data.sex,
          age: res.data.age,
          addr: quyu.city.name,
          cy_time: res.data.work_time,
          certificates: res.data.certificates,
          bsid: res.data.w_id,
          reviewData: res.data.reviewList,
          technicalType: res.data.technicalType
        })
        //显示业绩
        that.showYeji(that, wid);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      touxiang: app.globalData.touxiang,
      wid: options.wid
    })
    this.showLWInfo();
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
    this.showLWInfo();
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 100);
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