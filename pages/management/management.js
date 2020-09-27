// pages/management/management.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards: [
    ],
    voucher_detail: {
      name: "world",
      message: "hello",
      verify_time: null
    },
    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  use: function(){
    this.setData({showModal: false})
  },
  close: function(){
    this.setData({showModal: false})
  },
  bindDetailTap: function(e){
    wx.request({
      url: 'http://127.0.0.1:3000/getVoucherDetail',//'https://139.199.62.142:3000/',
      data: {"id": this.data.cards[e.currentTarget.dataset.index].id},
      header:{

      },
      success: (res)=>{
        var detail = res.data
        for (var i in app.globalData.voucher_own)
          if (app.globalData.voucher_own[i].id == detail.id){
            detail["own"] = true
            break
          }
        this.setData({voucher_detail: res.data})
        this.setData({showModal: true})
      },
      fail: function(err){
        console.log("fail")
      }
    })
    
  },
  onLoad: function (options) {
    this.setData({"cards": app.globalData.voucher_own})
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