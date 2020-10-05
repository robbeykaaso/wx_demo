// pages/publish/publish.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    voucher_count: 1,
    message: "...",
    voucher_title: "..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  increase: function(){
    this.setData({voucher_count: this.data.voucher_count + 1})
  },
  descrease: function(){
    this.setData({voucher_count: Math.max(1, this.data.voucher_count - 1)})
  },
  editTitle: function(e){
    this.setData({voucher_title: e.detail.value})
  },
  editCount: function(e){
    var cnt = parseInt(e.detail.value)
    cnt = cnt == e.detail.value ? Math.max(1, cnt) : 1
    this.setData({voucher_count: cnt})
  },
  editMessage: function(e){
    this.setData({message: e.detail.value})
  },
  bindPublishTap: function() {
    wx.request({
      url: 'http://127.0.0.1:3000/updateVoucherDetail',
      data: {
        count: this.data.voucher_count,
        voucher_type: 1,
        voucher_name: "world",
        name: this.data.voucher_title,
        valid: app.globalData.isEnterprise,
        start_time: "2006-07-02 08:09:04",
        end_time: "2006-09-02 08:09:04",
        home: "hello2",
        publisher: app.globalData.openid,
        message: this.data.message
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