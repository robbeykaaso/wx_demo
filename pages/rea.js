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
            pip.do(aInput, aInput.param | this.nexts[i])
        }
      else
        for (let i in aInput.outs){
          let ot = aInput.outs[i]
          let pip = pips[ot[0]]
          if (this.nexts[ot[0]]){
            if (pip)
              pip.do(ot[1], ot[1].param | this.nexts[ot[0]])
          }
          else{

          }
        }
  }

  nextF(aFunc, aParam, aPipeParam){
    return this.next(add(aFunc, aPipeParam).name, aParam)
  }

  next(aName, aParam){
    this.nexts[aName] = aParam
    return pips[aName]
  }

  nextB(aName, aParam){
    this.nexts[aName] = aParam
    return this
  }
}

let find = (aName) => {
  return pips[aName]
}

let add = (aFunc, aPipeParam) => {
  let pip = new pipe(aPipeParam ? aPipeParam["name"] : "", aFunc, aPipeParam ? aPipeParam["replace"] : false)
  pips[pip.name] = pip
  return pip
}

let run = (aName, aInput, aParam) => {
  let src = pips[aName]
  if (src)
    src.do(new stream(aInput), aParam)
}

let remove = (aName) => {
  delete pips[aName]
}

add(function(){
  add(function(aInput){
    aInput.setData("hello2").out()
  }, {name: "test1"})
  .nextF(function(aInput){
    console.assert(aInput.data == "hello2")
    console.log("test1 success!")
  })

  add(function(aInput){
    aInput.out1("hello3", "test3")
  }, {name: "test2"})
  .nextF(function(aInput){
    console.assert(aInput.data == "hello3")
    console.log("test2 success!")
  }, {}, {name: "test3"})

  run("test1", "hello")
  run("test2", "hello")
}, {name: "unitTest"})

module.exports = {
  find,
  add,
  run,
  remove,
  pipe,
  stream
}