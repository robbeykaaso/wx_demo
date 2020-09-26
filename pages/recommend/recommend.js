// pages/recommend/recommend.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  updateVoucherList: function(){
    wx.request({
      url: 'http://127.0.0.1:3000/getVoucherList',//'https://139.199.62.142:3000/',
      data: {"client": app.globalData.openid},
      header:{
        "Content-type": "application/json"
      },
      success: (res)=>{
        this.setData({"activities": res.data})

        wx.request({
          url: 'http://127.0.0.1:3000/getVoucherList',//'https://139.199.62.142:3000/',
          data: {},
          header:{
    
          },
          success: (res)=>{
            var cnt = this.data.activities.length
            for (var i in res.data){
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
  },
  getUnionID: function(aRes){

  },
  onLoad: function (options) {
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