// pages/dabaitiao/index.js
import {
  $wuxSelect
} from '../component/index';
const isTel = (value) => !/^1[34578]\d{9}$/.test(value);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    value1: '',
    title1: '',
    value2: '',
    title2: '',
    //所在区域
    options3: [{
      'label': '北京',
      'value': '110000',
      'children': [{
        'label': '北京市',
        'value': '110000',
        'children': [{
          'label': '东城区',
          'value': '110101',
        }],
      }],
    }, {
      'label': '上海',
      'value': '310000',
      'children': [{
        'label': '上海市',
        'value': '310000',
        'children': [{
          'label': '黄浦区',
          'value': '310101',
        }]
      }],
    }],
    title3: '',
    value3: []
  },
  //所在区域
  onOpen3() {
    this.setData({
      visible3: true
    })
  },
  onClose3() {
    this.setData({
      visible3: false
    })
  },
  onChange3(e) {
    this.setData({
      title3: e.detail.options.map((n) => n.label).join('/')
    })
    console.log('onChange3', e.detail)
  },
  onClick1() {
    $wuxSelect('#wux-select1').open({
      value: this.data.value1,
      options: [
        '法官',
        '医生',
        '猎人',
        '学生',
        '记者',
        '其他',
      ],
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            value1: value,
            title1: options[index],
          })
        }
      },
    })
  },
  onClick2() {
    $wuxSelect('#wux-select2').open({
      value: this.data.value2,
      options: [
        '法官',
        '医生',
        '猎人',
        '学生',
        '记者',
        '其他',
      ],
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            value2: value,
            title2: options[index],
          })
        }
      },
    })
  },
  onChange(e) {
    console.log('onChange', e)
    this.setData({
      error: isTel(e.detail.value),
      value: e.detail.value,
    })
  },
  onFocus(e) {
    this.setData({
      error: isTel(e.detail.value),
    })
    console.log('onFocus', e)
  },
  onBlur(e) {
    this.setData({
      error: isTel(e.detail.value),
    })
    console.log('onBlur', e)
  },
  onConfirm(e) {
    console.log('onConfirm', e)
  },
  onClear(e) {
    console.log('onClear', e)
    this.setData({
      error: true,
      value: '',
    })
  },
  onError() {
    wx.showModal({
      title: 'Please enter 11 digits',
      showCancel: !1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})