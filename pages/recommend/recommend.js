//领取卡券数量不能实时更新
// pages/recommend/recommend.js
const rea = require("../rea.js")
const tol = require("../tool.js")

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
  validEntry: function(aIndex){
    return this.data.activities[aIndex].valid
  },
  lower: function(){
    tol.showPartialList(this, 5, "activities")
  },
  receive: function(){
    rea.run("receiveVoucher", {})
  },
  getScancode: function(){
    rea.run("scanCode", {})
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
      tol.showPartialList(this, 5, "activities")
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
      this.setData({voucher_detail_index: aInput.data})
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
                    voucherDetailImage: tol.server + "/" + detail.image,
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
      /*let tmp = "activities[" + this.data.voucher_detail_index + "].count"
      this.setData({[tmp]: this.data.voucher_detail.count - 1})
      console.log(this.data.activities[this.data.voucher_detail_index].count)
      return*/   
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

    let nm7 = "scanCode"
    rea.add((aInput)=>{
      aInput.setData(nm7 + "0").out()
    }, {name: nm7})
    .next("scanQRCode")
    .nextF((aInput)=>{
      let url = aInput.data.data
      aInput.setData([url.substring(url.lastIndexOf("/") + 1, url.length),
                      {scanner: app.globalData.openid},
                       nm7 + "1"]).out()
    }, {tag: nm7 + "0"}, {name: nm7 + "0"})
    .next("callServer")
    .nextF((aInput)=>{
      this.setData({showReqResult: true, reqMessage: aInput.data.data.msg})
    }, {tag: nm7 + "1"}, {name: nm7 + "1"})

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