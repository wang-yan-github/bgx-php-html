//index.js
//获取应用实例
var util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    imgUrls: ['http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/index1.jpg',
      'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/index2.jpg',
      'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/index3.jpg',
      'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/index4.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    "grids": [{
        url: "/pages/images/findxm.png",
        name: "找项目"
      },
      {
        url: "/pages/images/findlw.png",
        name: "找劳务"
      },
      {
        url: "/pages/images/baitiao.png",
        name: "打白条"
      },
      {
        url: "/pages/images/findCailiao.png",
        name: "拼材料"
      }
    ],
    more1_index: -1,
    //帖子列表
    dataList: [],
    zhankai1: '',
    dianzan: false,
    isDianzan: true,
    shoucang: false,
    isShouchang: true,
    //评论内容
    pinglun_content: '',
    pinglun_index: '',
    pinglunData: [],
    //展开索引
    zhankai_index: '',
    //上拉刷新控制状态
    isTopfresh: false,
    //列表分页
    offset: 1,
    //底线
    isbottom: false,
    //总页数
    total: 1,
    //悬浮按钮
    visible: false,
    position: 'bottomRight',
    theme: 'assertive',
    buttons: [{
        label: '登录',
        icon: "/pages/images/login_tx.png",
      },
      {
        label: '发帖',
        icon: "/pages/images/fabu2.png",
      },
      {
        label: '发布项目',
        icon: "/pages/images/fabu1.png",
      }
    ],
    gonggao_content: '华侨城发布项目了。   地铁一号线工程开始招标了。  包工侠陈**发布了一条招工信息。  恭喜张包工侠在平台上承接了星辰国际项目',
    del: true

  },
  //点击公告
  gonggao: function(e) {

  },
  //点击悬浮按钮处理
  buttonClicked(e) {
    const {
      index
    } = e.detail
    //登录
    if (index === 0) {
      if (app.globalData.roleIndex !== -1) {
        wx.showToast({
          title: '当前用户已登录,请不要重复登录',
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    } else if (index === 1) { //发布项目
      //发工友圈
      if (!app.globalData.token) {
        //提示先登录
        wx.showModal({
          title: '登录提醒',
          content: '您还未登录，不能发布信息',
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
          url: '/pages/discover/discover_fabu',
        })
      }

    } else {
      //判断登录
      if (!app.globalData.token) {
        //提示先登录
        wx.showModal({
          title: '登录提醒',
          content: '您还未登录，不能发布信息',
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
      } else if (app.globalData.roleIndex !== 0) { //判断角色
        //切换角色
        wx.showModal({
          title: '角色信息',
          content: '您的当前角色不是发包方，是否要切换发包方角色',
          confirmText: "切换",
          cancelText: "返回",
          success: function(res) {
            console.log(res);
            if (res.confirm) {
              app.globalData.roleIndex = 0;
              wx.setStorageSync('roleIndex', 0);
              wx.navigateTo({
                url: '../login/login',
              })
            } else {
              // console.log('用户点击辅助操作')
            }
          }
        });
      } else {
        //先切换到我的里面
        wx.switchTab({
          url: '/pages/wode/wode'
        })
        //再跳转到发布项目页面
        wx.navigateTo({
          url: '/pages/fbfCenter/fabuXM',
        })
      }
    }
  },
  //帖子分享
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '包工侠',
      // path: '/page/user?id=123'
    }
  },
  //查看评论
  pinglun_: function(e) {
    var that = this;
    var cfid = e.currentTarget.dataset.cfid;
    if (!that.data.pinglun_index) {
      that.setData({
        pinglun_index: cfid
      })
      that.cookXiangq(that, cfid);
    } else {
      that.setData({
        pinglun_index: ''
      })
    }
  },
  //查看单个帖子详情
  cookXiangq: function(that, cfid) {
    var data = {};
    data.cf_id = cfid;
    app.ajax.req('circle_friends_api_controller/circleFriendsInfo', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        that.setData({
          pinglunData: res.data.cfMap.clist
        })
      }
    })
  },
  //评论
  pinglunSubmit: function(e) {
    var that = this;
    if (!app.globalData.token) {
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
      var data = {};
      var cfid = e.currentTarget.dataset.cfid;
      data.token = app.globalData.token;
      data.cf_id = cfid;
      data.content = that.data.pinglun_content;
      //对发布内容进行判断
      var content = util.trim(data.content);
      if (!content) {
        wx.showModal({
          title: '文字为空',
          content: '文字不能为空',
          confirmText: "重新输入",
          cancelText: "返回",
          success: function(res) {
            if (res.confirm) {
              console.log('重新输入');
            } else {
              wx.navigateBack();
            }
          }
        })
      } else {
        wx.showLoading({
          title: '上传中',
        })
        app.ajax.req('circle_friends_api_controller/commentArticle', data, 'GET', function(res) {
          wx.hideLoading();
          if (parseInt(res.errorCode) === 200) {
            for (let i = 0; i < that.data.dataList.length; i++) {
              if (that.data.dataList[i].cf_id == cfid) {
                let num = 'dataList[' + i + '].cf_replyNum';
                that.setData({
                  [num]: parseInt(that.data.dataList[i].cf_replyNum) + 1
                })
              }
            }
            that.setData({
              pinglun_content: ''
            })
            setTimeout(function() {
              that.cookXiangq(that, e.currentTarget.dataset.cfid);
            }, 3000)
          }
        })
      }
    }
  },
  pinglun_content: function(e) {
    this.setData({
      pinglun_content: e.detail.value
    })
  },

  //加载列表
  show_tiezi: function(that, offset, topic) {
    var data = {};
    data.offset = offset;
    data.limit = 6;
    data.topic = topic;
    data.token = app.globalData.token ? app.globalData.token : '';
    app.ajax.req('circle_friends_api_controller/circleFriendsList', data, 'GET', function(res) {
      if (parseInt(res.errorCode) !== 200) {
        that.setData({
          isTopfresh: false,
          isbottom: true
        })
      } else {
        if (res.data.cflist.length > 0) {
          that.setData({
            dataList: that.data.dataList.concat(res.data.cflist),
            isTopfresh: true,
            isbottom: true,
            total: res.data.total
          })
        } else {
          that.setData({
            isTopfresh: false,
            isbottom: true
          })
        }
        console.log(that.data.dataList);
        console.log("是否刷新" + that.data.isTopfresh + "页数" + that.data.offset);
      }
    })
  },
  search_tiezi: function(e) {
    var that = this;
    that.setData({
      more1_index: e.currentTarget.dataset.index,
      dataList: [],
      offset: 1,
      isbottom: false,
      isbottomfresh: true,
    })
    var topic = that.data.more1[that.data.more1_index].name;
    that.show_tiezi(that, 1, topic);
    setTimeout(function() {
      that.setData({
        isMore: true
      })
    }, 300);
  },
  fabu: function() {
    wx.navigateTo({
      url: 'discover_fabu',
    })
  },
  //点赞
  dianzan: function(e) {
    var that = this;
    var data = {};
    var cfid = e.currentTarget.dataset.cfid;
    data.token = app.globalData.token;
    data.cf_id = cfid;
    if (!app.globalData.token) {
      wx.showModal({
        title: '登录提醒',
        content: '您还未登录，请先登录',
        confirmText: "登录",
        cancelText: "返回",
        success: function(res) {
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
      //查询点赞状态
      that.isFollow(that, cfid);
    }
  },
  //展开
  zhankai: function(e) {
    var that = this;
    var cfid = e.currentTarget.dataset.cfid;
    if (!that.data.zhankai_index) {
      that.setData({
        zhankai_index: cfid
      })
    } else {
      that.setData({
        zhankai_index: ''
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  isFollow: function(that, cfid) {
    var data = {};
    if (!that.data.isDianzan) {
      wx.showToast({
        title: '操作过于频繁',
        icon: 'none'
      })
      return;
    }
    //锁定按钮
    that.setData({
      isDianzan: false
    })
    data.token = app.globalData.token;
    data.cf_id = cfid;
    //查询点赞状态
    app.ajax.req('circle_friends_api_controller/isFollow', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        //是否已点赞
        that.setData({
          dianzan: res.data.isCollection
        })
        //如果没有被点赞
        if (!that.data.dianzan) {
          app.ajax.req('circle_friends_api_controller/follow', data, 'GET', function(res) {
            if (parseInt(res.errorCode) === 200) {
              for (let i = 0; i < that.data.dataList.length; i++) {
                if (that.data.dataList[i].cf_id == cfid) {
                  let num = 'dataList[' + i + '].cf_followNum';
                  that.setData({
                    [num]: parseInt(that.data.dataList[i].cf_followNum) + 1
                  })
                }
              }
              wx.showToast({
                title: '+1',
                icon: 'none',
                duration: 1000
              })
            }
            that.setData({
              isDianzan: true
            })
          })
        } else {
          app.ajax.req('circle_friends_api_controller/removeFollow', data, 'GET', function(res) {
            if (parseInt(res.errorCode) === 200) {
              wx.showToast({
                title: '-1',
                icon: 'none',
                duration: 1000
              })
              for (let i = 0; i < that.data.dataList.length; i++) {
                if (that.data.dataList[i].cf_id == cfid) {
                  let num = 'dataList[' + i + '].cf_followNum';
                  that.setData({
                    [num]: parseInt(that.data.dataList[i].cf_followNum) - 1
                  })
                }
              }
            }
            that.setData({
              isDianzan: true
            })
          })
        }
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      dataList: [],
      offset: 1,
      more1_index: -1,
      isbottom: false,
      isbottomfresh: true
    })
    that.onShow();
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 100);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    //是否刷新
    if (that.data.isTopfresh) {
      //话题索引
      if (that.data.more1_index == -1) {
        that.show_tiezi(that, that.data.offset + 1, '');
        that.setData({
          offset: that.data.offset + 1
        })
      } else {
        if (that.data.offset > Math.ceil(that.data.total / 6)) {
          wx.showToast({
            title: '没有更多',
            icon: 'none'
          })
          return;
        }
        var topic = that.data.more1[that.data.more1_index].name;
        that.show_tiezi(that, that.data.offset + 1, topic);
        that.setData({
          offset: that.data.offset + 1
        })
      }
    }
  },
  click_nav: function(e) {
    var text = e.currentTarget.dataset.text;
    if (text == "找项目") {
      wx.navigateTo({
        url: '../findXm/findXm',
      })
    } else if (text == "找劳务") {
      wx.navigateTo({
        url: '../findlw/findlw',
      })
    } else if (text == "打白条") {
      wx.navigateTo({
        url: '../dabaitiao/index',
      })
    } else if (text == "拼材料") {
      wx.navigateTo({
        url: '../pincailiao/index',
      })
    }
  },
  previewImage: function(e) {
    var arr = [];
    var imgs = e.currentTarget.dataset.imags;
    for (let i = 0; i < imgs.length; i++) {
      arr.push(imgs[i].img);
    }
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  shoucang: function(e) {
    var that = this;
    if (!that.data.isShouchang) {
      wx.showToast({
        title: '操作过于频繁',
        icon: 'none'
      })
      return false;
    }
    //锁定控件
    that.setData({
      isShouchang: false
    })
    //查询收藏状态
    if (!app.globalData.token) {
      wx.showModal({
        title: '登录提醒',
        content: '您还未登录，不能查看详细',
        confirmText: "登录",
        cancelText: "返回",
        success: function(res) {
          console.log(res);
          if (res.confirm) {
            wx.redirectTo({
              url: '../login/login',
            })
          } else {
            // console.log('用户点击辅助操作')
          }
        }
      });
    } else {
      //查询收藏状态
      let data = {};
      let cfid = e.currentTarget.dataset.cfid;
      data.token = app.globalData.token;
      data.c_Id = cfid;
      app.ajax.req('collection_api_controller/collectionIs', data, 'GET', function(res) {
        if (parseInt(res.errorCode) === 200) {
          that.setData({
            shoucang: res.data.isCollection
          })
          var data1 = {};
          data1.token = app.globalData.token;
          data1.c_Id = cfid;
          if (!that.data.shoucang) { //收藏
            app.ajax.req('collection_api_controller/collectionSave', data1, 'GET', function(res) {
              if (parseInt(res.errorCode) === 200) {
                wx.showToast({
                  title: '收藏成功',
                  icon: 'none',
                })
                for (let i = 0; i < that.data.dataList.length; i++) {
                  if (that.data.dataList[i].cf_id == cfid) {
                    let isCollection = 'dataList[' + i + '].isCollection';
                    that.setData({
                      [isCollection]: true
                    })
                  }
                }
              }
              that.setData({
                isShouchang: true
              })
            })
          } else {
            app.ajax.req('collection_api_controller/removeCollection', data1, 'GET', function(res) {
              if (parseInt(res.errorCode) === 200) {
                wx.showToast({
                  title: '取消收藏成功',
                  icon: 'none',
                })
                for (let i = 0; i < that.data.dataList.length; i++) {
                  if (that.data.dataList[i].cf_id == cfid) {
                    let isCollection = 'dataList[' + i + '].isCollection';
                    that.setData({
                      [isCollection]: false
                    })
                  }
                }
              }
              that.setData({
                isShouchang: true
              })
            })
          }
        }
      });
    }
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
      dataList: []
    })
    //首次加载帖子
    if (that.data.more1_index == -1) {
      that.show_tiezi(that, 1, '');
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})