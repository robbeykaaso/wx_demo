var rea = require("rea.js")
let ip = "www.robbeykaaso.work:3000"
//let ip = "localhost:3000"
let server = "https://" + ip

//aThis: this
//aCount: the limit count
//aList: the data key
//ensure the validEntry of this
let showPartialList = function(aThis, aCount, aList){
  let aShowed = aList + "_show"
  let aIndex = aShowed + "_index"

  let cnt = aThis.data[aIndex] || 0
  let cnt0 = 0
  let entries = aThis.data[aList]
  let new_show = []
  for (let i = cnt; i < entries.length; ++i){
    cnt = parseInt(i) + 1
    if (aThis.validEntry(i)){
      new_show.push(entries[i])
      cnt0++
    }
    if (cnt0 > aCount)
      break
  }
  aThis.setData({[aIndex]: cnt})

  let showed = aThis.data[aShowed]
  if (!showed)
    showed = []
  if (aThis.data[aIndex] < aThis.data[aList].length){
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
    })
    setTimeout(() => {
      aThis.setData({
        [aShowed]: showed.concat(new_show)
      })
      wx.hideLoading();
    }, 500)
  }else{
    wx.showToast({
      title: "到底啦",
      icon: "success",
      duration: 500
    })
    if (new_show.length > 0)
      setTimeout(() => {
        aThis.setData({
          [aShowed]: showed.concat(new_show)
        })
        wx.hideLoading();
      }, 500)
  }
}

rea.add(function(aInput){
  let req = aInput.data
  wx.request({
    url: "https://" + ip + "/" + req[0],
    data: req[1],
    success: (res)=>{
      rea.run("serverReceived", {data: res.data}, {tag: req[2]})
    },
    fail: function(err){
      console.log(req[0] + ": failed")
    }
  })
}, {name: "callServer", type: "Delegate", delegate: "serverReceived"})

rea.add(function(aInput){
  wx.scanCode({
    success: (res)=>{
      rea.run("qrCodeScanned", {data: res.result}, {tag: aInput.data})
    },
    fail: function(err){
      console.log("scanQRCode: failed")
    }
  })
}, {name: "scanQRCode", type: "Delegate", delegate: "qrCodeScanned"})

rea.add(function(aInput){
  aInput.out()
}, {name: "serverReceived", type: "Partial"})

rea.add(function(aInput){
  aInput.out()
}, {name: "qrCodeScanned", type: "Partial"})

module.exports = {
  ip,
  server,
  showPartialList
}