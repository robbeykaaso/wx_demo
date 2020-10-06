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
    qrImage: app.globalData.server + "/getVoucherQRCode"
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
      url: app.globalData.server + "/getSubscribedEnterprises",//'https://139.199.62.142:3000/',
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
      url: app.globalData.server + "/addSubscription",
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
        url: app.globalData.server + "/getVoucherList",//'https://139.199.62.142:3000/',
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
        url: app.globalData.server + "/getVoucherList",//'https://139.199.62.142:3000/',
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
    var dt = this.data.enterprise_detail
    dt["id"] = app.globalData.openid 
    wx.request({
      url: app.globalData.server + "/addEnterprise",//'https://139.199.62.142:3000/',
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
  bindSetLeaderID: function(e){
    this.setData({"enterprise_detail.leader_id": e.detail.value})
  },
  bindSetLicenseID: function(e){
    this.setData({"enterprise_detail.license_id": e.detail.value})
  },
  bindSetPhone: function(e){
    this.setData({"enterprise_detail.phone": e.detail.value})
  },
  bindSetName: function(e){
    this.setData({"enterprise_detail.name": e.detail.value})
  },
  bindSetAddress: function(e){
    this.setData({"enterprise_detail.address": e.detail.value})
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
      url: app.globalData.server + "/getVoucherDetail",//'https://139.199.62.142:3000/',
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
        this.setData({showVoucherDetail: true, qrImage: app.globalData.server + "/getVoucherQRCode?id=" + res.data.id + "&" + "publisher=" + res.data.publisher + "&" + "client=" + app.globalData.openid})
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