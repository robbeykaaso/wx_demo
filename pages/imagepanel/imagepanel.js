// pages/imagepanel/imagepanel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    source:{
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    source: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseImage: function(e){
      wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: res => {
          var src = res.tempFilePaths[0]
          this.setData({source: src})
          this.triggerEvent("sourceChanged", src)
        }
      })
    }
  }
})
