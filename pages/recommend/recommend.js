// pages/recommend/recommend.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: [],
    voucher_detail: {
      name: "world",
      message: "hello",
      own: 1
    },
    showVoucherDetail: false,
    showReqResult: false,
    reqMessage: "",
    voucherDetailImage: "",
    voucherDetailStartTime: "",
    voucherDetailEndTime: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  receive: function(){
    wx.request({
      url: app.globalData.server + "/updateVoucherList",//'https://139.199.62.142:3000/',
      data: {"client": app.globalData.openid,
            "voucher": this.data.voucher_detail.id
            },
      header:{

      },
      success: (res)=>{
        if (res.data["err"]){
          this.setData({showReqResult: true, reqMessage: res.data.msg})
        }else{
          this.setData({"voucher_detail.own": true})
          app.globalData.voucher_own.push(this.data.voucher_detail)
        }
      },
      fail: function(err){
        console.log("fail")
      }
    })
  },
  getScancode: function(){
    wx.scanCode({
      success: (res) => {
        wx.request({
          url: "http://" + res.result,
          data: {scanner: app.globalData.openid},
          success: (res)=>{
            this.setData({showReqResult: true, reqMessage: res.data.msg})
          },
          fail: function(err){
            console.log("fail")
          }
        })
      }
    })
  },
  close: function(){
    this.setData({showVoucherDetail: false, showReqResult: false})
  },
  subscribeEnterprise: function(){
    wx.request({
      url: app.globalData.server + "/addSubscription",
      data: {client: app.globalData.openid,
            enterprise: this.data.voucher_detail.publisher},
      success: (res)=>{

      },
      fail: function(err){
        console.log("fail")
      }
    })
  },
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
        this.setData({voucher_detail: detail, 
                      voucherDetailImage: app.globalData.server + "/" + detail.image,
                      voucherDetailStartTime: detail.start_time.split("T")[0],
                      voucherDetailEndTime: detail.end_time.split("T")[0]})
        wx.request({
          url: app.globalData.server + "/getEnterpriseDetail",//'https://139.199.62.142:3000/',
          data: {"id": res.data["publisher"]},
          header:{
    
          },
          success: (res)=>{
            detail["publishername"] = res.data["name"]
            this.setData({showVoucherDetail: true, voucher_detail: detail})
          },
          fail: function(err){
            console.log("fail")
          }
        })
      },
      fail: function(err){
        console.log("fail")
      }
    })
    
  },
  updateVoucherList: function(){
    //get user detail
    wx.request({
      url: app.globalData.server + "/getEnterpriseDetail",//'https://139.199.62.142:3000/',
      data: {id: app.globalData.openid},
      header:{

      },
      success: (res)=>{
        if (res.data["err"])
          app.globalData.isEnterprise = false
        else{
          app.globalData.isEnterprise = true
          app.globalData.enterprise_detail = res.data
        }   
      },
      fail: function(err){
        app.globalData.isEnterprise = false
      }
    })
    //get voucherlist recommended
    wx.request({
      url: app.globalData.server + "/getVoucherList",//'https://139.199.62.142:3000/',
      data: {client_subscription: app.globalData.openid},
      header:{
        "Content-type": "application/json"
      },
      success: (res)=>{
        this.setData({"activities": res.data})

        wx.request({
          url: app.globalData.server + "/getVoucherList",//'https://139.199.62.142:3000/',
          data: {client: app.globalData.openid},
          header:{
    
          },
          success: (res)=>{
            var cnt = this.data.activities.length
            for (var i in res.data)
              if (res.data[i].valid){
                var tmp = "activities[" + cnt + "]"
                this.setData({[tmp]: res.data[i]})
                cnt++
              }
          },
          fail: function(err){
            console.log("fail")
          }
        })
            //var tmp = "activities[1]"
            //this.setData({[tmp]: {"name": "world"}})
        //console.log(app.globalData.openid)
        //var tmp = "activities[1]"
        //this.setData({[tmp]: {"name": "world"}})
      },
      fail: function(err){
        console.log("fail")
      }
    })
    //get voucherlist owned
    wx.request({
      url: app.globalData.server + "/getVoucherList",//'https://139.199.62.142:3000/',
      data: {"client_own": app.globalData.openid},
      header:{
        "Content-type": "application/json"
      },
      success: (res)=>{
        app.globalData.voucher_own = res.data
      },
      fail: function(err){
        console.log("fail")
      }
    })
  },
  getUnionID: function(aRes){

  },
  onLoad: function (options) {
    app.globalData.server = "http://127.0.0.1:3000"
    if (!app.globalData.openid){
      app.userIDReadyCallback = res => {
        this.updateVoucherList()
      }
    }else
      this.updateVoucherList()
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