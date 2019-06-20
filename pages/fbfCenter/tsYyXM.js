// pages/fbfCenter/tsYyXM.js
var app = getApp();
var socketOpen = false;
var socketMsgQueue = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    //项目列表操作按钮的显示与隐藏
    oprator_show: false,
    oprator_index: 0,
    //搜索栏
    searchText: '',
    //总页数
    total: 0,
    //当前页数
    offset: 1
  },
  //搜索栏键盘输入时触发
  searchTextonChange(e) {
    this.setData({
      searchText: e.detail.value,
      offset: 1,
      listData: []
    })
    var that = this;
    that.xmListShow(that, that.data.offset, e.detail.value);
  },
  //搜索栏点击清除图标时触发
  searchTextonClear(e) {
    this.setData({
      searchText: '',
      offset: 1,
      listData: []
    })
    var that = this;
    that.xmListShow(that, that.data.offset, e.detail.value);
  },
  //xmListShow项目列表展示
  xmListShow: function(that, offset, xmName) {
    wx.showLoading({
      title: '加载中',
    })
    var data = {};
    data.token = app.globalData.token;
    data.offset = offset;
    data.limit = 10;
    data.p_name = xmName;
    app.ajax.req('company_api_controller/companyProjectList', data, 'GET', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        if (res.data.list.length > 0) {
          that.setData({
            listData: that.data.listData.concat(res.data.list),
            offset: offset + 1,
            total: res.data.total
          })
        }
      }
    })
  },
  // 操作按钮的显示与隐藏
  oprator_toggle: function(e) {
    this.setData({
      oprator_show: !this.data.oprator_show,
      oprator_index: e.currentTarget.dataset.index
    })
    let pid = e.currentTarget.dataset.pid;
    //取消项目的最新状态
    let data = {};
    data.token = app.globalData.token;
    data.pid = pid;
    app.ajax.req('message_api_controller/projectSaveList', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) === 200) {
        console.log('取消项目的最新状态');
      }
    })
  },
  //操作按钮处理
  opratorTap: function(e) {
    var that = this;
    var text = e.currentTarget.dataset.text;
    var pid = e.currentTarget.dataset.pid;
    if (text == "详情") {
      wx.navigateTo({
        url: 'tsYyXM_xiangq?pid=' + pid
      })

    } else if (text == "修改") {
      wx.navigateTo({
        url: 'tsYyXM_modify?pid=' + pid
      })
    } else if (text == "关闭") {
      wx.showModal({
        title: '项目关闭',
        content: '注意：您正在关闭这个项目，请谨慎操作，这个操作不可逆！',
        confirmText: "确定",
        cancelText: "返回",
        success: function(res) {
          console.log(res);
          if (res.confirm) {
            console.log('确定')
            var data = {};
            data.token = app.globalData.token;
            data.p_id = pid;
            app.ajax.req('company_api_controller/companyOff', data, 'GET', function(res) {
              if (parseInt(res.errorCode) === 200) {
                wx.showToast({
                  title: '关闭成功',
                  duration: 1000
                })
                setTimeout(function() {
                  this.onShow();
                }, 1500);
              }
            })
          } else {
            console.log('返回')
          }
        }
      });
    } else if (text == "推项目") {
      wx.showModal({
        title: '项目推送',
        content: '注意：您是否允许平台推送您的项目给平台上的其他包工侠或劳务？',
        confirmText: "确定",
        cancelText: "返回",
        success: function(res) {
          console.log(res);
          if (res.confirm) {
            wx.showLoading({
              title: '数据匹配中',
            })
            var data = {};
            data.token = app.globalData.token;
            data.p_id = pid;
            app.ajax.req('company_api_controller/companyPushProject', data, 'GET', function(res) {
              wx.hideLoading();
              if (parseInt(res.errorCode) === 200) {
                wx.showToast({
                  title: '推送成功,请关注推送预约劳务列表',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: res.errorDesc,
                  icon: 'none'
                })
              }
            })
          } else {
            console.log('返回')
          }
        }
      });
    } else if (text == "推劳务") {
      wx.showModal({
        title: '推送劳务给我',
        content: '注意：您是否允许平台主动推送优质的包工头或劳务给您？',
        confirmText: "确定",
        cancelText: "返回",
        success: function(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '数据匹配中',
            })
            var data = {};
            data.token = app.globalData.token;
            data.p_id = pid;
            app.ajax.req('company_api_controller/companyPushWorker', data, 'GET', function(res) {
              wx.hideLoading();
              if (parseInt(res.errorCode) === 200) {
                wx.showToast({
                  title: '推送成功,请关注推送预约劳务管理列表',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: res.errorDesc,
                  icon: 'none'
                })
              }
            })
          } else {
            console.log('返回')
          }
        }
      });
    }
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
    var that = this;
    that.setData({
      listData: [],
      offset: 1
    })
    that.xmListShow(that, that.data.offset, '');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // wx.closeSocket();
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
    this.onShow();
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 100);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    //改变分页
    if (that.data.offset > Math.ceil(that.data.total / 10)) {
      wx.showToast({
        title: '没有更多',
        icon: 'none'
      })
      return;
    }
    that.xmListShow(that, that.data.offset, that.data.searchText)

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})