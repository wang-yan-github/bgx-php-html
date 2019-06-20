var tcity = require("../../utils/citys.js");
var util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    //完善信息或基本信息
    title: '',
    //完善状态
    perfectStatus: null,
    //区域
    isDisabled: false,
    // 展开折叠
    selectedFlag: [true, false],
    tabs: ['企业身份', '个人身份'],
    //tab索引
    activeIndex: 0,
    //citys
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    //上传证件
    radioItems: [{
        name: '企业四证',
        value: '0',
        checked: true
      },
      {
        name: '三证合一',
        value: '1'
      }
    ],
    //上传图片
    fileList: [],
    fileList1: [],
    fileList2: [],
    fileList3: [],
    fileList4: [],
    //保存图片的key
    accessKey: '',
    fileUrl: '',
    //保存到本地服务器用的token
    token: '',
    formData: {},
    //图片上删除图标的显示隐藏
    imgInfoDisabled: true,
    //企业
    qyname: '',
    qyaddr: '',
    qyfaren: '',
    name: '',
    tel: '',
    idcard: '',
    yaoqingCode: '',
    zuoji: null,
    //审核信息
    shenheInfo: [],
    shenheStatus: true,
    nameDisabled: true,
    telDisabled: true,
    //所有控件的显示和隐藏
    allDisabled: false,
    //身份证数据
    shenfenDisabled: true,
    shenfenDisabled1: true,
    birthday: '',
    age: '',
    sex: '',
    cardAddress: ''
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
      fileList,
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
  //上传营业执照
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
      var that = this;
      app.getQianming(that, 'fbf');
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
  //上传组织机构代码
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
      var that = this;
      app.getQianming(that, 'fbf');
    }
    wx.hideLoading();
  },
  onRemove2(e) {
    console.log('onRemove2', e)
    var that = this;
    const {
      file,
      fileList
    } = e.detail
    that.setData({
      fileList2: fileList.filter((n) => n.uid !== file.uid)
    })
  },
  //上传税务登记证
  onComplete3(e) {
    console.log('onComplete3', e);
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
        fileList3: this.data.fileList3.concat(data)
      })
      var that = this;
      app.getQianming(that, 'fbf');
    }
    wx.hideLoading();
  },
  //上传开户许可证
  onComplete4(e) {
    console.log('onComplete4', e);
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
        fileList4: this.data.fileList4.concat(data)
      })
      var that = this;
      app.getQianming(that, 'fbf');
    }
    wx.hideLoading();
  },
  onRemove4(e) {
    console.log('onRemove4', e)
    var that = this;
    const {
      file,
      fileList
    } = e.detail
    that.setData({
      fileList4: fileList.filter((n) => n.uid !== file.uid)
    })
  },
  //企业的数据绑定
  zuoji: function(e) {
    this.setData({
      zuoji: e.detail.value
    })
  },
  zuoji1: function() {
    var that = this;
    if (that.data.zuoji || that.data.zuoji.length == 0) {
      return;
    }
    //正则验证
    var isPhone = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    if (!isPhone.test(that.data.zuoji)) {
      wx.showToast({
        title: '座机号格式有误',
        icon: 'none'
      })
      that.setData({
        zuoji: ''
      })
      return;
    }
  },
  yaoqingCode: function(e) {
    this.setData({
      yaoqingCode: e.detail.value
    })
  },
  qyname: function(e) {
    this.setData({
      qyname: e.detail.value
    })
  },
  qyaddr: function(e) {
    this.setData({
      qyaddr: e.detail.value
    })
  },
  qyfaren: function(e) {
    this.setData({
      qyfaren: e.detail.value
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
  idcard: function(e) {
    var that = this;
    that.setData({
      idcard: e.detail.value
    })
    if (util.trim(e.detail.value).length == 0) {
      return;
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
        wx.showToast({
          title: res.errorDesc,
          icon: 'none'
        })
      }
    })
  },
  shenhe_edit: function(e) {
    wx.showToast({
      title: '现在可以修改基本信息了',
      icon: 'none'
    })
    this.setData({
      selectedFlag: [true, false],
      isDisabled: false,
      allDisabled: false,
      imgInfoDisabled: true
    })
  },
  qysubmit: function() {
    var data = {};
    data.token = app.globalData.token;
    //区域
    if (this.data.county.code == -1) {
      wx.showToast({
        title: '请选择区域',
        icon: 'none'
      })
      return;
    }
    data.region = this.data.county.code;
    if (!this.data.qyaddr) {
      wx.showToast({
        title: '详细地址不为空',
        icon: 'none'
      })
      return;
    }
    data.address = this.data.qyaddr;
    if (!this.data.idcard) {
      wx.showToast({
        title: '联系人身份证号不为空',
        icon: 'none'
      })
      return;
    }
    if (!this.data.age) {
      wx.showToast({
        title: '联系人身份证号不正确',
        icon: 'none'
      })
      return;
    }
    data.idCard = this.data.idcard;
    data.dutyName = this.data.name;
    data.age = this.data.age;
    data.sex = this.data.sex;
    data.birthday = this.data.birthday;
    data.cardAddress = this.data.cardAddress;
    data.dutyPhone = app.globalData.tel;
    //头像
    data.headPortrait = this.data.fileList.length > 0 ? this.data.fileList[0].uid : '';
    //邀请码
    data.iCode = this.data.yaoqingCode ? this.data.yaoqingCode : '';
    //个人还是企业
    if (this.data.activeIndex == 1) {
      data.companyType = 1; //个人
    } else {
      data.companyType = 2;
      if (!this.data.qyname) {
        wx.showToast({
          title: '企业名称不能为空',
          icon: 'none'
        })
        return false;
      }
      data.name = this.data.qyname;
      if (!this.data.qyfaren) {
        wx.showToast({
          title: '企业法人不能为空',
          icon: 'none'
        })
        return;
      }
      data.tdutyName = this.data.qyfaren;
      data.tel = this.data.zuoji ? this.data.zuoji : '';
      if (this.data.fileList1.length == 0) {
        wx.showToast({
          title: '营业执照不为空',
          icon: 'none'
        })
        return;
      }
      data.bizlicense = this.data.fileList1[0].uid;
      for (let i = 0; i < this.data.radioItems.length; i++) {
        if (this.data.radioItems[0].checked == true) { //企业四证
          if (this.data.fileList2.length == 0) {
            wx.showToast({
              title: '组织机构代码证必填',
              icon: 'none'
            })
            return;
          }
          //组织机构代码证
          data.orgcode = this.data.fileList2[0].uid;
          //税务登记证
          if (this.data.fileList3.length == 0) {
            wx.showToast({
              title: '税务登记证必填',
              icon: 'none'
            })
            return;
          }
          data.registration = this.data.fileList3[0].uid;
        }
      }
      data.openingPermit = (this.data.fileList4.length > 0) ? this.data.fileList4[0].uid : '';
    }
    var that = this;
    wx.showLoading({
      title: '上传中',
    })
    app.ajax.req('company_api_controller/bgxcompanyinfoadd', data, 'GET', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '提交成功,注意看审核信息',
          icon: 'none'
        })
        setTimeout(function() {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }, 3000);
        //设置所有组件不可点击
        app.globalData.perfectStatus = 1;
        that.setData({
          allDisabled: true,
          isDisabled: true,
        })
        //查询审核状态
        that.getShenheInfo();
      }
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
  open: function() {
    if (this.data.isDisabled) {
      return;
    }
    this.setData({
      condition: !this.data.condition
    })
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
  //切换tab
  tabClick(e) {
    this.setData({
      activeIndex: e.currentTarget.id
    })
  },
  getShenheInfo: function() {
    var that = this;
    if (!that.data.shenheStatus) {
      return;
    }
    app.getShenheInfo(that, 1);
  },
  onLoad: function(options) {
    var that = this;
    app.getQianming(that, 'fbf');
    that.setData({
      //完善状态
      perfectStatus: app.globalData.perfectStatus,
      //审核状态
      shenheStatus: true,
      fileUrl: app.globalData.url + 'upload_api_controller/pUpload',
      // fileUrl: app.globalData.uploadUrl + '/fbf',
      formData: app.globalData.formData
    })
    //初始化省市区
    app.initSsq(that);
    //获取全局的值赋值
    that.setData({
      tel: wx.getStorageSync('tel'),
      name: wx.getStorageSync('username')
    });
    //判断完善状态
    //查看包工侠资料
    if (app.globalData.perfectStatus == 0) { //未完善信息
      that.setData({
        title: '请完善基本信息'
      })
    } else { //已经完善信息了
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        title: '基本信息',
        selectedFlag: [false, true],
        isDisabled: true,
      })
      var data = {};
      data.token = app.globalData.token;
      app.ajax.req('company_api_controller/companyInfo', data, 'GET', function(res) {
        if (parseInt(res.errorCode) === 200) {
          if (!res.data.headPortrait) {
            that.setData({
              fileList: []
            })
          } else {
            //头像
            that.setData({
              imgInfoDisabled: false,
              fileList: [{
                uid: res.data.headPortrait,
                status: 'done',
                url: res.data.headPortrait + '?x-oss-process=style/thumb',
                originalUrl: res.data.headPortrait + '?x-oss-process=style/original'
              }]
            })
          }

          if (!res.data.bizlicense) { //个人
            that.setData({
              activeIndex: 1
            })
          } else { //企业
            that.setData({
              activeIndex: 0
            })
            //营业执照
            that.setData({
              fileList1: [{
                uid: res.data.bizlicense,
                status: 'done',
                url: res.data.bizlicense + '?x-oss-process=style/thumb',
                originalUrl: res.data.bizlicense + '?x-oss-process=style/original'
              }]
            })
            //组织机构代码
            if (!res.data.orgcode) {
              var sizheng = 'radioItems[0].checked';
              var sanzheng = 'radioItems[1].checked';
              that.setData({
                [sizheng]: !that.data.radioItems[0].checked,
                [sanzheng]: !that.data.radioItems[1].checked
              })
            } else {
              that.setData({
                fileList2: [{
                  uid: res.data.orgcode,
                  status: 'done',
                  url: res.data.orgcode + '?x-oss-process=style/thumb',
                  originalUrl: res.data.orgcode + '?x-oss-process=style/original'
                }]
              })

            }
            if (res.data.registration) {
              that.setData({
                fileList3: [{
                  uid: res.data.registration,
                  status: 'done',
                  url: res.data.registration + '?x-oss-process=style/thumb',
                  originalUrl: res.data.registration + '?x-oss-process=style/original'
                }]
              })
            }
            if (res.data.openingPermit) {
              that.setData({
                fileList4: [{
                  uid: res.data.openingPermit,
                  status: 'done',
                  url: res.data.openingPermit + '?x-oss-process=style/thumb',
                  originalUrl: res.data.openingPermit + '?x-oss-process=style/original'
                }]
              })
            }
          }
          //区域处理
          var quyuData = app.regionalParse(res.data.region);
          that.setData({
            province: quyuData.province,
            city: quyuData.city,
            county: quyuData.county ? quyuData.county : '',
            qyname: res.data.name ? res.data.name : '',
            qyaddr: res.data.address,
            qyfaren: res.data.tdutyName ? res.data.tdutyName : '',
            username: res.data.tdutyName,
            tel: res.data.dutyPhone,
            idcard: res.data.idCard,
            age: res.data.age,
            sex: res.data.sex,
            birthday: res.data.birthday,
            zuoji: res.data.tel ? res.data.tel : '',
            yaoqingCode: res.data.iCode ? res.data.iCode : '无'
          })
          //设置所有组件不可点击
          that.setData({
            allDisabled: true,
            shenfenDisabled: false
          })
          //审核信息
          that.getShenheInfo();
          wx.hideLoading();
        }
      })
    }
  },
  onUnload: function() {
    this.setData({
      shenheStatus: false
    })
  }
})