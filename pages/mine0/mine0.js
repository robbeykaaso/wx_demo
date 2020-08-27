// pages/mine0.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindManagementTap: function() {
      wx.redirectTo({
        url: '../management/management'
      })  
    },
    bindRecommendTap: function() {
      wx.redirectTo({
        url: '../recommend/recommend'
      })
    },
    bindPublishTap: function() {
      wx.redirectTo({
        url: '../publish/publish'
      })  
    }
  }
})
