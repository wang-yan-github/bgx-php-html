var http = require('http.js');

function init() {
  if (wx.getStorageSync("cityData")) {
    return wx.getStorageSync("cityData");
  }
  let data = '';
  wx.showLoading({
    title: '加载中',
  })
  http.req('region_api_controller/regionList', data, 'POST', function(res) {
    wx.hideLoading();
    if (parseInt(res.errorCode) == 200) {
      //第一次访问缓存
      try {
        var obj = {
          name: '省',
          code: -1,
          sub: [{
            name: '市',
            code: -1,
            sub: [{
              name: '区',
              code: -1,
              sub: []
            }]
          }]
        }
        var citys = res.data;
        citys.unshift(obj);
        wx.setStorageSync('cityData', citys);
      } catch (e) {
        wx.showToast({
          title: "缓存区域地址失败",
          icon: 'none',
          duration: 2000
        })
      }
      //第一次返回
      return wx.getStorageSync("cityData");
    }
  })
}
module.exports = {
  init: init
}