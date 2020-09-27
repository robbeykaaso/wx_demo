// pages/publish/publish.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: [
      {text: "抽奖活动"},
      {text: "优惠券制作"},
      {text: "其他活动1"},
      {text: "其他活动2"}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */

  bindPublishTap: function() {
    wx.request({
      url: 'http://127.0.0.1:3000/updateVoucherDetail',
      data: {
        "count": 10,
        "voucher_type": 1,
        "voucher_name": "world",
        "name": "action1",
        "valid": 0,
        "start_time": "2006-07-02 08:09:04",
        "end_time": "2006-09-02 08:09:04",
        "home": "hello2",
        "publisher": app.globalData.openid,
        "message": "lalala"
      },
      header:{
        "Content-type": "application/json"
      },
      success: (res)=>{
       
      },
      fail: function(err){
        console.log("fail")
      }
    })
  },

  onLoad: function (options) {

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