//https://blog.csdn.net/qq_39425958/article/details/87642137
const wxuuid = function () {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
 
  var uuid = s.join("");
  return uuid
}

let pips = {}

class stream{
  constructor(aInput, aParam, aCache){
    this.data = aInput
    this.param = aParam
    if (aCache == null)
      this.cache_data = []
    else
      this.cache_data = aCache
  }
  setData(aData){
    this.data = aData
    return this
  }
  out(aParam){
    if (this.outs == null)
      this.outs = []
    this.param = aParam
  }
  out1(aOut, aNext, aParam, aSharedCache){
    this.out()
    if (this.outs == null)
      this.outs = []
    let ot = new stream(aOut, aParam, aSharedCache ? this.cache_data : null)
    this.outs.push([aNext, ot])
    return ot
  }
  cache(aData, aIndex){
    if (aIndex != null && aIndex >= 0 && aIndex < this.cache_data.length)
      this.cache_data[aIndex] = aData
    else
      this.cache_data.push(aData)
  }
  cacheData(aIndex){
    if (aIndex != null && aIndex >= 0 && aIndex < this.cache_data.length)
      return this.cache_data[aIndex]
    else
      return null
  }
}

class pipe{
  
  constructor(aName, aFunc, aReplace){
    if (aName == ""){
      this.name = wxuuid()
      this.anonymous = true
    }else{
      this.name = aName
      this.anonymous = false
    }
    this.func = aFunc
    if (aReplace && pips[this.name])
      this.nexts = pips[this.name].nexts
    else
      this.nexts = {}
  }

  do(aInput, aParam){
    if (this.func)
      this.func(aInput)
    if (aInput.outs != null)
      if (aInput.outs.length == 0)
        for (let i in this.nexts){
          let pip = pips[i]
          if (pip)
            pip.execute(aInput, aInput.param | this.nexts[i])
        }
      else
        for (let i in aInput.outs){
          let ot = aInput.outs[i]
          if (!ot[0]){
            for (let i in this.nexts){
              let pip = pips[i]
              if (pip && pip.anonymous)
                pip.execute(ot[1], ot[1].param | this.nexts[i])
            }
          }else{
            let pip = pips[ot[0]]
            if (this.nexts[ot[0]]){
              if (pip)
                pip.execute(ot[1], ot[1].param | this.nexts[ot[0]])
            }
            else{
              let exed = false
              for (let j in this.nexts){
                let pip = pips[j]
                if (pip && pip.local_name == ot[0]){
                  pip.execute(ot[1], ot[1].param | this.nexts[j])
                  exed = true
                }
              }
              if (!exed){
                let pip = pips[ot[0]]
                if (pip)
                  pip.execute(ot[1], ot[1].param)
              }
            }
          }
        }
  }

  execute(aInput, aParam){
    this.do(aInput, aParam)
  }

  nextF(aFunc, aParam, aPipeParam){
    return this.next(add(aFunc, aPipeParam).name, aParam)
  }

  next(aName, aParam){
    this.nexts[aName] = aParam || {}
    return pips[aName]
  }

  nextB(aName, aParam){
    this.next(aName, aParam)
    return this
  }
}

class pipeLocal extends pipe{
  constructor(aName){
    super("")
    this.local_name = aName
  }
  execute(aInput, aParam){
    if (!this.func){
      let pip = pips[this.local_name]
      if (pip)
        this.func = pip.func
    }
    this.do(aInput, aParam)
  }
}

class pipeDelegate extends pipe{
  constructor(aName, aFunc, aDelegate){
    super(aName, aFunc)
    this.delegate = aDelegate
  }
  execute(aInput, aParam){
    if (this.func)
      this.func(aInput)
  }
  next(aName, aParam){
    find(this.delegate).next(aName, aParam)
  }
}

let find = (aName, aNeedFuture = true) => {
  let ret = pips[aName]
  if (!ret && aNeedFuture){
    let future_nm = aName + "_pipe_add"
    ret = pips[future_nm] || add(function(aInput){
      for (let i in pips[future_nm].nexts)
        pips[aName].next(i, pips[future_nm].nexts[i])
      delete pips[future_nm]
    }, {name: future_nm})
  }
  return ret
}

let add = (aFunc, aPipeParam) => {
  let pip
  if (aPipeParam){
    if (aPipeParam["type"] == "Local")
      pip = new pipeLocal(aPipeParam["name"])
    else if (aPipeParam["type"] == "Delegate")
      pip = new pipeDelegate(aPipeParam["name"], aFunc, aPipeParam["delegate"])
    else
      pip = new pipe(aPipeParam ? aPipeParam["name"] : "", aFunc, aPipeParam ? aPipeParam["replace"] : false)
  }
  else
    pip = new pipe("", aFunc)
  pips[pip.name] = pip
  if (!pip.anonymous)
    run(pip.name + "_pipe_add")
  return pip
}

let run = (aName, aInput, aParam) => {
  let src = pips[aName]
  if (src)
    src.execute(new stream(aInput), aParam)
}

let remove = (aName) => {
  delete pips[aName]
}

let local = (aName) => {
  return add(null, {name: aName, type: "Local"}).name
}

add(function(){
  add(function(aInput){
    aInput.setData("hello").out()
  }, {name: "test1"})
  .nextF(function(aInput){
    console.assert(aInput.data == "hello")
    console.log("test1 success!")
  })

  add(function(aInput){
    aInput.out1("hello", "test2_")
  }, {name: "test2"})
  .nextF(function(aInput){
    console.assert(aInput.data == "hello")
    console.log("test2 success!")
  }, {}, {name: "test2_"})

  find("test3").next("test3_")
  find("test3").next("test3__")
  add(function(aInput){
    aInput.out()
  }, {name: "test3"})
  add(function(aInput){
    console.assert(aInput.data == "hello")
    console.log("test3_ success!")
  }, {name: "test3_"})
  add(function(aInput){
    console.assert(aInput.data == "hello")
    console.log("test3__ success!")
  }, {name: "test3__"})

  add(function(aInput){
    aInput.out()
  }, {name: "test4"})
  .next(local("test4_"))
  .nextF(function(aInput){
    console.assert(aInput.data == "hello")
    console.log("test4 success")
  })
  add(function(aInput){
    aInput.out()
  }, {name: "test4_"})
  .nextF(function(aInput){
    console.log("test4_ success")
  })

  add(function(aInput){
    console.log("test5 success")
    aInput.out()
  }, {name: "test5", type: "Delegate", delegate: "test5_"})
  .nextF(function(aInput){
    console.assert(aInput.data == "hello")
    console.log("test5_ success")
  })
  add(function(aInput){
    aInput.out()
  }, {name: "test5_"})

   run("test1", "hello") //normal next
   run("test2", "hello") //specific pipe
   run("test3", "hello") //pipeFuture
   run("test4", "hello") //pipeLocal
   run("test4_", "hello")
   run("test5", "hello") //pipeDelegate
   run("test5_", "hello") 
  //pipePartial
}, {name: "unitTest"})

module.exports = {
  find,
  add,
  run,
  remove,
  local,
  pipe,
  stream
}