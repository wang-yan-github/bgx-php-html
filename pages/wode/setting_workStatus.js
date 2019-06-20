let app = getApp();
Page({
  data: {
    value1: '0',
    selectValue: 1
  },
  onChange(field, e) {
    this.setData({
      [field]: e.detail.value,
      selectValue: e.detail.value
    })

    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  onChange1(e) {
    this.onChange('value1', e)
  },
  formSubmit(e) {
    let data = {};
    data.token = app.globalData.token;
    data.status = this.data.selectValue
    app.ajax.req('public_api_controller/setWorkedStatus', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '修改工作状态成功',
          icon: 'none'
        })
      }
    })
  },
})