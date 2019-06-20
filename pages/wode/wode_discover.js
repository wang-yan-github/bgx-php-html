// pages/discover/discover.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //更多
    isMore: true,
    zhankai1: '',
    dianzan: false,
    shoucang: false,
    //帖子列表
    dataList: [],
    more1: [{
      image: '/pages/images/zgzh.png',
      name: '招工找活',
      describe: '招工人找活儿'
    }, {
      image: '/pages/images/gfzq.png',
      name: '官方专区',
      describe: '包工侠最新活动'
    }, {
      image: '/pages/images/essc.png',
      name: '二手市场',
      describe: '处理闲置，遇见想要的'
    }, {
      image: '/pages/images/jswd.png',
      name: '技术问答',
      describe: '学习知识，提高技能'
    }, {
      image: '/pages/images/bgt.png',
      name: '曝光台',
      describe: '让丑恶无处遁形'
    }, {
      image: '/pages/images/sgaq.png',
      name: '施工安全',
      describe: '安全第一，文明施工'
    }, {
      image: '/pages/images/yqkmn.png',
      name: '一起看美女',
      describe: '生活中处处都有美'
    }, {
      image: '/pages/images/jxm.png',
      name: '家乡美',
      describe: '家乡风景最迷人'
    }],
    //选中话题索引
    more1_index: -1,
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
    isDianzan: true,
    isShouchang: true,
    del: false
  },
  //删除帖子
  discover_del: function(e) {
    let that = this;
    wx.showModal({
      title: '删除提醒',
      content: '注意：这个操作不可逆',
      confirmText: "确认删除",
      cancelText: "返回",
      success: function(res) {
        console.log(res);
        if (res.confirm) {
          let data = {};
          data.token = app.globalData.token;
          data.cf_id = e.currentTarget.dataset.cfid;
          app.ajax.req('circle_friends_api_controller/remove', data, 'POST', function(res) {
            if (Number.parseInt(res.errorCode) === 200) {
              wx.showToast({
                title: '删除成功',
                icon: 'none'
              })
              that.onLoad();
            }
          });
        } else {
          // console.log('用户点击辅助操作')
        }
      }
    });
  },
  //帖子分享
  onShareAppMessage: function(res) {
    wx.showToast({
      title: '暂时不能分享',
      icon: 'none'
    })
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    // return {
    //   title: '包工侠',
    //   // path: '/page/user?id=123'
    // }
  },
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
            wx.redirectTo({
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
        app.ajax.req('circle_friends_api_controller/commentArticle', data, 'GET', function(res) {
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
    wx.showLoading({
      title: '加载中',
    })
    var data = {};
    data.token = app.globalData.token;
    data.offset = offset;
    data.limit = 6;
    data.topic = topic;
    app.ajax.req('circle_friends_api_controller/roleFriendsLists', data, 'GET', function(res) {
      wx.hideLoading();
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
            isbottom: true
          })
        } else {
          that.setData({
            isTopfresh: false,
            isbottom: true
          })
        }
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
    }, 300)

  },
  fabu: function() {
    wx.navigateTo({
      url: 'discover_fabu',
    })
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

  pinglun: function() {
    this.setData({
      pinglun: !this.data.pinglun
    })
  },

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
      //查询点赞状态
      that.isFollow(that, cfid);
    }
  },

  shoucang: function(e) {
    wx.showToast({
      title: '不能收藏自己的帖子',
      icon: 'none'
    })
    var that = this;
    // if (!that.data.isShouchang) {
    //   wx.showToast({
    //     title: '操作过于频繁',
    //     icon: 'none'
    //   })
    //   return false;
    // }
    // //锁定控件
    // that.setData({
    //   isShouchang: false
    // })
    // //查询收藏状态
    // if (!app.globalData.token) {
    //   wx.showModal({
    //     title: '登录提醒',
    //     content: '您还未登录，不能查看详细',
    //     confirmText: "登录",
    //     cancelText: "返回",
    //     success: function(res) {
    //       console.log(res);
    //       if (res.confirm) {
    //         wx.redirectTo({
    //           url: '../login/login',
    //         })
    //       } else {
    //         // console.log('用户点击辅助操作')
    //       }
    //     }
    //   });
    // } else {
    //   //查询收藏状态
    //   let data = {};
    //   let cfid = e.currentTarget.dataset.cfid;
    //   data.token = app.globalData.token;
    //   data.c_Id = cfid;
    //   app.ajax.req('collection_api_controller/collectionIs', data, 'GET', function(res) {
    //     if (parseInt(res.errorCode) === 200) {
    //       that.setData({
    //         shoucang: res.data.isCollection
    //       })
    //       var data1 = {};
    //       data1.token = app.globalData.token;
    //       data1.c_Id = cfid;
    //       if (!that.data.shoucang) { //收藏
    //         app.ajax.req('collection_api_controller/collectionSave', data1, 'GET', function(res) {
    //           if (parseInt(res.errorCode) === 200) {
    //             wx.showToast({
    //               title: '收藏成功',
    //               icon: 'none',
    //             })
    //           }
    //           that.setData({
    //             isShouchang: true
    //           })
    //         })
    //       } else {
    //         app.ajax.req('collection_api_controller/removeCollection', data1, 'GET', function(res) {
    //           if (parseInt(res.errorCode) === 200) {
    //             wx.showToast({
    //               title: '取消收藏成功',
    //               icon: 'none',
    //             })
    //           }
    //           that.setData({
    //             isShouchang: true
    //           })
    //         })
    //       }
    //     }
    //   });
    // }
  },
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
  isHide: function() {
    this.setData({
      isMore: !this.data.isMore
    })
  },
  more: function() {
    this.setData({
      isMore: !this.data.isMore
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (that.data.more1_index == -1) {
      that.show_tiezi(that, 1, '');
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
    var that = this;
    that.setData({
      dataList: [],
      offset: 1,
      more1_index: -1,
      isbottom: false,
      isbottomfresh: true
    })
    that.onLoad();
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 3000);
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
        var topic = that.data.more1[that.data.more1_index].name;
        that.show_tiezi(that, that.data.offset + 1, topic);
        that.setData({
          offset: that.data.offset + 1
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})