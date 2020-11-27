// pages/coachs/coachs.js
var api = require("../api")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    beginCity: "",
    endCity: "",
    resultList: [],
    errorMsg: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var ret = await api.requestCoachList(options.beginCity, options.endCity)
    console.log(ret)
    //console.log(options.leaveDate)
    if (ret['status']){
      this.setData({beginCity: options.beginCity, 
                    endCity: options.endCity,
                    errorMsg: ret['msg']})
    }else
      this.setData({beginCity: options.beginCity,
                    endCity: options.endCity,
                    resultList: ret['result']})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})