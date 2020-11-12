//领取卡券数量未更新
//分页加载列表组件提取
//扫码优化
// pages/recommend/recommend.js
const rea = require("../rea.js")

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: [],
    activities_show: [],
    showindex: 0,
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
  lower: function(){
    var cnt = this.data.showindex
    var cnt0 = 0
    var entries = this.data.activities
    var new_show = []
    for (var i = cnt; i < entries.length; ++i){
      cnt = parseInt(i) + 1
      if (entries[i].valid){
        new_show.push(entries[i])
        cnt0++
      }
      if (cnt0 > 5)
        break
    }
    var showed = this.data.activities_show
    this.setData({showindex: cnt})
    if (cnt <= entries.length){
      wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
        title: '加载中',
        icon: 'loading',
      });
      setTimeout(() => {
        this.setData({
          activities_show: showed.concat(new_show)
        });
        wx.hideLoading();
      }, 500)
    }else{
      wx.showToast({
        title: "到底啦",
        icon: "success",
        duration: 500
      })
    }
  },
  receive: function(){
    rea.run("receiveVoucher", {})
  },
  getScancode: function(){
    wx.scanCode({
      success: (res) => {
        wx.request({
          url: res.result,
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
  closeMsg: function(){
    this.setData({showReqResult: false})
  },
  subscribeEnterprise: function(){
    rea.run("subscribeEnterprise", {})
  },
  bindDetailTap: function(e){
    rea.run("getVoucherDetail", e.currentTarget.dataset.index)    
  },
  getUnionID: function(aRes){

  },
  onLoad: function (options) {
    let nm = "updateVoucherList"
    rea.add((aInput) => {
      aInput.setData(["getVoucherList",
                      {client_subscription: app.globalData.openid},
                      nm + "0"]).out()
    }, {name: nm})
    .next("callServer")
    .nextF((aInput) => {
      this.setData({"activities": aInput.data.data})
      aInput.setData(["getVoucherList",
                      {client: app.globalData.openid},
                      nm + "1"]).out()
    }, {tag: nm + "0"}, {name: nm + "0"})
    .next("callServer")
    .nextF((aInput) => {
      let cnt = this.data.activities.length
      let dt = aInput.data.data
      for (let i in dt)
        if (dt[i].valid){
          let tmp = "activities[" + cnt + "]"
          this.setData({[tmp]: dt[i]})
          cnt++
        }
      let entries = this.data.activities
      let cnt0 = 0
      cnt = this.data.showindex
      for (let i in entries){
        cnt = parseInt(i) + 1
        if (entries[i].valid){
          let tmp = "activities_show[" + cnt0 + "]"
          this.setData({[tmp]: entries[i]})
          cnt0++
          if (cnt0 > 5)
            break
        }
      }  
      this.setData({showindex: cnt})
    }, {tag: nm + "1"}, {name: nm + "1"})

    let nm2 = "getEnterpriseDetail"
    rea.add((aInput)=>{
      app.globalData.isEnterprise = false
      aInput.setData(["getEnterpriseDetail",
                      {id: app.globalData.openid},
                      nm2 + "0"]).out()
    }, {name: nm2})
    .next("callServer")
    .nextF((aInput)=>{
        app.globalData.isEnterprise = true
        app.globalData.enterprise_detail = aInput.data.data
    }, {tag: nm2 + "0"}, {name: nm2 + "0"})

    let nm3 = "getOwnedVoucherList"
    rea.add((aInput)=>{
      aInput.setData(["getVoucherList",
                      {client_own: app.globalData.openid},
                      nm3 + "0"]).out()
    }, {name: nm3})
    .next("callServer")
    .nextF((aInput)=>{
      app.globalData.voucher_own = aInput.data.data
    }, {tag: nm3 + "0"}, {name: nm3 + "0"})

    let nm4 = "subscribeEnterprise"
    rea.add((aInput)=>{
      aInput.setData(["addSubscription",
                      {client: app.globalData.openid,
                       enterprise: this.data.voucher_detail.publisher},
                       nm4 + "0"]).out()
    }, {name: nm4})
    .next("callServer")
    .nextF((aInput)=>{
      let dt = aInput.data
      if (dt.data.err){
        let msg_map = {"subscription exists": "已订阅"}
        this.setData({showReqResult: true, reqMessage: msg_map[dt.data.msg]})
      }
      else
        this.setData({showReqResult: true, reqMessage: "订阅成功"})
    }, {tag: nm4 + "0"}, {name: nm4 + "0"})

    let nm5 = "getVoucherDetail"
    rea.add((aInput)=>{
      aInput.setData(["getVoucherDetail",
                      {"id": this.data.activities[aInput.data].id},
                       nm5 + "0"]).out()
    }, {name: nm5})
    .next("callServer")
    .nextF((aInput)=>{
      let detail = aInput.data.data
      for (let i in app.globalData.voucher_own)
        if (app.globalData.voucher_own[i].id == detail.id){
          detail["own"] = true
          break
        }
      this.setData({voucher_detail: detail, 
                    voucherDetailImage: app.globalData.server + "/" + detail.image,
                    voucherDetailStartTime: detail.start_time.split("T")[0],
                    voucherDetailEndTime: detail.end_time.split("T")[0]})
      aInput.setData(["getEnterpriseDetail",
                       {"id": aInput.data.data["publisher"]},
                       nm5 + "1"]).out()  
    }, {tag: nm5 + "0"}, {name: nm5 + "0"})
    .next("callServer")
    .nextF((aInput)=>{
      this.setData({showVoucherDetail: true, "voucher_detail.publishername": aInput.data.data["name"]})
    }, {tag: nm5 + "1"}, {name: nm5 + "1"})

    let nm6 = "receiveVoucher"
    rea.add((aInput)=>{
      aInput.setData(["updateVoucherList",
                      {"client": app.globalData.openid,
                       "voucher": this.data.voucher_detail.id},
                       nm6 + "0"]).out()
    }, {name: nm6})
    .next("callServer")
    .nextF((aInput)=>{
      if (aInput.data.data["err"]){
        this.setData({showReqResult: true, reqMessage: aInput.data.data.msg})
      }else{
        this.setData({"voucher_detail.own": true})
        app.globalData.voucher_own.push(this.data.voucher_detail)
      }
    }, {tag: nm6 + "0"}, {name: nm6 + "0"})

    //pip.run("unitTest", {})
    if (!app.globalData.openid){
      app.userIDReadyCallback = res => {
        rea.run("getEnterpriseDetail", {})
        rea.run("updateVoucherList", {})
        rea.run("getOwnedVoucherList", {})
      }
    }else{
      rea.run("getEnterpriseDetail", {})
      rea.run("updateVoucherList", {})
      rea.run("getOwnedVoucherList", {})
    }
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