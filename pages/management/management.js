// pages/management/management.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    voucher_own: [
    ],
    voucher_detail: {
      name: "world",
      message: "hello",
      verify_time: null
    },
    enterprises: {},
    voucher_publish: [],
    enterprise_detail: {},
    isEnterprise: false,
    showVoucherDetail: false,
    showEnterpriseDetail: false,
    qrImage: "http://127.0.0.1:3000/getVoucherQRCode"
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
   updateEnterprises: function(){
    wx.request({
      url: 'http://127.0.0.1:3000/getSubscribedEnterprises',//'https://139.199.62.142:3000/',
      data: {"client": app.globalData.openid},
      header:{
        "Content-type": "application/json"
      },
      success: (res)=>{
        this.setData({enterprises: res.data})
      },
      fail: function(err){
        console.log("fail")
      }
    })
   },
   unsubscribeEnterprise: function(e){
    wx.request({
      url: 'http://127.0.0.1:3000/addSubscription',
      data: {enterprise: e.currentTarget.dataset.index,
             del: true},
      success: (res)=>{
        this.updateEnterprises()
      },
      fail: function(err){
        console.log("fail")
      }
    })
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
     if (e.target.dataset.current == 0){
      /*wx.request({
        url: 'http://127.0.0.1:3000/getVoucherList',//'https://139.199.62.142:3000/',
        data: {"client_own": app.globalData.openid},
        header:{
          "Content-type": "application/json"
        },
        success: (res)=>{
          app.globalData.voucher_own = res.data
          this.setData({voucher_own: res.data})
        },
        fail: function(err){
          console.log("fail")
        }
      })*/
     }else if (e.target.dataset.current == 1){
       this.updateEnterprises()
     }else if (e.target.dataset.current == 2){
      wx.request({
        url: 'http://127.0.0.1:3000/getVoucherList',//'https://139.199.62.142:3000/',
        data: {"client_publish": app.globalData.openid},
        header:{
          "Content-type": "application/json"
        },
        success: (res)=>{
          this.setData({voucher_publish: res.data})
        },
        fail: function(err){
          console.log("fail")
        }
      })
     }

    }
   },
  register: function(){
    var dt = {id: app.globalData.openid, 
      name: "hello",
      address: "hello@sina.com",
      phone: 123456789,
      license_id: 1212121212,
      leader_id: 2121212121}
    wx.request({
      url: 'http://127.0.0.1:3000/addEnterprise',//'https://139.199.62.142:3000/',
      data: dt,
      header:{

      },
      success: (res)=>{
        app.globalData.isEnterprise = true
        app.globalData.enterprise_detail = dt
        this.onLoad()
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
    this.setData({showEnterpriseDetail: true})
  },
  bindVoucherPublishTap:  function(e){

  },
  bindVoucherDetailTap: function(e){
    wx.request({
      url: 'http://127.0.0.1:3000/getVoucherDetail',//'https://139.199.62.142:3000/',
      data: {"id": this.data.voucher_own[e.currentTarget.dataset.index].id},
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
        this.setData({showVoucherDetail: true, qrImage: "http://127.0.0.1:3000/getVoucherQRCode?id=" + res.data.id})
      },
      fail: function(err){
        console.log("fail")
      }
    })
    
  },
  onLoad: function (options) {
    this.setData({isEnterprise: app.globalData.isEnterprise,
    enterprise_detail: app.globalData.enterprise_detail,
    voucher_own: app.globalData.voucher_own})
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