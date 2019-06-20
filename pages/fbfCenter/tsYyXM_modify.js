// pages/fbfCenter/fabuXM.js
var tcity = require("../../utils/citys.js");
var util = require("../../utils/util.js");
var prom = require("../../utils/prom.js")
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pid: null,
    //项目名称的字数
    zishu: 0,
    zishu1: 0,
    //工程类型
    gcClass: [],
    gcClass_index: 0,
    //工种类型
    gzClass: [],
    gzClass_index: 0,
    gongzhong: [],
    gongzhong_data: [],
    xm_startTime: '',
    xm_endTime: '',
    xm_yusuan: '',
    xm_yezhuName: '',
    xm_chengbaoName: '',
    xm_addr: '',
    xm_beianhao: '',
    xm_number: '',
    xm_info: '',
    //省 市 区
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    //附件
    fileList: [],
    accessKey: '',
    fileUrl: '',
    formData: {},
  },
  //图片上传
  onChange(e) {
    console.log('onChange', e);
    const {
      file
    } = e.detail
    if (file.status === 'uploading') {
      this.setData({
        progress: 0
      })
      wx.showLoading();
    } else if (file.status === 'done') {
      this.setData({
        imageUrl: file.url
      })
    }
  },
  onSuccess(e) {
    console.log('onSuccess', e);
  },
  onFail(e) {
    console.log('onFail', e);
    wx.showToast({
      title: '上传失败',
    })
  },
  onComplete(e, index) {
    console.log('onComplete', e);
    if (parseInt(e.detail.statusCode) !== 200) {
      wx.showToast({
        title: '上传失败',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '上传完成',
        icon: 'none'
      })
      var data = {};
      data.uid = app.globalData.uploadUrl + '' + this.data.formData.key;
      data.status = 'done';
      data.url = app.globalData.uploadUrl + '' + this.data.formData.key + '?x-oss-process=style/thumb';
      data.originalUrl = app.globalData.uploadUrl + '' + this.data.formData.key + '?x-oss-process=style/original';
      this.setData({
        fileList: this.data.fileList.concat(data)
      })
      var that = this;
      app.getQianming(that, 'fbf');
    }
    wx.hideLoading();
  },
  onPreview(e) {
    console.log('onPreview', e)
    const {
      file,
      fileList
    } = e.detail
    wx.previewImage({
      current: file.uid,
      urls: fileList.map((n) => n.uid),
    })
  },
  onRemove(e) {
    console.log('onRemove', e)
    var that = this;
    const {
      file,
      fileList
    } = e.detail
    that.setData({
      fileList: fileList.filter((n) => n.uid !== file.uid)
    })
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      xm_startTime: e.detail.value
    })
  },
  bindDateChange1: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      xm_endTime: e.detail.value
    })
  },
  //新建或修改项目
  fabu: function() {
    var data = {};
    //非空验证
    data.token = app.globalData.token;
    if (!this.data.xmName) {
      wx.showToast({
        title: '请输入项目名称',
        icon: 'none'
      })
      return;
    }
    data.pName = this.data.xmName;
    if (this.data.gcClass_index == 0) {
      wx.showToast({
        title: '请选择工程类别',
        icon: 'none'
      })
      return;
    }
    data.technicalType = this.data.gcClass[this.data.gcClass_index];
    data.consType = this.data.gongzhong.join(",") ? this.data.gongzhong.join(",") : '';
    if (!this.data.xm_startTime) {
      wx.showToast({
        title: '请选择开始时间',
        icon: 'none'
      })
      return;
    }
    data.startTime = this.data.xm_startTime;
    if (!this.data.xm_endTime) {
      wx.showToast({
        title: '请选择竣工时间',
        icon: 'none'
      })
      return;
    }
    data.endTime = this.data.xm_endTime;
    var startTime = Date.parse(new Date(this.data.xm_startTime));
    var endTime = Date.parse(new Date(this.data.xm_endTime));
    if (startTime > endTime) {
      wx.showToast({
        title: '项目的开始时间比竣工时间大',
        icon: 'none'
      })
      return;
    }
    if (this.data.county.code == -1) {
      wx.showToast({
        title: '区域必填',
        icon: 'none'
      })
      return;
    }
    data.region = this.data.county.code;
    if (!this.data.xm_addr) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return;
    }
    data.pAddress = this.data.xm_addr;
    data.pColumnPrice = this.data.xm_yusuan ? this.data.xm_yusuan : '';
    data.pOwnerCom = this.data.xm_yezhuName ? this.data.xm_yezhuName : '';
    data.pContractCom = this.data.xm_chengbaoName ? this.data.xm_chengbaoName : '';
    data.recordNumber = this.data.xm_beianhao ? this.data.xm_beianhao : '';
    data.pNum = this.data.xm_number ? this.data.xm_number : 0;
    if (!this.data.xm_info) {
      wx.showToast({
        title: '请输入项目详情',
        icon: 'none'
      })
      return;
    }
    data.pRemark = this.data.xm_info;
    //处理项目附件
    let fujian_data = [];
    if (this.data.fileList.length > 0) {
      for (let i = 0; i < this.data.fileList.length; i++) {
        fujian_data.push(this.data.fileList[i].uid);
      }
    }
    data.pFiles = fujian_data.join(",") ? fujian_data.join(",") : '';
    data.pId = this.data.pid;
    wx.showLoading({
      title: '上传中',
    })
    app.ajax.req('company_api_controller/companyProjectAdd', data, 'GET', function(res) {
      wx.hideLoading();
      if (res.errorCode == 200) {
        wx.showToast({
          title: '修改成功'
        })
        //跳转到项目管理页面
        setTimeout(function() {
          wx.redirectTo({
            url: 'tsYyXM',
          })
        }, 1500);
      }
    })
  },
  //删除工种
  gongzhong_close: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.data.gongzhong.splice(index, 1);
    that.setData({
      gongzhong: that.data.gongzhong,
      gongzhong_data: that.data.gongzhong
    })
  },
  //项目名称绑定
  xmName: function(e) {
    var that = this;
    if (e.detail.value.length <= 15) {
      that.setData({
        zishu: e.detail.value.length,
        xmName: e.detail.value
      })
    } else {
      wx.showToast({
        title: '字数限制为15个字符！',
        icon: 'none'
      })
      var data = e.detail.value.slice(0, 15);
      console.log(data);
      that.setData({
        xmName: data
      })
    }
  },
  //开始时间绑定
  xm_startTime: function(e) {
    var that = this;
    that.setData({
      xm_startTime: e.detail.value
    })
  },
  //竣工时间绑定
  xm_endTime: function(e) {
    var that = this;
    that.setData({
      xm_endTime: e.detail.value
    })
  },
  //项目预算
  xm_yusuan: function(e) {
    var that = this;
    that.setData({
      xm_yusuan: e.detail.value
    })
  },
  //项目业主方
  xm_yezhuName: function(e) {
    var that = this;
    that.setData({
      xm_yezhuName: e.detail.value
    })
  },
  //项目承包方
  xm_chengbaoName: function(e) {
    var that = this;
    that.setData({
      xm_chengbaoName: e.detail.value
    })
  },
  //项目详细地址
  xm_addr: function(e) {
    var that = this;
    that.setData({
      xm_addr: e.detail.value
    })
  },
  //项目备案号
  xm_beianhao: function(e) {
    var that = this;
    that.setData({
      xm_beianhao: e.detail.value
    })
  },
  //项目备案号
  xm_number: function(e) {
    var that = this;
    that.setData({
      xm_number: e.detail.value
    })
  },
  //项目详情
  xm_info: function(e) {
    var that = this;
    if (e.detail.value.length <= 200) {
      that.setData({
        xm_info: e.detail.value,
        zishu1: e.detail.value.length
      })
    } else {
      wx: wx.showToast({
        title: '字数限制为200个',
        icon: 'none'
      })
    }
  },
  //工程类别
  bindPickerChange: function(e) {
    this.setData({
      gcClass_index: e.detail.value
    })
  },
  //工种类别
  bindPickerChange1: function(e) {
    //记录下标
    this.setData({
      gzClass_index: e.detail.value
    })
    if (this.data.gongzhong_data.length < 3) {
      if (this.data.gzClass[e.detail.value] == '请选择') {
        wx.showToast({
          title: '请选择有效值',
          icon: 'none'
        })
        return;
      }
      if (this.data.gongzhong_data.indexOf(this.data.gzClass[e.detail.value]) == -1) {
        this.data.gongzhong_data.push(this.data.gzClass[e.detail.value]);
        this.setData({
          gongzhong: this.data.gongzhong_data
        })
      } else {
        wx.showToast({
          title: '不要重复选择',
          icon: 'none'
        })
      }

    } else {
      wx.showToast({
        title: '工种限定为三个！',
        icon: 'none'
      })
    }

  },
  //省市区
  bindChange: function(e) {
    var that = this;
    app.getSsqMore(that, e);
  },
  open: function() {
    this.setData({
      condition: !this.data.condition
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getXmInfo: function(that) {
    var data = {};
    data.token = app.globalData.token;
    data.p_id = that.data.pid;
    app.ajax.req('company_api_controller/companyProjectInfo', data, 'GET', function(res) {
      wx.hideLoading();
      var zishu = res.data.p_name.length;
      var zishu1 = res.data.p_remark.length;
      //处理工程类型
      var xm_gcclass = res.data.p_technical_type;
      for (var i = 0; i < that.data.gcClass.length; i++) {
        if (that.data.gcClass[i] == xm_gcclass) {
          that.setData({
            gcClass_index: i
          })
        }
      }
      //处理工种类型
      var xm_gzclass = res.data.p_cons_type;
      if (xm_gzclass == "" || xm_gzclass == null) {
        var array = [];
      } else {
        var array = xm_gzclass.split(',');
      }

      console.log('文件' + res.data.p_files);
      //处理附件
      var fujianArr = [];
      for (var i = 0; i < res.data.p_files.length; i++) {
        var data = {};
        data.uid = res.data.p_files[i].p_file;
        data.url = res.data.p_files[i].p_file;
        data.status = 'done';
        fujianArr.push(data)
      }
      that.setData({
        fileList: fujianArr
      })

      //区域查询
      var quyu = app.regionalParse(res.data.p_region);
      that.setData({
        province: quyu.province,
        city: quyu.city,
        county: quyu.county,
        gongzhong: array,
        gongzhong_data: array,
        xmName: res.data.p_name,
        xm_yusuan: res.data.p_column_price,
        xm_number: res.data.p_num ? res.data.p_num : '',
        xm_fabuTime: res.data.add_time,
        xm_addr: res.data.p_addr,
        xm_startTime: res.data.start_time,
        xm_endTime: res.data.end_time,
        xm_yezhuName: res.data.p_ownerCom,
        xm_chengbaoName: res.data.p_contract_com,
        xm_beianhao: res.data.record_number,
        xm_info: res.data.p_remark,
        zishu: zishu,
        zishu1: zishu1
      })
    })
  },
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    app.getQianming(that, 'fbf');
    that.setData({
      fileUrl: app.globalData.url + 'upload_api_controller/pUpload',
      gcClass: app.globalData.gcData,
      gzClass: app.globalData.gzData,
      pid: options.pid
    })
    //初始化省市区
    app.initSsq(that);
    that.getXmInfo(that);
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
    this.onLoad();
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