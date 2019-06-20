var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lw_info: {},
    pics: [],
    pics1: [],
    time: '',
    bid: null,
    type_: null,
    workAddress: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      bid: options.bid
    })
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
          //可施工地解析
          let workAddress = app.getWorkAddr(res.data.workAddress);
          let str = '';
          for (let i = 0; i < workAddress.length; i++) {
            str = workAddress[i].name+' '
          }
          that.setData({
            workAddress: str
          })
          //查看项目合同
          // that.viewHetong(1);
          // that.viewHetong(2);
        }
      })


    }
  },
  viewHetong: function(type_) {
    var that = this;
    var data = {};
    that.setData({
      type_: type_
    })
    data.token = app.globalData.token;
    data.b_id = that.data.bid;
    if (type_ == 1) { //1为劳务公司的项目合同，2为劳务公司的劳务合同
      data.type = 7;
    } else if (type_ == 2) {
      data.type = 8;
    } else {
      data.type = null;
    }
    app.ajax.req('contract_api_controller/contractLook', data, 'GET', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        //项目合同
        if (that.data.type_ == 1) {
          that.setData({
            time: res.data.UpTime,
            pics: res.data.imgs
          })
        } else if (that.data.type_ == 2) {
          that.setData({
            time: res.data.UpTime,
            pics1: res.data.imgs
          })
        }
      }
    });
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