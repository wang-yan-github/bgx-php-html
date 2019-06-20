var cityData = require('../../utils/citys.js');
var app = getApp();
Page({
  data: {
    xmlist: [],
    // 下拉菜单
    tabList: [{
      itemshow: '金额',
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
    _res1: 0,
    //筛选单项选择
    tab_item: ['不限', '升序', '降序'],
    //筛选单项选择
    tab_item1: ['不限', '已认证', '未认证'],
    //筛选左中右结构
    selected_index1: 0,
    selected_index2: 0,
    cityleft: '',
    citycenter: {},
    // 筛选
    shaixuan: [{
      title: '所在行业',
      name: [{
        name: '不限',
        type: 0
      }, {
        name: '消防',
        type: 0
      }, {
        name: '建筑',
        type: 0
      }, {
        name: '装饰装修',
        type: 0
      }, {
        name: '土方',
        type: 0
      }, {
        name: '市政道路',
        type: 0
      }, {
        name: '桥梁',
        type: 0
      }, {
        name: '园林绿化',
        type: 0
      }, {
        name: '节能环保',
        type: 0
      }, {
        name: '铁路',
        type: 0
      }, {
        name: '公路',
        type: 0
      }]
    }],
    shaixuan_: [0],
    isShow: true,
    currentTab: 0,
    //分页
    offset: 0,
    total: 1,
    //搜索栏
    searchText: '',
    searchNum: 0,
  },
  //搜索栏键盘输入时触发
  searchTextonChange(e) {
    this.setData({
      searchText: e.detail.value,
      searchNum: 0
    })
    var that = this;
    that.listShow(that, 1, 10, that.data.tabList[0].itemhide, that.data.tabList[1].itemhide, that.data.tabList[2].itemhide, e.detail.value, that.data.tabList[3].itemhide);

  },
  //搜索栏点击清除图标时触发
  searchTextonClear(e) {
    this.setData({
      searchText: '',
      searchNum: 0
    })
    var that = this;
    that.listShow(that, 1, 10, that.data.tabList[0].itemhide, that.data.tabList[1].itemhide, that.data.tabList[2].itemhide, e.detail.value, that.data.tabList[3].itemhide);
  },
  click_item: function(e) {
    var pid = e.currentTarget.dataset.pid;
    console.log(pid)
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
        url: '../xmXQ/xmXQ?pid=' + pid,
      })
    }
  },
  //列表展示
  listShow: function(that, offset, limit, pColumnPrice, region, authentica, p_name, technicalType) {
    wx.showLoading({
      title: '加载中',
    })
    var data = {};
    data.token = app.globalData.token ? app.globalData.token : '';
    data.offset = offset;
    data.limit = limit;
    data.pColumnPrice = pColumnPrice;
    data.region = region;
    data.authentica = authentica;
    data.p_name = p_name;
    data.technicalType = technicalType;
    app.ajax.req('homepage_api_controller/homeProjectList', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        if (that.data.searchText || res.data.list.length || that.data.tabList[0].itemhide || that.data.tabList[1].itemhide || that.data.tabList[2].itemhide || that.data.tabList[3].itemhide) {
          //第一次搜索，数组清空
          if (!that.data.searchNum) {
            that.setData({
              xmlist: []
            })
          }
          let arr = [];
          for (let i = 0; i < res.data.list.length; i++) {
            let obj = {};
            obj.p_name = res.data.list[i].p_name;
            obj.technical_type = res.data.list[i].technical_type;
            obj.authentica = res.data.list[i].authentica;
            obj.add_time = res.data.list[i].add_time;
            obj.p_column_price = res.data.list[i].p_column_price;
            //处理区域
            let quyu = app.regionalParse(res.data.list[i].region);
            obj.region = quyu.city.name + '-' + quyu.county.name + '-' + quyu.province.name;
            obj.p_remark = res.data.list[i].p_remark;
            obj.p_id = res.data.list[i].p_id
            arr.push(obj);
          }
          that.setData({
            xmlist: that.data.xmlist.concat(arr),
            offset: offset + 1,
            total: res.data.total,
            searchNum: that.data.searchNum + 1
          })
          console.log(that.data.offset);
        } else {
          if (that.data.searchText) {
            that.setData({
              xmlist: []
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
    that.setData({
      searchNum: 0
    })
    that.listShow(that, 1, 10, that.data.tabList[0].itemhide, that.data.tabList[1].itemhide, that.data.tabList[2].itemhide, that.data.searchText, that.data.tabList[3].itemhide);
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
  clickNum: function(e) {
    this.setData({
      _num: e.target.dataset.num
    })
    this.setData({
      second: e.target.dataset.name
    })
    this.setData({
      displays: "none"
    })
    var text = this.data.name
  },

  clickHouse: function(e) {
    this.setData({
      _res: e.target.dataset.index
    })
    //给头部tab赋值
    let item5 = "tabList[" + 0 + "].itemshow";
    this.setData({
      [item5]: e.target.dataset.name
    })
    let item6 = "tabList[" + 0 + "].itemhide";
    if (e.target.dataset.name == "升序") {
      this.setData({
        [item6]: 'asc'
      })
    } else if (e.target.dataset.name == "降序") {
      this.setData({
        [item6]: 'desc'
      })
    } else {
      this.setData({
        [item6]: ''
      })
    }
    //筛选
    var that = this;
    that.setData({
      searchNum: 0
    })
    that.listShow(that, 1, 10, that.data.tabList[0].itemhide, that.data.tabList[1].itemhide, that.data.tabList[2].itemhide, that.data.searchText, that.data.tabList[3].itemhide);
    this.setData({
      displays: "none"
    })
  },
  clickHouse1: function(e) {
    this.setData({
      _res1: e.target.dataset.index
    })
    //给头部tab赋值
    let item5 = "tabList[" + 2 + "].itemshow";
    this.setData({
      [item5]: e.target.dataset.name
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
    //筛选
    var that = this;
    that.setData({
      searchNum: 0
    })
    that.listShow(that, 1, 10, that.data.tabList[0].itemhide, that.data.tabList[1].itemhide, that.data.tabList[2].itemhide, that.data.searchText, that.data.tabList[3].itemhide);
    this.setData({
      displays: "none"
    })
  },
  onLoad: function(options) {
    var that = this;
    let quyu = cityData.init();
    quyu.shift();
    that.setData({
      cityleft: quyu,
      xmlist: [],
      offset: 0,
      isbottom: false,
      tabList: [{
        itemshow: '金额',
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
      }]
    })

    that.listShow(that, 1, 10, '', '', '', '', '');
  },
  // 筛选
  shuanxuan_click: function(e) {
    var index = e.currentTarget.dataset.index; //获取自定义的ID值  
    if (e.currentTarget.dataset.type == 0) {
      this.data.shaixuan_[0] = index;
      this.setData({
        shaixuan_: this.data.shaixuan_
      })
      let item7 = "tabList[" + 3 + "].itemhide";
      if (this.data.shaixuan[0].name[this.data.shaixuan_[0]].name == "不限") {
        this.setData({
          [item7]: ''
        })
      } else {
        this.setData({
          [item7]: this.data.shaixuan[0].name[this.data.shaixuan_[0]].name
        })
      }
    }
  },
  queren: function() {
    //筛选
    var that = this;
    that.setData({
      searchNum: 0,
    })
    that.listShow(that, 1, 10, that.data.tabList[0].itemhide, that.data.tabList[1].itemhide, that.data.tabList[2].itemhide, that.data.searchText, that.data.tabList[3].itemhide);
    this.setData({
      displays: "none"
    })
  },
  qingchu: function() {
    //筛选
    var that = this;
    let item7 = "tabList[" + 3 + "].itemhide";
    that.setData({
      [item7]: '',
      shaixuan_: [0]
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
    if (that.data.offset > Math.ceil(that.data.total / 10)) {
      wx.showToast({
        title: '没有更多',
        icon: 'none'
      })
      return;
    }
    that.listShow(that, that.data.offset, 10, that.data.tabList[0].itemhide, that.data.tabList[1].itemhide, that.data.tabList[2].itemhide, that.data.searchText, that.data.tabList[3].itemhide);
  }
})