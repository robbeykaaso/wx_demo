//app.js
require("pages/tool.js")

App({
  onLaunch: function () {
    //this.globalData.server = "https://127.0.0.1:3000"
    this.globalData.server = "https://www.robbeykaaso.work:3000"// "http://127.0.0.1:3000"
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        wx.request({
          url: this.globalData.server + "/getOpenID",
          data: {code: res.code},
          header: {
            'content-type': 'json'
          },
          success: res => {
            var openid = res.data.openid //返回openid
            this.globalData.openid = openid
            if (this.userIDReadyCallback)
              this.userIDReadyCallback()
            //console.log('openid为' + openid);
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})