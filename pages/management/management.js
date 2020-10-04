// pages/management/management.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    cards: [
    ],
    voucher_detail: {
      name: "world",
      message: "hello",
      verify_time: null
    },
    enterprise_detail: {
      name: "hello",
      address: "hello@sina.com",
      phone: 123456789,
      license_id: 12121212,
      license_img: "hello.png",
      leader_id: 21212121,
      leader_img: "hello"
    },
    isEnterprise: false,
    showVoucherDetail: false,
    showEnterpriseDetail: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  swiperTab: function (e) {
    var that = this;
    that.setData({
     currentTab: e.detail.current
    });
   },
   //点击切换
   clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
     return false;
    } else {
     that.setData({
      currentTab: e.target.dataset.current
     })
    }
   },

  use: function(){
    this.setData({showVoucherDetail: false})
  },
  register: function(){
    wx.request({
      url: 'http://127.0.0.1:3000/addEnterprise',//'https://139.199.62.142:3000/',
      data: {id: app.globalData.openid, 
             name: "hello",
             address: "hello@sina.com",
             phone: 123456789,
             license_id: 1212121212,
             leader_id: 2121212121},
      header:{

      },
      success: (res)=>{
        this.bindEnterpriseDetailTap()     
      },
      fail: function(err){
        console.log("fail")
      }
    })
  },
  close: function(){
    this.setData({showVoucherDetail: false, showEnterpriseDetail: false})
  },
  bindEnterpriseDetailTap: function(e){
    wx.request({
      url: 'http://127.0.0.1:3000/getEnterpriseDetail',//'https://139.199.62.142:3000/',
      data: {"id": app.globalData.openid},
      header:{

      },
      success: (res)=>{
        var detail = res.data
        for (var i in app.globalData.voucher_own)
          if (app.globalData.voucher_own[i].id == detail.id){
            detail["own"] = true
            break
          }
        if (res.data["err"])
          this.setData({enterprise_detail: {}, isEnterprise: false})  
        else
          this.setData({enterprise_detail: res.data, isEnterprise: true})   
      },
      fail: function(err){
        console.log("fail")
      }
    })
    this.setData({showEnterpriseDetail: true})
  },
  bindVoucherDetailTap: function(e){
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
        this.setData({showVoucherDetail: true})
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