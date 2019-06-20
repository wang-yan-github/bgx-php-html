var cityData = require('../../utils/citys.js');
var app = getApp();
Page({
  data: {
    // 下拉菜单
    tabList: [{
      itemshow: '工种',
      itemhide: ''
    }, {
      itemshow: '区域',
      itemhide: ''
    }, {
      itemshow: '认证',
      itemhide: ''
    }, {
      itemshow: '筛选',
      itemhide: ''
    }],
    _num: 0,
    _res: 0,
    //筛选单项选择
    tab_item: ['已认证', '未认证', '不限'],
    //筛选左右结构
    shaixuan_lr_l: ['包工侠', '劳务', '不限'],
    selected_index: 0,
    selected0: 'show',
    selected1: 'hidden',
    selected2: 'hidden',
    gc_type: ['一级建造师', '项目经理', '普通工长'],
    gz_type: ['水电工', '木工', '架子工', '钢筋工'],
    //筛选左中右结构
    selected_index1: 0,
    selected_index2: 0,
    selected_index3: 0,
    cityleft: '',
    citycenter: {},
    cityright: {},
    // 筛选
    shaixuan: [{
      title: '从业年限',
      name: [{
        name: '不限',
        type: 0
      }, {
        name: '2年内',
        type: 0
      }, {
        name: '2年到5年',
        type: 0
      }, {
        name: '5年到10年',
        type: 0
      }, {
        name: '10年以上',
        type: 0
      }]
    }, {
      title: '工作状态',
      name: [{
        name: '不限',
        type: 1
      }, {
        name: '空闲',
        type: 1
      }, {
        name: '忙碌',
        type: 1
      }]
    }, {
      title: '工种特征',
      name: [{
        name: '不限',
        type: 2
      }, {
        name: '大工',
        type: 2
      }, {
        name: '小工',
        type: 2
      }]
    }],
    shaixuan_: [0, 0, 0],
    isShow: true,
    currentTab: 0,
    lwList: [],
    offset: 0,
    //总页数
    total: 1,
    //搜索栏
    searchText: '',
    searchNum: 0,
    shaixuan0: '',
    shaixuan1: '',
    shaixuan2: '',
    shaixuan3: '',
  },
  //搜索栏键盘输入时触发
  searchTextonChange(e) {
    this.setData({
      searchText: e.detail.value,
      searchNum: 0
    })
    var that = this;
    that.listShow(that, 1, 10, that.data.shaixuan2, that.data.shaixuan0, that.data.shaixuan1, that.data.tabList[1].itemhide, that.data.tabList[2].itemhide, that.data.searchText, that.data.tabList[0].itemhide)
  },
  //搜索栏点击清除图标时触发
  searchTextonClear(e) {
    this.setData({
      searchText: '',
      searchNum: 0
    })
    var that = this;
    that.listShow(that, 1, 10, that.data.shaixuan2, that.data.shaixuan0, that.data.shaixuan1, that.data.tabList[1].itemhide, that.data.tabList[2].itemhide, that.data.searchText, that.data.tabList[0].itemhide)
  },
  item_click: function(e) {
    var wid = e.currentTarget.dataset.wid;
    var token = app.globalData.token;
    if (!token) {
      wx.showModal({
        title: '登录提醒',
        content: '您还未登录，不能查看详细',
        confirmText: "登录",
        cancelText: "返回",
        success: function(res) {
          console.log(res);
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login',
            })
          } else {
            // console.log('用户点击辅助操作')
          }
        }
      });
    } else {
      wx.navigateTo({
        url: '../lwXQ/lwXQ?wid=' + wid,
      })
    }

  },
  listShow: function(that, offset, limit, consFeature, workTime, workerStatus, region, authentica, name, consType) {
    wx.showLoading({
      title: '加载中',
    })
    var data = {};
    data.offset = offset;
    data.limit = limit;
    data.consFeature = consFeature;
    data.workTime = workTime;
    data.workerStatus = workerStatus;
    data.region = region;
    data.authentica = authentica;
    data.name = name;
    let gc_type = this.data.gc_type;
    for (let item of gc_type) {
      if (item == consType) {
        data.technicalType = consType;
        data.consType = '';
        break;
      } else {
        data.technicalType = '';
        data.consType = consType;
      }
    }
    app.ajax.req('homepage_api_controller/homeWorkerList', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        if (res.data.list.length > 0) {
          function optinsReturn() {
            let arr = [];
            for (let i = 0; i < res.data.list.length; i++) {
              let obj = {};
              obj.duty_name = res.data.list[i].duty_name;
              obj.age = res.data.list[i].age;
              obj.type = res.data.list[i].type;
              obj.authentica = res.data.list[i].authentica;
              obj.work_time = res.data.list[i].work_time;
              obj.worker_status = res.data.list[i].worker_status;
              obj.credit_score = res.data.list[i].credit_score;
              obj.cons_type = res.data.list[i].cons_type;
              obj.achieveCount = res.data.list[i].achieveCount;
              obj.technical_type = res.data.list[i].technical_type;
              obj.w_id = res.data.list[i].w_id;
              obj.head_portrait = res.data.list[i].head_portrait;
              //处理区域
              let quyu = app.getWorkAddr(res.data.list[i].region);
              let quyu2 = [];
              for (let j = 0; j < quyu.length; j++) {
                quyu2.push(quyu[j].name);
              }
              obj.region = quyu2.join(',');
              arr.push(obj);
            }
            return arr;
          }
          //对搜索进行处理searchNum
          if (that.data.searchText || that.data.shaixuan2 || that.data.shaixuan3 || that.data.shaixuan0 || that.data.shaixuan0 || that.data.shaixuan1 || that.data.tabList[1].itemhide || that.data.tabList[2].itemhide || that.data.tabList[0].itemhide) {
            //第一次搜索，数组清空
            if (!that.data.searchNum) {
              that.setData({
                lwList: []
              })
            }
            let arr = optinsReturn();
            that.setData({
              lwList: that.data.lwList.concat(arr),
              offset: offset + 1,
              total: res.data.total,
              searchNum: that.data.searchNum + 1
            })

          } else {
            let arr = optinsReturn();
            that.setData({
              lwList: that.data.lwList.concat(arr),
              offset: offset + 1,
              total: res.data.total
            })
          }
        } else {
          if (that.data.searchText) {
            that.setData({
              lwlist: []
            })
          }
        }
      }
      wx.hideLoading();
    })
  },
  // 下拉切换
  hideNav: function() {
    this.setData({
      displays: "none"
    })
  },
  // tab切换
  tabNav: function(e) {
    this.setData({
      displays: "block"
    })
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var showMode = e.target.dataset.current == 0;
      this.setData({
        currentTab: e.target.dataset.current,
        isShow: showMode
      })
    }
  },
  // 下拉左中右结构切换
  selectleft: function(e) {
    var that = this;
    console.log(e.target.dataset.index)
    that.setData({
      selected_index1: e.target.dataset.index
    })
    var cityleft = that.data.cityleft;
    for (var item_ in cityleft) {
      if (cityleft[item_].code == e.target.dataset.code) {
        that.setData({
          cityright: {},
          citycenter: cityleft[item_].sub,
        });
      }
    }
  },
  selectcenter: function(e) {
    this.setData({
      displays: "none"
    })
    //给头部tab赋值
    var item3 = "tabList[" + 1 + "].itemshow";
    var item4 = "tabList[" + 1 + "].itemhide";
    if (item3 == '市') {
      this.setData({
        [item3]: '不限市',
        [item4]: '',
        selected_index2: e.target.dataset.index
      })
    } else {
      if (e.currentTarget.dataset.name.length > 3) {
        var value = e.currentTarget.dataset.name.substring(0, 3) + "...";
        this.setData({
          [item3]: value,
          [item4]: e.currentTarget.dataset.code,
        })
      } else {
        this.setData({
          [item3]: e.currentTarget.dataset.name,
          [item4]: e.currentTarget.dataset.code,
          selected_index2: e.target.dataset.index
        })
      }
    }
    //筛选
    var that = this;
    that.shaixuan(that);
  },
  // 下拉切换中的左右结构切换
  selected: function(e) {
    var index = e.target.dataset.index;
    this.setData({
      selected_index: index
    })
    if (index == 0) {
      this.setData({
        selected0: 'show',
        selected1: 'hidden',
        selected2: 'hidden'
      })
    } else if (index == 1) {
      this.setData({
        selected0: 'hidden',
        selected1: 'show',
        selected2: 'hidden'
      })
    } else if (index == 2) {
      this.setData({
        selected0: 'hidden',
        selected1: 'hidden',
        selected2: 'show'
      })
    }
  },
  // 下拉菜单1 2 3 4
  clickSum: function(e) {
    this.setData({
      _sum: e.target.dataset.num
    })
    //给头部tab赋值
    var item1 = "tabList[" + 0 + "].itemshow";
    var item2 = "tabList[" + 0 + "].itemhide";
    //对长字段进行截取操作
    if (e.target.dataset.name.length > 3) {
      var item3 = e.target.dataset.name.substring(0, 3) + "...";
      this.setData({
        [item1]: item3,
        [item2]: e.target.dataset.name
      })
    } else {
      this.setData({
        [item1]: e.target.dataset.name,
        [item2]: e.target.dataset.name
      })
    }
    //筛选
    var that = this;
    that.shaixuan(that);
  },
  clickMum: function(e) {
    this.setData({
      _mum: e.target.dataset.num
    })
    //给头部tab赋值
    var item1 = "tabList[" + 0 + "].itemshow";
    var item2 = "tabList[" + 0 + "].itemhide";
    //对长字段进行截取操作
    if (e.target.dataset.name.length > 3) {
      var item3 = e.target.dataset.name.substring(0, 3) + "...";
      this.setData({
        [item1]: item3,
        [item2]: e.target.dataset.name
      })
    } else {
      this.setData({
        [item1]: e.target.dataset.name,
        [item2]: e.target.dataset.name
      })
    }

    //筛选
    var that = this;
    that.shaixuan(that);
  },
  clickCum: function(e) {
    this.setData({
      _cum: e.target.dataset.num
    })
    var item1 = "tabList[" + 0 + "].itemshow";
    this.setData({
      [item1]: e.target.dataset.name,
    })
    var text = this.data.name
    this.setData({
      displays: "none"
    })
  },
  // 售价
  clickNum: function(e) {
    this.setData({
      _num: e.target.dataset.num
    })
    this.setData({
      displays: "none"
    })
  },
  clickHouse: function(e) {
    this.setData({
      _res: e.target.dataset.index
    })
    //给头部tab赋值
    let item5 = "tabList[" + 2 + "].itemshow";
    this.setData({
      [item5]: e.target.dataset.name,
    })
    let item6 = "tabList[" + 2 + "].itemhide";
    if (e.target.dataset.name == "已认证") {
      this.setData({
        [item6]: 1
      })
    } else if (e.target.dataset.name == "未认证") {
      this.setData({
        [item6]: 0
      })
    } else {
      this.setData({
        [item6]: ''
      })
    }
    var that = this;
    that.shaixuan(that);
  },
  onLoad: function(options) {
    let quyu = cityData.init();
    quyu.shift();
    this.setData({
      cityleft: quyu,
      gc_type: app.globalData.bgxClass,
      gz_type: app.globalData.lwClass,
      lwList: [],
      offset: 0,
      isbottom: false
    });
    var that = this;
    that.listShow(that, 1, 10, '', '', '', '', '', '', '')
  },
  shaixuan: function(that) {
    //筛选
    var shaixuan0 = '';
    var shaixuan1 = '';
    var shaixuan2 = '';
    if (that.data.shaixuan[0].name[this.data.shaixuan_[0]].name == '不限') {
      shaixuan0 = '';
    } else {
      shaixuan0 = that.data.shaixuan[0].name[this.data.shaixuan_[0]].name;
    }
    if (that.data.shaixuan[1].name[this.data.shaixuan_[1]].name == '不限') {
      shaixuan1 = '';
    } else if (that.data.shaixuan[1].name[this.data.shaixuan_[1]].name == '空闲') {
      shaixuan1 = 0;
    } else if (that.data.shaixuan[1].name[this.data.shaixuan_[1]].name == '忙碌') {
      shaixuan1 = 1;
    }
    if (that.data.shaixuan[2].name[this.data.shaixuan_[2]].name == '不限') {
      shaixuan2 = '';
    } else {
      shaixuan2 = that.data.shaixuan[2].name[this.data.shaixuan_[2]].name;
    }
    this.setData({
      shaixuan0: shaixuan0,
      shaixuan1: shaixuan1,
      shaixuan2: shaixuan2,
      displays: "none",
      searchNum: 0,
      lwList: []
    })
    that.listShow(that, 1, 10, shaixuan2, shaixuan0, shaixuan1, that.data.tabList[1].itemhide, that.data.tabList[2].itemhide, that.data.searchText, that.data.tabList[0].itemhide)

  },
  // 筛选
  shuanxuan_click: function(e) {
    var index = e.currentTarget.dataset.index; //获取自定义的ID值  
    if (e.currentTarget.dataset.type == 0) {
      this.data.shaixuan_[0] = index;
      this.setData({
        shaixuan_: this.data.shaixuan_
      })
    } else if (e.currentTarget.dataset.type == 1) {
      this.data.shaixuan_[1] = index;
      this.setData({
        shaixuan_: this.data.shaixuan_
      })
    } else if (e.currentTarget.dataset.type == 2) {
      this.data.shaixuan_[2] = index;
      this.setData({
        shaixuan_: this.data.shaixuan_
      })
    } else if (e.currentTarget.dataset.type == 3) {
      this.data.shaixuan_[3] = index;
      this.setData({
        shaixuan_: this.data.shaixuan_
      })
    }
  },
  queren: function() {
    var that = this;
    that.shaixuan(that);
  },
  qingchu: function() {
    this.setData({
      shaixuan_: [0, 0, 0],
    })

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
  //上拉触底
  onReachBottom: function() {
    var that = this;
    console.log('上拉', that.data.offset)
    if (that.data.offset > Math.ceil(that.data.total / 10)) {
      wx.showToast({
        title: '没有更多',
        icon: 'none'
      })
      return;
    }
    that.listShow(that, that.data.offset, 10, that.data.shaixuan2, that.data.shaixuan0, that.data.shaixuan1, that.data.tabList[1].itemhide, that.data.tabList[2].itemhide, that.data.searchText, that.data.tabList[0].itemhide)
  }
})