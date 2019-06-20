//获取应用实例
var tcity = require("../../utils/citys.js");
var app = getApp()
Page({
  data: {
    //禁用控件
    isDisabled: false,
    isDisabled2: false,
    //省市区
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    //省市
    condition2: false,
    provinces2: [],
    province2: "",
    citys2: [],
    city2: "",
    countys2: [],
    county2: '',
    value2: [0, 0],
    values2: [0, 0]
  },
  //省市区
  bindChange: function(e) {
    var val = e.detail.value
    var t = this.data.values;
    var cityData = tcity.init();
    console.log(cityData);
    if (val[0] != t[0]) {
      const citys = [];
      const countys = [];
      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push({
          name: cityData[val[0]].sub[i].name,
          code: cityData[val[0]].sub[i].code
        })
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push({
          name: cityData[val[0]].sub[0].sub[i].name,
          code: cityData[val[0]].sub[0].sub[i].code
        })
      }

      this.setData({
        province: this.data.provinces[val[0]],
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
      console.log('city no');
      const countys = [];
      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push({
          name: cityData[val[0]].sub[val[1]].sub[i].name,
          code: cityData[val[0]].sub[val[1]].sub[i].code
        })
      }

      this.setData({
        city: this.data.citys[val[1]],
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
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }
  },
  //省市
  bindChange2: function(e) {
    var val = e.detail.value
    var t = this.data.values2;
    var cityData = tcity.init();
    if (val[0] != t[0]) {
      console.log('province2 no ');
      const citys2 = [];
      const countys2 = [];
      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys2.push({
          name: cityData[val[0]].sub[i].name,
          code: cityData[val[0]].sub[i].code
        })
      }

      this.setData({
        province2: this.data.provinces2[val[0]],
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
      console.log('city2 no');
      this.setData({
        city2: this.data.citys2[val[1]],
        values2: val,
        value2: [val[0], val[1]]
      })
      return;
    }
  },
  open: function() {
    this.setData({
      condition: !this.data.condition
    })
  },
  open2: function() {
    this.setData({
      condition2: !this.data.condition2
    })
  },
  open3: function () {
    this.setData({
      condition2: !this.data.condition2
    })
  },
  onLoad: function() {
    var that = this;
    var cityData = tcity.init();
    const provinces = [];
    const citys = [];
    const countys = [];
    const provinces2 = [];
    const citys2 = [];
    for (let i = 0; i < cityData.length; i++) {
      provinces.push({
        name: cityData[i].name,
        code: cityData[i].code
      });
    }
    for (let i = 0; i < cityData.length; i++) {
      provinces2.push({
        name: cityData[i].name,
        code: cityData[i].code
      });
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push({
        name: cityData[0].sub[i].name,
        code: cityData[0].sub[i].code
      })
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys2.push({
        name: cityData[0].sub[i].name,
        code: cityData[0].sub[i].code
      })
    }
    console.log('city完成');
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
      },

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
    console.log('初始化完成');
  }
})