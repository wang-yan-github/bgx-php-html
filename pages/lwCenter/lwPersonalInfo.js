var tcity = require("../../utils/citys.js");
var util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    //是否已完善信息
    perfectStatus: 0,
    // 展开折叠
    selectedFlag: [true, false, false],
    //区域
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    //可施工地
    provinces2: [],
    province2: "",
    citys2: [],
    city2: "",
    value2: [0, 0],
    values2: [0, 0],
    condition2: false,
    canWorkAddr: [],
    canWorkAddr_data: [],
    isopen2: false,
    gz_feature: ['请选择', '大工', '小工'],
    gz_feature_index: 0,
    //身份证数据隐藏
    shenfenDisabled: true,
    //身份证数据禁用
    shenfenDisabled1: true,
    //姓名和手机号禁用
    nameDisabled: true,
    telDisabled: true,
    //业绩
    yejiDisabled: false,
    //头像
    fileList: [],
    accessKey: '',
    fileUrl: '',
    formData: {},
    imgInfoDisabled: true,
    //详细地址
    addr: '',
    //从业时间
    congye_time: '',
    //姓名
    name: '',
    //电话
    tel: '',
    //所属劳务公司
    lwCompany: '',
    //身份证
    idcard: '',
    birthday: '',
    age: '',
    sex: '',
    //学历
    educationBackground: ['请选择', '小学', '初中', '高中', '中专', '大专', '本科', '研究生', '博士'],
    education_index: 0,
    //最低薪水
    min_money: '',
    max_money: '',
    //工种类型
    gzClass: [],
    gzClass_index: 0,
    gongzhong: [],
    gongzhong_data: [],
    yaoqingCode: '',
    //资质证书
    fileList1: [],
    //审核信息
    shenheInfo: [],
    yeji_content: true,
    //业绩
    yejiName: '',
    yeji_startTime: '',
    yeji_endTime: '',
    yeji_addr: '',
    yeji_yezhuName: '',
    yeji_chengbaoName: '',
    //业绩图片
    fileList2: [],
    yeji_Info: '',
    yeji_Info_zishu: 0,
    yeji_content_show: [],
    //基本信息所有控件的禁用
    infoDisabled: false,
    //区域禁用
    isDisabled: false,
    isDisabled2: false,
    //自我介绍
    introduceMyself: '',
    zishu1: 0,
    shenheStatus: true
  },
  bindPickerChange_gz_feature: function(e) {
    this.setData({
      gz_feature_index: e.detail.value
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
  //删除工种
  gongzhong_close: function(e) {
    var that = this;
    if (that.data.infoDisabled == true) {
      wx.showToast({
        title: '控件已禁用',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var index = e.currentTarget.dataset.index;
    that.data.gongzhong.splice(index, 1);
    that.setData({
      gongzhong: that.data.gongzhong,
      gongzhong_data: that.data.gongzhong
    })
  },
  //劳务信息完善
  bgxInfoSubmit: function() {
    wx.showLoading();
    var that = this;
    var data = {};
    data.token = app.globalData.token;
    if (that.data.county.code == -1) {
      wx.showToast({
        title: '户籍所在地必选',
        icon: 'none'
      })
      return;
    }
    data.region = that.data.county.code;
    if (!that.data.addr) {
      wx.showToast({
        title: '户籍所在详址必填',
        icon: 'none'
      })
      return;
    }
    data.address = that.data.addr;
    data.dutyName = that.data.name;
    data.dutyPhone = that.data.tel;
    data.company = that.data.lwCompany ? that.data.lwCompany == '无' ? '' : that.data.lwCompany : '';
    if (!that.data.congye_time) {
      wx.showToast({
        title: '从业时间必填',
        icon: 'none'
      })
      return;
    }
    data.workTime = that.data.congye_time;
    if (!that.data.idcard) {
      wx.showToast({
        title: '身份证必填',
        icon: 'none'
      })
      return;
    }
    if (!that.data.age) {
      wx.showToast({
        title: '身份证有误',
        icon: 'none'
      })
      return;
    }
    data.idCard = that.data.idcard;
    data.age = that.data.age;
    data.sex = that.data.sex;
    data.birthday = that.data.birthday;
    if (that.data.educationBackground[that.data.education_index] == '请选择') {
      wx.showToast({
        title: '请选择学历',
        icon: 'none'
      })
      return;
    }
    data.education = that.data.educationBackground[that.data.education_index];
    data.minimum = that.data.min_money ? that.data.min_money == '面议' ? '' : that.data.min_money : '';
    data.maximum = that.data.max_money ? that.data.max_money == '面议' ? '' : that.data.max_money : '';
    //工种特征处理
    if (parseInt(that.data.gz_feature_index) == 0) {
      data.consFeature = '';
    } else {
      data.consFeature = that.data.gz_feature[that.data.gz_feature_index];
    }

    //个人头像
    data.headPortrait = (that.data.fileList.length > 0) ? that.data.fileList[0].uid : '';
    //资质证书
    let zizhiData = [];
    if (that.data.fileList1.length > 0) {
      for (let i = 0; i < that.data.fileList1.length; i++) {
        zizhiData.push(that.data.fileList1[i].uid)
      }
    }
    data.certificate = zizhiData.join(',') ? zizhiData.join(',') : '';
    if (that.data.canWorkAddr.length == 0) {
      wx.showToast({
        title: '请选择可施工地',
        icon: 'none'
      })
      return;
    }
    var canWorkAddr = [];
    for (let i = 0; i < that.data.canWorkAddr.length; i++) {
      canWorkAddr.push(that.data.canWorkAddr[i].code);
    }
    data.workAddress = canWorkAddr.join(',');
    if (that.data.gongzhong.length == 0) {
      wx.showToast({
        title: '请选择工种类型',
        icon: 'none'
      })
      return;
    }
    data.consType = that.data.gongzhong.join(',');
    data.iCode = that.data.yaoqingCode ? that.data.yaoqingCode == '无' ? '' : that.data.yaoqingCode : '';
    if (!that.data.introduceMyself) {
      wx.showToast({
        title: '请填写自我介绍信息',
        icon: 'none'
      })
      return;
    }
    data.introduction = that.data.introduceMyself;
    app.ajax.req('workerproject_api_controller/bgxpeopleinfoadd', data, 'GET', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '提交成功',
          duration: 1000
        })
        setTimeout(function() {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }, 1500);
        //锁定所有元素
        that.setData({
          infoDisabled: true,
          isDisabled: false,
          isDisabled2: false,
          perfectStatus: 1,
          //隐藏基本信息，展示审核信息
          selectedFlag: [false, false, true],
          imgInfoDisabled: false
        })
        //查询审核信息
        that.getShenheInfo();
      }
    })
  },
  //获取身份证信息
  idcard: function(e) {
    var that = this;
    that.setData({
      idcard: e.detail.value
    })
    if (util.trim(e.detail.value).length == 0) {
      return false;
    }
    wx.showLoading({
      title: '加载身份信息',
    })
    var data = {};
    data.idCard = e.detail.value;
    app.ajax.req('public_api_controller/isIdCard', data, 'GET', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        that.setData({
          birthday: res.data.ymd,
          age: res.data.age,
          sex: res.data.sex,
          cardAddress: res.data.province,
          shenfenDisabled: false
        })
      } else {
        that.setData({
          birthday: '',
          age: '',
          sex: '',
          cardAddress: '',
          shenfenDisabled: true
        })
      }
    })
  },
  //业绩数据绑定
  yejiName: function(e) {
    this.setData({
      yejiName: e.detail.value
    })
  },
  yeji_startTime: function(e) {
    this.setData({
      yeji_startTime: e.detail.value
    })
  },
  yeji_endTime: function(e) {
    this.setData({
      yeji_endTime: e.detail.value
    })
  },
  yeji_addr: function(e) {
    this.setData({
      yeji_addr: e.detail.value
    })
  },
  yeji_yezhuName: function(e) {
    this.setData({
      yeji_yezhuName: e.detail.value
    })
  },
  yeji_chengbaoName: function(e) {
    this.setData({
      yeji_chengbaoName: e.detail.value
    })
  },
  yeji_Info: function(e) {
    if (e.detail.value.length <= 200) {
      this.setData({
        yeji_Info: e.detail.value,
        yeji_Info_zishu: e.detail.value.length
      })
    } else {
      wx.showToast({
        title: '字数限制为200字',
        icon: 'none'
      })
    }
  },
  add_yeji: function() {
    this.setData({
      yeji_content: !this.data.yeji_content
    })
  },
  //添加业绩
  submit_yeji: function() {
    var that = this;
    var data = {};
    data.token = app.globalData.token;
    if (!that.data.yejiName) {
      wx.showToast({
        title: '请输入项目名称',
        icon: 'none'
      })
      return;
    }
    data.name = that.data.yejiName;
    if (!that.data.yeji_startTime) {
      wx.showToast({
        title: '请选择项目开始时间',
        icon: 'none'
      })
      return;
    }
    data.startTime = that.data.yeji_startTime;
    if (!that.data.yeji_endTime) {
      wx.showToast({
        title: '请选择项目结束时间',
        icon: 'none'
      })
      return;
    }
    data.endTime = that.data.yeji_endTime;
    var startTime = Date.parse(new Date(that.data.yeji_startTime));
    var endTime = Date.parse(new Date(that.data.yeji_endTime));
    var currentTime = new Date();
    if (startTime >= currentTime) {
      wx.showToast({
        title: '开始时间不能大于当前时间',
        icon: 'none'
      })
      return;
    }
    if (endTime >= currentTime) {
      wx.showToast({
        title: '结束时间不能大于当前时间',
        icon: 'none'
      })
      return;
    }
    if (startTime > endTime) {
      wx.showToast({
        title: '开始时间比结束时间大',
        icon: 'none'
      })
      return;
    }
    data.endTime = that.data.yeji_endTime;
    if (!that.data.yeji_addr) {
      wx.showToast({
        title: '请输入施工地址',
        icon: 'none'
      })
      return;
    }
    data.address = that.data.yeji_addr;
    data.pOwnerCom = that.data.yeji_yezhuName ? that.data.yeji_yezhuName : '';
    data.pContractCom = that.data.yeji_chengbaoName ? that.data.yeji_chengbaoName : '';
    if (!that.data.yeji_Info) {
      wx.showToast({
        title: '请输入施工内容',
        icon: 'none'
      })
      return;
    }
    data.content = that.data.yeji_Info;
    data.type = 14;
    //业绩工作图片处理
    var yejiData = [];
    if (that.data.fileList2.length > 0) {
      for (let i = 0; i < that.data.fileList2.length; i++) {
        yejiData.push(that.data.fileList2[i].uid);
      }
    }
    data.pFiles = yejiData.join(',') ? yejiData.join(',') : '';
    app.ajax.req('achieve_api_controller/achieveAdd', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '添加业绩成功，请注意审核信息',
          icon: 'none'
        })
        that.lookYeji();
        //数据重置
        that.setData({
          yejiName: '',
          yeji_startTime: '',
          yeji_endTime: '',
          yeji_addr: '',
          yeji_yezhuName: '',
          yeji_chengbaoName: '',
          yeji_files: [],
          yeji_files1: [],
          yeji_Info: '',
          yeji_Info_zishu: 0
        })
      }
    })
  },
  //查询业绩
  lookYeji: function() {
    var that = this;
    //查询业绩信息
    var data = {};
    data.token = app.globalData.token;
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
  //编辑业绩
  editYeji: function(e) {

  },
  //删除业绩
  deleteYeji: function(e) {
    var that = this;
    if (that.data.yejiDisabled) {
      wx.showToast({
        title: '当前控件已禁用',
        icon: 'none'
      })
      return false;
    }
    wx.showModal({
      title: '业绩删除',
      content: '这个操作不可逆，请谨慎操作',
      confirmText: "删除",
      cancelText: "返回",
      success: function(res) {
        console.log(res);
        if (res.confirm) {
          var id = e.currentTarget.dataset.id;
          var data = {};
          data.token = app.globalData.token;
          data.id = id;
          app.ajax.req('achieve_api_controller/achieveRemove', data, 'GET', function(res) {
            if (parseInt(res.errorCode) === 200) {
              wx.showToast({
                title: '删除成功',
              })
              that.lookYeji();
            }
          })

        } else {
          // console.log('用户点击辅助操作')
        }
      }
    });
  },
  //学历
  bindPickerChange0: function(e) {
    this.setData({
      education_index: e.detail.value
    })
  },
  introduceMyself: function(e) {
    this.setData({
      introduceMyself: e.detail.value,
      zishu1: e.detail.value.length
    })
  },
  min_money: function(e) {
    this.setData({
      min_money: e.detail.value
    })
  },
  max_money: function(e) {
    this.setData({
      max_money: e.detail.value
    })
  },
  //删除可施工地
  canWorkAddr_close: function(e) {
    var that = this;
    if (that.data.infoDisabled == true) {
      wx.showToast({
        title: '控件已禁用',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var index = e.currentTarget.dataset.index;
    that.data.canWorkAddr.splice(index, 1);
    that.setData({
      canWorkAddr: that.data.canWorkAddr,
      canWorkAddr_data: that.data.canWorkAddr
    })
  },
  //户籍详细地址
  addr: function(e) {
    this.setData({
      addr: e.detail.value
    })
  },
  congye_time: function(e) {
    this.setData({
      congye_time: e.detail.value
    })
  },
  name: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  tel: function(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  lwCompany: function(e) {
    this.setData({
      lwCompany: e.detail.value
    })
  },
  shenhe_edit: function(e) {
    var type = e.currentTarget.dataset.type;
    if (type == '基本信息') {
      wx.showToast({
        title: '现在可以修改基本信息了',
        icon: 'none'
      })
      this.setData({
        infoDisabled: false,
        isDisabled: false,
        isDisabled2: false,
        selectedFlag: [true, false, false],
        imgInfoDisabled: true,
        isopen2: false,
      })
    } else {
      wx.showToast({
        title: '现在可以修改业绩了',
        icon: 'none',
        duration: 3000
      })
      this.setData({
        yejiDisabled: false,
        selectedFlag: [false, true, false]
      })
    }
  },
  yaoqingCode: function(e) {
    this.setData({
      yaoqingCode: e.detail.value
    })
  },
  //单选按钮
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },
  //省市区
  bindChange: function(e) {
    var that = this;
    app.getSsqMore(that, e);
  },
  //省市
  bindChange2: function(e) {
    var that = this;
    app.getSsMore(that, e);
  },
  open: function() {
    if (this.data.isDisabled) {
      return;
    }
    this.setData({
      condition: !this.data.condition
    })
  },
  open2: function() {
    if (this.data.isDisabled2) {
      return;
    }
    this.setData({
      condition2: !this.data.condition2
    })
  },
  //选择可施工地
  open3: function() {
    var that = this;
    app.getCanWorkAddr(that)
  },
  // 展开折叠选择  
  changeToggle: function(e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.selectedFlag[index]) {
      this.data.selectedFlag[index] = false;
    } else {
      this.data.selectedFlag[index] = true;
    }
    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  },
  //上传劳务头像
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
      let that = this;
      app.getQianming(that, 'lw');
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
  //上传资质证书
  onComplete1(e) {
    console.log('onComplete1', e);
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
        fileList1: this.data.fileList1.concat(data)
      })
      let that = this;
      app.getQianming(that, 'lw');
    }
    wx.hideLoading();
  },
  onRemove1(e) {
    console.log('onRemove1', e)
    var that = this;
    const {
      file,
      fileList
    } = e.detail
    that.setData({
      fileList1: fileList.filter((n) => n.uid !== file.uid)
    })
  },
  //上传业绩
  onComplete2(e) {
    console.log('onComplete2', e);
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
        fileList2: this.data.fileList2.concat(data)
      })
      let that = this;
      app.getQianming(that, 'lw');
    }
    wx.hideLoading();
  },
  onRemove2(e) {
    console.log('onRemove1', e)
    var that = this;
    const {
      file,
      fileList
    } = e.detail
    that.setData({
      fileList2: fileList.filter((n) => n.uid !== file.uid)
    })
  },
  //审核信息
  getShenheInfo: function() {
    var that = this;
    if (!that.data.shenheStatus) {
      return;
    }
    app.getShenheInfo(that, 3);
  },
  onLoad: function(options) {
    var that = this;
    app.getQianming(that, 'lw');
    //给电话和姓名赋值
    that.setData({
      tel: wx.getStorageSync('tel'),
      name: wx.getStorageSync('username'),
      perfectStatus: app.globalData.perfectStatus,
      //审核状态
      shenheStatus: true,
      gzClass: app.globalData.gzData
    })
    //初始化省市区
    app.initSsq(that);
    //初始化省市
    app.initSs(that);
    //如果已完善信息,要查询数据并赋值
    if (that.data.perfectStatus == 1) {
      // 锁定所有元素
      that.setData({
        infoDisabled: true,
        isDisabled: true,
        isDisabled2: true,
        perfectStatus: 1,
        //隐藏基本信息，展示审核信息
        selectedFlag: [false, false, true],
        imgInfoDisabled: false,
        isopen2: true,
        //业绩
        yejiDisabled: true,
      })
      wx.showLoading({
        title: '加载中',
      })
      var data = {};
      data.token = app.globalData.token;
      app.ajax.req('workerproject_api_controller/bgxworkerinfo', data, 'GET', function(res) {
        if (parseInt(res.errorCode) === 200) {
          //头像
          if (res.data.headPortrait) {
            that.setData({
              fileList: [{
                uid: res.data.headPortrait,
                status: 'done',
                url: res.data.headPortrait + '?x-oss-process=style/thumb',
                originalUrl: res.data.headPortrait + '?x-oss-process=style/original'
              }]
            })
          }
          //资质证书
          if (res.data.certificates) {
            var array = res.data.certificates;
            var zizhiData = [];
            for (let i = 0; i < array.length; i++) {
              zizhiData.push({
                uid: array[i].certificate,
                status: 'done',
                url: array[i].certificate + '?x-oss-process=style/thumb',
                originalUrl: array[i].certificate + '?x-oss-process=style/original'
              })
            }
            that.setData({
              fileList1: zizhiData
            })
          }
          //学历处理
          for (let i = 0; i < that.data.educationBackground.length; i++) {
            if (that.data.educationBackground[i] == res.data.education) {
              that.setData({
                education_index: i
              })
            }
          }
          //工种特征处理
          for (let i = 0; i < that.data.gz_feature.length; i++) {
            if (that.data.gz_feature[that.data.gz_feature_index] == res.data.consFeature) {
              that.setData({
                gz_feature_index: i
              })
            }
          }
          //可施工地匹配
          var canWorkAddr = app.getWorkAddr(res.data.work_address);
          //区域查询
          var quyuData = app.regionalParse(res.data.region);
          that.setData({
            province: quyuData.province,
            city: quyuData.city,
            county: quyuData.county ? quyuData.county : '',
            addr: res.data.address,
            name: res.data.dutyName,
            tel: res.data.dutyPhone,
            lwCompany: res.data.company ? res.data.company : '无',
            congye_time: res.data.work_time,
            min_money: res.data.minimum ? res.data.minimum : '面议',
            max_money: res.data.maximum ? res.data.maximum : '面议',
            idcard: res.data.idCard,
            age: res.data.age,
            sex: res.data.sex,
            birthday: res.data.birthday,
            yaoqingCode: res.data.iCode ? res.data.iCode : '无',
            canWorkAddr: canWorkAddr,
            canWorkAddr_data: canWorkAddr,
            gongzhong: res.data.consType.split(','),
            introduceMyself: res.data.introduction,
            zishu1: res.data.introduction ? res.data.introduction.length : 0
          })
          //查看业绩
          that.lookYeji();
          //数据重置
          that.setData({
            yejiName: '',
            yeji_startTime: '',
            yeji_endTime: '',
            yeji_addr: '',
            yeji_yezhuName: '',
            yeji_chengbaoName: '',
            fileList2: [],
            yeji_Info: '',
            yeji_Info_zishu: 0
          })
          //查询审核信息
          that.getShenheInfo();
          wx.hideLoading();
        } else {
          wx.hideLoading();
        }
      })
    }

  },
  onUnload: function() {
    this.setData({
      //审核状态
      shenheStatus: false
    })
  }
})