var rea = require("rea.js")

rea.add(function(aInput){
  let req = aInput.data
  wx.request({
    url: "https://www.robbeykaaso.work:3000/" + req.url,
    data: req.data,
    success: (res)=>{
      rea.run("serverReceived", {data: res.data}, {tag: req.tag})
    },
    fail: function(err){
      console.log(req.url + ": failed")
    }
  })
}, {name: "callServer", type: "Delegate", delegate: "serverReceived"})

rea.add(function(aInput){
  aInput.out()
}, {name: "serverReceived", type: "Partial"})