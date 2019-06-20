var root1 = 'http://118.24.66.77:8080/'; //测试
var root2 = 'http://192.168.0.107:8080/'; //本地
var root3 = 'https://www.baogongxia.com/'; //部署
var root = root3;

function req(url, data, method, cb) {
  wx.request({
    url: root + url,
    data: data,
    method: method,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      if (parseInt(res.data.errorCode) === 201) {
        wx.showModal({
          title: '登录超时',
          content: '请重新登录',
          confirmText: "重新登录",
          cancelText: "返回",
          success: function(res) {
            console.log(res);
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login'
              })
            } else {
              console.log('用户点击辅助操作')
            }
          }
        });
      } else if (parseInt(res.data.errorCode) !== 200) {
        wx.showToast({
          title: '哎哟！网络出问题了',
          icon: 'none'
        })
      }
      return typeof cb == "function" && cb(res.data);
    },
    fail: function() {
      return typeof cb == "function" && cb(false);
    }
  })
}
module.exports = {
  req: req,
  url: root
}