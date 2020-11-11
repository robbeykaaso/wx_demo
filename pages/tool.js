var rea = require("rea.js")

rea.add(function(aInput){
  let req = aInput.data
  wx.request({
    url: "https://www.robbeykaaso.work:3000/" + req[0],
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
  aInput.out()
}, {name: "serverReceived", type: "Partial"})