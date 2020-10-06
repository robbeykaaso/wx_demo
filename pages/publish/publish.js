// pages/publish/publish.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    voucher_count: 1,
    message: "...",
    voucher_title: "...",
    voucher_type: ["优惠券", "折扣券", "裂变券"],
    used_type: 1,
    start_time: "2020-10-01",
    end_time: "2020-10-02",
    image_source: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  bindStartTimeChange: function(e){
    this.setData({start_time: e.detail.value})
  },
  bindEndTimeChange: function(e){
    this.setData({end_time: e.detail.value})
  },
  typeChanged: function(e){
    this.setData({used_type: e.detail + 1})
  },
  sourceChanged: function(e){
    this.setData({image_source: e.detail})
  },
  countChanged: function(e){
    this.setData({voucher_count: e.detail})
  },
  editTitle: function(e){
    this.setData({voucher_title: e.detail.value})
  },
  editMessage: function(e){
    this.setData({message: e.detail.value})
  },
  bindPublishTap: function() {
    var pth = this.data.image_source
    if (pth == "")
      return
    wx.request({
      url: app.globalData.server + "/updateVoucherDetail",
      data: {
        count: this.data.voucher_count,
        voucher_type: this.data.used_type,
        voucher_name: this.data.voucher_type[this.data.used_type - 1],
        name: this.data.voucher_title,
        valid: app.globalData.isEnterprise,
        start_time: this.data.start_time + " 00:00:00",
        end_time: this.data.end_time + " 23:59:59",
        image: "voucher/" + app.globalData.openid + "/" + pth.substr(pth.lastIndexOf("."), pth.length),
        publisher: app.globalData.openid,
        message: this.data.message
      },
      header:{
        "Content-type": "application/json"
      },
      success: (res)=>{
        wx.uploadFile({
          filePath: this.data.image_source,
          name: res.data["path"], 
          url: app.globalData.server + "/uploadVoucherImage"
        })
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