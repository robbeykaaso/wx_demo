//https://blog.csdn.net/tiramisu_ljh/article/details/78487747
var iconv = require("iconv-lite")
const Router = require("koa-router")
const https=require("https")
const fs = require("fs")

//f81600042bf0d3713ea9015cdf661881

var getOpenID = async (ctx, next) => {
  let dt = ctx.request.query
  let ret = await new Promise(
    function(resolve, reject){
      https.get("https://api.weixin.qq.com/sns/jscode2session?appid=" + fs.readFileSync('../../https/' + dt.app + '/appid.txt') + 
      "&secret=" + fs.readFileSync('../../https/' + dt.app + '/appsecret.txt') + '&js_code=' + dt.code + "&grant_type=authorization_code",
      function(res){
       var datas = [];  
       var size = 0;  
       res.on('data', function (data) {  
           datas.push(data);  
           size += data.length;  
       //process.stdout.write(data);  
       });  
       res.on("end", function () {  
           var buff = Buffer.concat(datas, size);  
           var result = iconv.decode(buff, "utf8");//转码//var result = buff.toString();//不需要转编码,直接tostring  
           resolve(JSON.parse(result))
       })
      }).on("error", function(err){
        reject(err)
      })
    }
  )
  ctx.response.body = ret 
}

const router = new Router()
/*
    util/openid
    req: {
        app_id: ***,
        js_code: ***
    }
    res: {
        ***
    }
*/
router.get("/openid", getOpenID)

module.exports = router