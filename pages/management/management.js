// pages/management/management.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    currentChildTab: 0,
    activities: [],
    voucher_own: [
    ],
    voucher_detail: {
      name: "world",
      message: "hello",
      verify_time: null
    },
    enterprise_voucher_detail: {
      name: "world",
      message: "hello"
    },
    listdata: [{
        content: "功能1"
      },
      {
        content: "功能2"
      },
      {
        content: "功能3"
      },
      {
        content: "功能4"
      },
      {
        content: "功能5"
      }
    ],
    userInfo: {},
    enterprises: {},
    voucher_publish: [],
    enterprise_detail: {},
    isEnterprise: false,
    showVoucherDetail: false,
    showEnterpriseDetail: false,
    showSubscribedEnterpriseDetail: false,
    showSubscribedEnterpriseVoucher: false,
    license_image: "",
    leader_image: "",
    enterpriseVoucherDetailStartTime: "",
    enterpriseVoucherDetailEndTime: "",
    enterpriseVoucherDetailImage: "",
    qrImage: app.globalData.server + "/getVoucherQRCode"
  },

  /**
   * 生命周期函数--监听页面加载
   */
   bindDetailTap: function(e){
    wx.request({
      url: app.globalData.server + "/getVoucherDetail",//'https://139.199.62.142:3000/',
      data: {"id": this.data.activities[e.currentTarget.dataset.index].id},
      header:{

      },
      success: (res)=>{
        var detail = res.data
        for (var i in app.globalData.voucher_own)
          if (app.globalData.voucher_own[i].id == detail.id){
            detail["own"] = true
            break
          }
        this.setData({enterprise_voucher_detail: detail, 
                      enterpriseVoucherDetailImage: app.globalData.server + "/" + detail.image,
                      enterpriseVoucherDetailStartTime: detail.start_time.split("T")[0],
                      enterpriseVoucherDetailEndTime: detail.end_time.split("T")[0],
                      showSubscribedEnterprise: false,
                      showSubscribedEnterpriseVoucher: true})
      },
      fail: function(err){
        console.log("fail")
      }
    })
   },
   receive: function(){
    wx.request({
      url: app.globalData.server + "/updateVoucherList",//'https://139.199.62.142:3000/',
      data: {"client": app.globalData.openid,
            "voucher": this.data.enterprise_voucher_detail.id
            },
      header:{

      },
      success: (res)=>{
        if (res.data["err"]){
          //this.setData({showReqResult: true, reqMessage: res.data.msg})
        }else{
          app.globalData.voucher_own.push(this.data.enterprise_voucher_detail)
          this.setData({"enterprise_voucher_detail.own": true, voucher_own: app.globalData.voucher_own})
        }
      },
      fail: function(err){
        console.log("fail")
      }
    })
  },
   licenseChanged: function(e){
    this.setData({license_image: e.detail})
   },
   leaderChanged: function(e){
    this.setData({leader_image: e.detail})
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
   showSubscribedEnterprise: function(e){
    wx.request({
      url: app.globalData.server + "/getVoucherList",//'https://139.199.62.142:3000/',
      data: {enterprise: e.currentTarget.dataset.index},
      header:{
        "Content-type": "application/json"
      },
      success: (res)=>{
        this.setData({"activities": res.data})
      },
      fail: function(err){
        console.log("fail")
      }
    })
     this.setData({showSubscribedEnterpriseDetail: true})
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
   clickChildTab: function (e) {
    if (this.data.currentChildTab === e.target.dataset.current) {
      return false;
     } else {
      this.setData({
        currentChildTab: e.target.dataset.current
       })
     }
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
    if (this.data.license_image == "" || this.data.leader_image == "")
      return
    var pth0 = this.data.license_image, pth1 = this.data.leader_image
    dt["license_img"] = "license/" + app.globalData.openid + "/0" + pth0.substr(pth0.lastIndexOf("."), pth0.length)
    dt["leader_img"] = "leader/" + app.globalData.openid + "/0" + pth1.substr(pth1.lastIndexOf("."), pth1.length)
    wx.request({
      url: app.globalData.server + "/addEnterprise",//'https://139.199.62.142:3000/',
      data: dt,
      header:{

      },
      success: (res)=>{
        wx.uploadFile({
          filePath: this.data.license_image,
          name: dt["license_img"], 
          url: app.globalData.server + "/uploadImage"
        })
        wx.uploadFile({
          filePath: this.data.leader_image,
          name: dt["leader_img"], 
          url: app.globalData.server + "/uploadImage"
        })
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
    this.setData({showVoucherDetail: false, 
                  showEnterpriseDetail: false, 
                  showSubscribedEnterpriseDetail: false,
                  showSubscribedEnterpriseVoucher: false})
  },
  closeChild: function(){
    this.setData({showSubscribedEnterprise: true,
                  showSubscribedEnterpriseVoucher: false})
  },
  bindEnterpriseDetailTap: function(e){
    this.setData({showEnterpriseDetail: true})
  },
  bindVoucherPublishTap:  function(e){
    wx.setStorageSync("voucher_detail", this.data.voucher_publish[e.currentTarget.dataset.index])
    wx.redirectTo({
      url: '../publish/publish'
    })  
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
        this.setData({showVoucherDetail: true, qrImage: app.globalData.server + "/getVoucherQRCode?" + app.globalData.server + "/verifyVoucherQRCode?" + "id=" + res.data.id + "&" + "publisher=" + res.data.publisher + "&" + "client=" + app.globalData.openid})

        wx.connectSocket({
          //url: "wss://127.0.0.1:3000",
          url: "wss://www.robbeykaaso.work:3000",
          success: res => {

          },
          fail: err => {
            console.log("websocket fail");
          }
        })
        wx.onSocketMessage((result) => {
          var dt = JSON.parse(result.data)
          if (dt["type"] == "verify"){
            if (dt["verify_time"]){
              for (var i = 0; i < this.data.voucher_own.length; ++i)
                if (this.data.voucher_own[i].id == this.data.voucher_detail.id){
                  var tar = "voucher_own[" + i + "].verify_time"
                  this.setData({[tar]: dt["verify_time"]})
                  app.globalData.voucher_own = this.data.voucher_own
                  break
                }
              this.setData({"voucher_detail.verify_time": dt["verify_time"]})
            }
          }
        })
        wx.onSocketOpen((result) => {
          console.log("wss connected")
          wx.sendSocketMessage({
            data: '{"type": "who", "id": "' + app.globalData.openid + '"}',//{type: "who", id: app.globalData.openid},
            success: function(e){
            },
            fail: function(e){
              console.log(e)
            },
            complete: function(e){
            }
          })
        })
        wx.onSocketClose((result) => {
          console.log(result)
        })
      },
      fail: function(err){
        console.log("fail")
      }
    })
    
  },
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      isEnterprise: app.globalData.isEnterprise,
    enterprise_detail: app.globalData.enterprise_detail,
    license_image:  app.globalData.server + "/" + app.globalData.enterprise_detail.license_img,
    leader_image:  app.globalData.server + "/" + app.globalData.enterprise_detail.leader_img,
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