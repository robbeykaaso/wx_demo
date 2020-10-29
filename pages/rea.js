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

class pipe{
  
  constructor(aName, aFunc){
    if (aName == "")
      this.name = wxuuid()
    else
      this.name = aName
    this.func = aFunc
    this.nexts = {}
  }

  do(aInput){
    let ret = null
    if (this.func)
      ret = this.func(aInput)
    if (ret != null)
      for (let i in this.nexts){
        let pip = pips[i]
        if (pip)
          pip.do(ret)
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
  let pip = new pipe(aPipeParam ? aPipeParam["name"] : "", aFunc)
  pips[pip.name] = pip
  return pip
}

let run = (aName, aInput) => {
  let src = pips[aName]
  if (src)
    src.do(aInput)
}

let remove = (aName) => {
  delete pips[aName]
}

module.exports = {
  find,
  add,
  run,
  remove,
  pipe
}