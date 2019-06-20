var app = getApp();
import download from "../../utils/download.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xmInfo: {
      //项目名称
      xm_name: '',
      //项目金额
      xm_money: 0,
      //所需人数
      xm_renshu: '',
      idcard: false,
      zhizhao: false,
      zhengxin: '',
      //发布时间
      xm_fabuTime: '',
      //项目区域
      xm_quyu: '',
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
      bsid: '',
      pid: ''
    }
  },
  yuyue: function () {
    var bs_id = this.data.xmInfo.bsid;
    var bs_identity = 1;
    var p_id = this.data.xmInfo.pid;
    app.yuyue(bs_id, bs_identity, p_id, 1);
  },
  //查看文件
  lookFiles1: function () {
    wx.navigateTo({
      url: '../xmXQ/lookFile'
    })
  },
  //下载文件
  fujiantap: function (e) {
    wx.showLoading({
      title: '下载中',
    })
    var zhi = e.currentTarget.dataset.zhi;
    download.downloadSaveFile({
      url: zhi,
      success: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '下载成功',
          icon: 'none'
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        })
      }
    })
  },
  idcard: function () {
    if (!this.data.xmInfo.idcard) {
      wx.showToast({
        title: '当前用户身份未认证',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '当前用户身份已认证',
        icon: 'none'
      })
    }
  },
  zhizhao: function () {
    if (!this.data.xmInfo.zhizhao) {
      wx.showToast({
        title: '当前用户未上传营业执照',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '当前用户已上传营业执照',
        icon: 'none'
      })
    }
  },
  zhengxin: function (e) {
    wx.showToast({
      title: '当前用户的江湖信用为：' + e.currentTarget.dataset.xyf,
      icon: 'none'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var pid = options.pid;
    var data = {};
    data.token = app.globalData.token;
    data.p_id = pid;
    app.ajax.req('company_api_controller/companyProjectInfo', data, 'GET', function (res) {
      //区域查询
      var quyu_code = res.data.p_region;
      var quyu = app.regionalParse(quyu_code);
      that.setData({
        xmInfo: {
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
          xm_fujian: res.data.p_files,
          //发包方id
          bsid: res.data.p_companyid,
          //项目id
          pid: res.data.p_id
        }
      })
      console.log("项目id" + res.data.p_id);
      wx.hideLoading();
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 100);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})