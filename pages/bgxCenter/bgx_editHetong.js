var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    time: '',
    images: [],
    fankui: '',
    bid: -1,
    wpid: -1,
    //合同
    fileList: [],
    accessKey: '',
    fileUrl: '',
    formData: {},
    type_: null,
  },
  //图片上传
  onChange(e) {
    console.log('onChange', e);
    const {
      file
    } = e.detail
    if (file.status === 'uploading') {
      this.setData({
        progress: 0
      })
      wx.showLoading();
    } else if (file.status === 'done') {
      this.setData({
        imageUrl: file.url
      })
    }
  },
  onSuccess(e) {
    console.log('onSuccess', e);
  },
  onFail(e) {
    console.log('onFail', e);
    wx.showToast({
      title: '上传失败',
    })
  },
  onComplete(e, index) {
    console.log('onComplete', e);
    if (parseInt(e.detail.statusCode) !== 200) {
      wx.showToast({
        title: '上传失败',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '上传完成',
        icon: 'none'
      })
      var data = {};
      data.uid = app.globalData.uploadUrl + '' + this.data.formData.key;
      data.status = 'done';
      data.url = app.globalData.uploadUrl + '' + this.data.formData.key + '?x-oss-process=style/thumb';
      data.originalUrl = app.globalData.uploadUrl + '' + this.data.formData.key + '?x-oss-process=style/original';
      this.setData({
        fileList: this.data.fileList.concat(data)
      })
      let that = this;
      app.getQianming(that, 'bgx');
    }
    wx.hideLoading();
  },
  onPreview(e) {
    console.log('onPreview', e)
    const {
      file,
      fileList
    } = e.detail
    wx.previewImage({
      current: file.uid,
      urls: fileList.map((n) => n.uid),
    })
  },
  onRemove(e) {
    console.log('onRemove', e)
    var that = this;
    const {
      file,
      fileList
    } = e.detail
    that.setData({
      fileList: fileList.filter((n) => n.uid !== file.uid)
    })
  },
  //上传合同
  editSubmit: function() {
    var that = this;
    //非空判断
    if (that.data.fileList.length == 0) {
      wx.showToast({
        title: '请先上传合同再提交',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '上传中',
    })
    var data = {};
    data.token = app.globalData.token;
    //对图片进行处理
    let imgArr = [];
    for (let i = 0; i < that.data.fileList.length; i++) {
      imgArr.push(that.data.fileList[i].uid);
    }
    data.ht_url = imgArr.join(',');
    if (that.data.type_ == 1) { //1为劳务公司的项目合同，2为劳务公司的劳务合同
      data.type = 9;
    } else if (that.data.type_ == 2) {
      data.type = 11;
    } else {
      data.type = null;
    }
    data.wp_id = that.data.wpid;
    app.ajax.req('contract_api_controller/workerContract', data, 'GET', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '上传成功',
          duration: 1000
        })
        setTimeout(function() {
          wx.navigateBack();
        }, 1500)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.getQianming(that, 'bgx');
    that.setData({
      wpid: options.wpid,
      type_: options.type_,
      fileUrl: app.globalData.url + 'upload_api_controller/pUpload'
    })
    var bid = options.bid;
    var data = {};
    data.token = app.globalData.token;
    data.b_id = bid;
    if (that.data.type_ == 1) { //1为包工侠的项目合同，2为包工侠的劳务合同
      data.type = 9;
    } else if (that.data.type_ == 2) {
      data.type = 11;
    } else {
      data.type = '';
    }
    app.ajax.req('contract_api_controller/contractLook', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        that.setData({
          name: res.data.HtName,
          time: res.data.UpTime,
          images: res.data.imgs,
          fankui: res.data.HtContent
        })
      }
    });
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