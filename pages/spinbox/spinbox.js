// pages/mine0.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    count:{
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    increase: function(){
      var cnt = this.data.count + 1
      this.setData({count: cnt})
      this.triggerEvent("countChanged", cnt)
    },
    descrease: function(){
      var cnt = Math.max(1, this.data.count - 1)
      this.setData({count: cnt})
      this.triggerEvent("countChanged", cnt)
    },
    editCount: function(e){
      var cnt = parseInt(e.detail.value)
      cnt = cnt == e.detail.value ? Math.max(1, cnt) : 1
      this.setData({count: cnt})
      this.triggerEvent("countChanged", cnt)
    }
  }
})
