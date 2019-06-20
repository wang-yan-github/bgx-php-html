var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    year: new Date().getFullYear(), // 年份
    month: new Date().getMonth() + 1, // 月份
    day: new Date().getDate(),
    days_style: [],
    dateIsShow: false,
    wid:  -1,
    wpid: -1,
    name: '',
    time: '',
    content: ''
  },
  xuanyan: function (res, currentMonth){
    var that = this;
    //开始施工的年月日
    var workTime = res.data.constructionDate.split('-');
    var year = workTime[0];
    var month = workTime[1];
    var day = workTime[2];
    //当前月的天数
    var tianshu = that.mGetDate(that.data.year, currentMonth);
    if (parseInt(year) < that.data.year) { //施工的年份小于现在的年份

    } else { //施工的年份等于现在的年份
      if (parseInt(month) < currentMonth) { //施工的月份小于当前的月份
        //这一月从1号渲染
        for (var i = 0; i < that.data.day; i++) { //循环当月的天数
          var list = res.data.list;
          for (var j = 0; j < list.length; j++) {
            if (parseInt(list[j].log_time.split('-')[2]) == i + 1) {
              var color = list[j].status;
              if (color == 1) {
                color = "red";
              } else {
                color = "green";
              }
              that.data.days_style.push({
                month: 'current',
                day: i + 1,
                color: 'white',
                background: color
              });
              that.setData({
                days_style: that.data.days_style
              })
              break;
            } else {
              if (parseInt(list[j].log_time.split('-')[2]) > i + 1) {
                that.data.days_style.push({
                  month: 'current',
                  day: i + 1,
                  color: 'white',
                  background: "gray"
                });
                that.setData({
                  days_style: that.data.days_style
                });
                break;
              }
            }
          }
        }
      } else { //施工的月份等于当前的月份
        //这一月从开始天数开始渲染
        for (var i = day - 1; i < tianshu; i++) { //循环当月的天数
          var list = res.data.list;
          for (var j = 0; j < list.length; j++) {
            if (parseInt(list[j].log_time.split('-')[2]) == i + 1) {
              var color = list[j].status;
              if (color == 1) {
                color = "red";
              } else {
                color = "green";
              }
              that.data.days_style.push({
                month: 'current',
                day: i + 1,
                color: 'white',
                background: color
              });
              that.setData({
                days_style: that.data.days_style
              })
              break;
            } else {
              if (parseInt(list[j].log_time.split('-')[2]) > i + 1) {
                that.data.days_style.push({
                  month: 'current',
                  day: i + 1,
                  color: 'white',
                  background: "gray"
                });
                that.setData({
                  days_style: that.data.days_style
                });
                break;
              }
            }
          }
        }
      }
    }
  },
  showCalendar: function() {
    this.setData({
      dateIsShow: !this.data.dateIsShow
    })
    
  },
  next: function(event) {
    var that = this;
    that.setData({
      days_style: []
    })
    var wid = that.data.wid;
    var wpid = that.data.wpid;
    var year = event.detail.currentYear;
    var month = event.detail.currentMonth;
    var data = {};
    data.token = app.globalData.token;
    data.w_pid = wpid;
    data.w_id = wid;
    data.date = year + '-' + month + '-' + 1;
    app.ajax.req('log_api_controller/bgxloginfo', data, 'GET', function (res) {
      if (parseInt(res.errorCode) === 200) {
        if(res.data.list.length == 0){
          wx.showToast({
            title: '当前月份没有日志',
            icon: 'none',
            duration: 3000
          })
          return;
        }
        that.xuanyan(res, month);
      }
    })

  },
  prev: function(event) {
    var that = this;
    that.setData({
      days_style: []
    })
    var wid = that.data.wid;
    var wpid = that.data.wpid;
    var year = event.detail.currentYear;
    var month = event.detail.currentMonth;
    var data = {};
    data.token = app.globalData.token;
    data.w_pid = wpid;
    data.w_id = wid;
    data.date = year+'-'+month +'-'+ 1;
    app.ajax.req('log_api_controller/bgxloginfo', data, 'GET', function (res) {
      if (parseInt(res.errorCode) === 200) {
        if (res.data.list.length == 0) {
          wx.showToast({
            title: '当前月份没有日志',
            icon: 'none',
            duration: 3000
          })
          return;
        }
        that.xuanyan(res, month);
      }
    })

  },
  dateChange: function(event) {
    console.log(event.detail);
    var that = this;
    that.setData({
      days_style: []
    })
    var wid = that.data.wid;
    var wpid = that.data.wpid;
    var year = event.detail.currentYear;
    var month = event.detail.currentMonth;
    var data = {};
    data.token = app.globalData.token;
    data.w_pid = wpid;
    data.w_id = wid;
    data.date = year + '-' + month + '-' + 1;
    app.ajax.req('log_api_controller/bgxloginfo', data, 'GET', function (res) {
      if (parseInt(res.errorCode) === 200) {
        if (res.data.list.length == 0) {
          wx.showToast({
            title: '当前月份没有日志',
            icon: 'none',
            duration: 3000
          })
          return;
        }
        that.xuanyan(res, month);
      }
    })
  },
  dayClick: function(event) {
    var that =this;
    var year = event.detail.year;
    var month = event.detail.month;
    var day = event.detail.day;
    var data ={};
    data.token = app.globalData.token;
    data.log_time = year+'-'+month+'-'+day;
    data.w_pid = that.data.wpid; 
    app.ajax.req('log_api_controller/loginfo',data,'GET',function(res){
       if(parseInt(res.errorCode) !== 200){
         wx.showToast({
           title: "没有日志可查看",
           icon: 'none',
           duration: 3000
         })
       }else{
         that.setData({
           name: res.data.name,
           time: res.data.log_time,
           content: res.data.log_text,
           dateIsShow: !that.data.dateIsShow
         })
       }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  mGetDate: function(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
  },
  onLoad: function(options) {
    var that = this;
    var wid = options.wid;
    var wpid = options.wpid;
    that.setData({
      wid: wid,
      wpid: wpid
    })
    var year = that.data.year;
    var month = that.data.month;
    var day = that.data.day;
    var data = {};
    data.token = app.globalData.token;
    data.w_pid = wpid;
    data.w_id = wid;
    app.ajax.req('log_api_controller/bgxloginfo', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        that.xuanyan(res,that.data.month);
      }
    })
  },
})