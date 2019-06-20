//app.js
var http = require('utils/http.js');
var tcity = require("utils/citys.js");
var util = require('utils/util.js');
const uploadAliyun = require('utils/uploadAliyun.js');
const root1 = 'http://118.24.66.77:8080/'; //测试
const root2 = 'http://192.168.0.107:8080/'; //本地
const root3 = 'https://www.baogongxia.com/'; //部署
const root = root3;
//websocket
let socketMsgQueue = [];
let isLoading = false;
let heartCheck = {
  timeout: 10000,
  timeoutObj: null,
  serverTimeoutObj: null,
  start: function() {
    //重置定时器
    clearTimeout(this.timeoutObj);
    var self = this;
    var app = getApp();
    this.timeoutObj = setTimeout(function() {
      //在线状态才发送
      if (app.globalData.localSocket.readyState === 1) {
        let data = {};
        let message = {};
        let froms = {};
        let tos = {};
        message.content = '';
        //我的类型 --ID
        let userId = app.globalData.infoId;
        let type_ = app.globalData.roleIndex + 1;
        froms.from = userId;
        froms.type = type_;
        message.froms = froms;
        tos.to = app.globalData.toId;
        tos.type = app.globalData.toType;
        message.tos = tos;
        let date = new Date();
        message.time = util.formatTime1(date);
        data.message = message;
        data.toType = 'HeartBeat';
        app.globalData.localSocket.send({
          data: JSON.stringify(data)
        });
      }
    }, 30000);
  },
};
App({
  onLaunch: function() {
    // wx.removeStorageSync('cityData');
    // const updateManager = wx.getUpdateManager();
    // updateManager.onCheckForUpdate(function(res) {
    //   // 请求完新版本信息的回调
    //   console.log(res.hasUpdate);
    // })
    // updateManager.onUpdateReady(function() {
    //   wx.showModal({
    //     title: '更新提示',
    //     content: '新版本已经准备好，是否重启应用？',
    //     success: function(res) {
    //       if (res.confirm) {
    //         // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    //         updateManager.applyUpdate();
    //       }
    //     }
    //   })
    // })
  },
  globalData: {
    //websocket
    localSocket: {},
    callback: function() {},
    toId: null,
    toType: null,
    url: root,
    uploadUrl: 'https://baogongxia1.oss-cn-shenzhen.aliyuncs.com/',
    //角色
    roles: ["发包方", "包工侠", "劳务"],
    //角色下标
    roleIndex: -1,
    infoId: -1,
    //验证令牌
    token: '',
    //全局代替头像
    touxiang: '/pages/images/touxiang.png',
    //登录状态（是否完善）
    perfectStatus: 0,
    //工程类型
    gcData: ["请选择", "不限工程类型", "消防", "建筑", "装饰装修", "土方", "市政道路", "桥梁", "园林绿化", "节能环保", "铁路", "公路"],
    //工种类型
    gzData: ["请选择", "不限工种类型", "水电工", "木工", "泥工", "焊工", "钢筋工", "架子工", "抹灰工", "腻子工", "钢结构安装工", "幕墙工", "管道工", "防水工", "油漆工", "杂工", "普工", "技术员", "质量员", "测量员", "安全负责人", "资料员"],
    //包工侠类型
    bgxClass: ["不限工程类型", "消防", "建筑", "装饰装修", "土方", "市政道路", "桥梁", "园林绿化", "节能环保", "铁路", "公路"],
    //劳务类型
    lwClass: ["不限工种类型", "水电工", "木工", "泥工", "焊工", "钢筋工", "架子工", "抹灰工", "腻子工", "钢结构安装工", "幕墙工", "管道工", "防水工", "油漆工", "杂工", "普工", "技术员", "质量员", "测量员", "安全负责人", "资料员"],
    socketClose: false,
    //全局消息定时器
    xiaoxiTime: ''
  },
  //统计页面访问次数
  // reqNumber: function(id, type) {
  //   let data = {};
  //   data.id = id;
  //   data.type = type;
  //   wx.request({
  //     url: '',
  //     data: '',
  //     header: {},
  //     method: 'GET',
  //     dataType: 'json',
  //     responseType: 'text',
  //     success: function(res) {},
  //     fail: function(res) {},
  //     complete: function(res) {},
  //   })
  // },
  //消息总条数、我的消息总条数
  showXiaoxiTotal: function() {
    let data = {};
    let that = this;
    data.token = that.globalData.token;
    //消息总条数
    that.ajax.req('message_api_controller/myMessageNewTotal', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) === 200) {
        clearTimeout(that.globalData.xiaoxiTime);
        that.setTotal((res.data.m_total).toString(), (res.data.s_total).toString());
        that.globalData.xiaoxiTime = setTimeout(function() {
          that.showXiaoxiTotal();
        }, 15000);
      } else {
        wx.hideToast();
      }
    })
  },
  //设置消息总条数
  setTotal: function(messageTotal, wodeTotal) {
    if (Number.parseInt(messageTotal) === 0) {
      let messageTotal = messageTotal > 99 ? '99+' : messageTotal;
      let wodeTotal = wodeTotal > 99 ? '99+' : wodeTotal;
      wx.removeTabBarBadge({
        index: 2
      })
    } else {
      wx.setTabBarBadge({
        index: 2,
        text: messageTotal
      })
    }
    if (Number.parseInt(wodeTotal) === 0) {
      wx.removeTabBarBadge({
        index: 3,
      })
    } else {
      wx.setTabBarBadge({
        index: 3,
        text: wodeTotal,
      })
    }
  },
  showLoad() {
    if (!isLoading) {
      wx.showLoading({
        title: '请稍后',
      })
      isLoading = true
    }
  },
  hideLoad() {
    wx.hideLoading();
    isLoading = false
  },
  initSocket() {
    let that = this;
    //创建websocket链接
    let userId = that.globalData.infoId;
    let type_ = that.globalData.roleIndex + 1;
    console.log('用户ID' + userId + '角色' + type_);
    that.globalData.localSocket = wx.connectSocket({
      url: 'wss://api.baogongxia.com:8088'
    })
    //websocket链接打开的时候
    that.globalData.localSocket.onOpen(function(res) {
      console.log('连接已打开！readyState=' + that.globalData.localSocket.readyState);
      //第一次注册
      let data = {};
      let message = {};
      let froms = {};
      let tos = {};
      message.content = '';
      froms.from = userId;
      froms.type = type_;
      message.froms = froms;
      tos.to = that.globalData.toId;
      tos.type = that.globalData.toType;
      message.tos = tos;
      let date = new Date();
      message.time = util.formatTime1(date);
      data.message = message;
      data.toType = 'register';
      that.sendSocketMessage(data);
      while (socketMsgQueue.length > 0) {
        var msg = socketMsgQueue.shift();
        console.log('重新发送数据', msg);
        that.sendSocketMessage(msg);
      }
      //开始心跳
      // heartCheck.start();
    })
    //websocket接收消息
    that.globalData.localSocket.onMessage(function(res) {
      that.hideLoad();
      let resData = JSON.parse(res.data);
      console.log('返回的数据', resData);
      //返回的数据为心跳
      if (resData.type == "HeartBeat") {
        that.globalData.localSocket.close({
          success: function(res) {
            console.log('关闭成功', res);
          }
        });
      } else if (resData.type == "register") {
        // console.log('重新创建链接', resData);
      }
      that.globalData.callback(res);
    })
    //websocket发生错误
    that.globalData.localSocket.onError(function(res) {
      console.log('连接发生错误！readyState=' + that.globalData.localSocket.readyState);
      // that.initSocket();
    })
    //websocket关闭
    that.globalData.localSocket.onClose(function(res) {
      console.log('连接已关闭！', res);
      console.log('连接已关闭！readyState=' + that.globalData.localSocket.readyState);
      if (!that.globalData.socketClose) {
        that.initSocket();
      }
    })
  },
  //统一发送消息
  sendSocketMessage: function(msg) {
    if (this.globalData.localSocket.readyState === 1) {
      this.showLoad();
      console.log('发送成功的消息', msg);
      this.globalData.localSocket.send({
        data: JSON.stringify(msg)
      })
    } else {
      console.log('发送失败的消息', msg);
      socketMsgQueue.push(msg);
    }
  },
  //获取签名
  getQianming: function(that, dir) {
    //刷新签名
    var that_1 = this;
    uploadAliyun.getFormData(that_1.globalData.token, dir, function(res) {
      that.setData({
        formData: res,
        fileUrl: that_1.globalData.uploadUrl
      })
    })
  },
  ajax: {
    req: http.req
  },
  //预约函数
  yuyue: function(bs_id, bs_identity, p_id, YyClass) {
    if (YyClass == 1) { //预约项目
      if (this.globalData.roleIndex == 0) {
        wx.showToast({
          title: '您当前角色是发包方，不能预约项目',
          icon: 'none'
        })
        return;
      }
    }
    var data = {};
    data.token = this.globalData.token;
    data.bs_id = bs_id;
    data.bs_identity = bs_identity;
    data.p_id = p_id;
    this.ajax.req('bespeak_api_controller/companyWorkerBespeak', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '预约成功'
        })
      } else {
        wx.showToast({
          title: res.errorDesc,
          icon: 'none'
        })
      }
    })
  },
  //区域解析
  regionalParse: function(quyu_code) {
    var cityData = tcity.init();
    for (let i = 0; i < cityData.length; i++) {
      for (let j = 0; j < cityData[i].sub.length; j++) {
        //如果输入的码是到市
        if (cityData[i].sub[j].code == quyu_code) {
          var data = {};
          data.province = {
            name: cityData[i].name,
            code: cityData[i].code
          };
          data.city = {
            name: cityData[i].sub[j].name,
            code: cityData[i].sub[j].code
          }
          return data;
        }
        for (let k = 0; k < cityData[i].sub[j].sub.length; k++) {
          if (cityData[i].sub[j].sub[k].code == quyu_code) {
            var data = {};
            data.province = {
              name: cityData[i].name,
              code: cityData[i].code
            };
            data.city = {
              name: cityData[i].sub[j].name,
              code: cityData[i].sub[j].code
            }
            data.county = {
              name: cityData[i].sub[j].sub[k].name,
              code: cityData[i].sub[j].sub[k].code
            }
            return data;
          }
        }
      }
    }
  },
  //可施工地匹配
  getWorkAddr: function(work_address) {
    var arr = work_address.split(',');
    var cityData = tcity.init();
    var canWorkAddr = [];
    for (let k = 0; k < arr.length; k++) {
      (function(k) {
        if (arr[k]) {
          for (let i = 0; i < cityData.length; i++) {
            for (let j = 0; j < cityData[i].sub.length; j++) {
              if (cityData[i].sub[j].code == arr[k]) {
                canWorkAddr.push({
                  name: cityData[i].sub[j].name,
                  code: cityData[i].sub[j].code
                })
              }
            }
          }
        }
      })(k)
    }
    return canWorkAddr;
  },
  //初始化省市
  initSs: function(that) {
    var cityData = tcity.init();
    const provinces2 = [];
    const citys2 = [];
    for (let i = 0; i < cityData.length; i++) {
      provinces2.push({
        name: cityData[i].name,
        code: cityData[i].code
      });
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys2.push({
        name: cityData[0].sub[i].name,
        code: cityData[0].sub[i].code
      })
    }
    that.setData({
      'provinces2': provinces2,
      'citys2': citys2,
      'province2': {
        name: cityData[0].name,
        code: cityData[0].code
      },
      'city2': {
        name: cityData[0].sub[0].name,
        code: cityData[0].sub[0].code
      }
    })
  },
  //初始化省市区
  initSsq: function(that) {
    var cityData = tcity.init();
    cityData.splice(1, 1);
    const provinces = [];
    const citys = [];
    const countys = [];
    for (let i = 0; i < cityData.length; i++) {
      provinces.push({
        name: cityData[i].name,
        code: cityData[i].code
      });
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push({
        name: cityData[0].sub[i].name,
        code: cityData[0].sub[i].code
      })
    }
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push({
        name: cityData[0].sub[0].sub[i].name,
        code: cityData[0].sub[0].sub[i].code
      })
    }
    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': {
        name: cityData[0].name,
        code: cityData[0].code
      },
      'city': {
        name: cityData[0].sub[0].name,
        code: cityData[0].sub[0].code
      },
      'county': {
        name: cityData[0].sub[0].sub[0].name,
        code: cityData[0].sub[0].sub[0].code
      }
    })
  },
  //省市两级联动
  getSsMore: function(that, e) {
    var val = e.detail.value
    var t = that.data.values2;
    var cityData = tcity.init();
    if (val[0] != t[0]) {
      const citys2 = [];
      const countys2 = [];
      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys2.push({
          name: cityData[val[0]].sub[i].name,
          code: cityData[val[0]].sub[i].code
        })
      }

      that.setData({
        province2: that.data.provinces2[val[0]],
        city2: {
          name: cityData[val[0]].sub[0].name,
          code: cityData[val[0]].sub[0].code
        },
        citys2: citys2,
        values2: val,
        value2: [val[0], 0]
      })
      return;
    }
    if (val[1] != t[1]) {
      that.setData({
        city2: that.data.citys2[val[1]],
        values2: val,
        value2: [val[0], val[1]]
      })
      return;
    }
  },
  //省市区三级联动
  getSsqMore: function(that, e) {
    var val = e.detail.value
    var t = that.data.values;
    var cityData = tcity.init();
    cityData.splice(1, 1);
    if (val[0] != t[0]) {
      const citys = [];
      const countys = [];
      //得到市
      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push({
          name: cityData[val[0]].sub[i].name,
          code: cityData[val[0]].sub[i].code
        })
      }
      //得到区
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push({
          name: cityData[val[0]].sub[0].sub[i].name,
          code: cityData[val[0]].sub[0].sub[i].code
        })
      }

      that.setData({
        province: that.data.provinces[val[0]],
        city: {
          name: cityData[val[0]].sub[0].name,
          code: cityData[val[0]].sub[0].code
        },
        citys: citys,
        county: {
          name: cityData[val[0]].sub[0].sub[0].name,
          code: cityData[val[0]].sub[0].sub[0].code
        },
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })
      return;
    }
    if (val[1] != t[1]) {
      const countys = [];
      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push({
          name: cityData[val[0]].sub[val[1]].sub[i].name,
          code: cityData[val[0]].sub[val[1]].sub[i].code
        })
      }

      that.setData({
        city: that.data.citys[val[1]],
        county: {
          name: cityData[val[0]].sub[val[1]].sub[0].name,
          code: cityData[val[0]].sub[val[1]].sub[0].code
        },
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      that.setData({
        county: that.data.countys[val[2]],
        values: val
      })
      return;
    }
  },
  //得到审核信息
  getShenheInfo: function(that, type) {
    var data = {};
    data.token = this.globalData.token;
    data.offset = 1;
    data.limit = 10;
    data.type = type;
    this.ajax.req('auditor_api_controller/auditorList', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        that.setData({
          shenheInfo: res.data.list
        })
        setTimeout(function() {
          that.getShenheInfo();
        }, 10000);
      }
    })
  },
  //可施工地
  getCanWorkAddr: function(that) {
    if (that.data.isopen2) {
      return;
    }
    if (that.data.canWorkAddr_data.length < 3) {
      if (that.data.city2.name == '市') {
        wx.showToast({
          title: '请选择有效值',
          icon: 'none'
        })
        return;
      }
      for (let i = 0; i < that.data.canWorkAddr.length; i++) {
        if (that.data.canWorkAddr[i].name == that.data.city2.name) {
          wx.showToast({
            title: '请不要重复选择',
            icon: 'none'
          })
          return;
        }
      }
      that.data.canWorkAddr_data.push({
        name: that.data.city2.name,
        code: that.data.city2.code
      });
      that.setData({
        condition2: !that.data.condition2,
        canWorkAddr: that.data.canWorkAddr_data
      })
    } else {
      wx.showToast({
        title: '最多只能选择3个城市',
        icon: 'none'
      })
      that.setData({
        condition2: !that.data.condition2
      })
    }
  }
})