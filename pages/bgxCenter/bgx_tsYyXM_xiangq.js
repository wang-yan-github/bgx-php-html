var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //项目名称
    xm_name: '',
    //项目金额
    xm_money: 0,
    //所需人数
    xm_renshu: '',
    idcard: true,
    zhizhao: true,
    zhengxin: '3A',
    //发布时间
    xm_fabuTime: '',
    //项目地址
    xm_addr: '',
    //开始时间
    xm_startTime: '',
    //结束时间
    xm_endTime: '',
    //工程类型
    xm_gcclass: '',
    //工种类型
    xm_gzclass: '',
    //业主名称
    xm_yezhuName: '',
    //承包商名称
    xm_chengbaoName: '',
    //项目备案号
    xm_beianhao: '',
    //项目详情
    xm_info: '',
    //项目附件
    xm_fujian: [],
    province: '',
    city: '',
    county: '',
  },
  fujiantap: function(e) {
    var url = e.detail.value;
    wx.downloadFile({
      url: url, //仅为示例，并非真实的资源
      success: function(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx: wx.showToast({
            title: '下载成功',
            duration: 10000
          })
        }
      }
    })
  },
  idcard: function() {
    if (!idcard) {
      wx: wx.showToast({
        title: '当前用户身份未认证',
        icon: 'none'
      })
    }
    else {
      wx: wx.showToast({
        title: '当前用户身份已认证',
        icon: 'none'
      })
    }
  },
  zhizhao: function() {
    if (!zhizhao) {
      wx: wx.showToast({
        title: '未上传营业执照',
        icon: 'none'
      })
    }
    else {
      wx: wx.showToast({
        title: '已上传营业执照',
        icon: 'none'
      })
    }
  },
  zhengxin: function() {
    wx: wx.showToast({
      title: '当前用户征信评级为3A',
      icon: 'none',
      duration: 2000,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var pid = options.pid;
    var data = {};
    data.token = app.globalData.token;
    data.p_id = pid;
    app.ajax.req('company_api_controller/companyProjectInfo', data, 'GET', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        //区域查询
        var quyu_code = res.data.p_region;
        var quyu = app.regionalParse(quyu_code);
        that.setData({
          province: quyu.province,
          city: quyu.city,
          county: quyu.county,
          xm_name: res.data.p_name,
          xm_money: res.data.p_column_price,
          xm_renshu: res.data.p_num,
          idcard: res.data.idCard,
          zhizhao: res.data.bizlicense,
          zhengxin: res.data.creditScore,
          xm_fabuTime: res.data.add_time,
          xm_addr: res.data.p_addr,
          xm_startTime: res.data.start_time,
          xm_endTime: res.data.end_time,
          xm_gcclass: res.data.p_technical_type,
          xm_gzclass: res.data.p_cons_type,
          xm_yezhuName: res.data.p_ownerCom,
          xm_chengbaoName: res.data.p_contract_com,
          xm_beianhao: res.data.record_number,
          xm_info: res.data.p_remark,
          xm_fujian: res.data.p_files
        })
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