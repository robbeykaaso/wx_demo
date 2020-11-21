const fs = require("fs")
const https=require("https")
const clients = require("./control/client")

//const options = {
//    key: fs.readFileSync('../../https/www.robbeykaaso.work.key'),
//    cert: fs.readFileSync('../../https/www.robbeykaaso.work_bundle.crt')
//}

const Koa = require('koa'),
serve = require('koa-static')

const ws = require('ws')
const router = require("./control/index")
const app = new Koa();

app.use(serve(__dirname + "/images"))
   .use(require('koa-body')({multipart: true}))
   .use(router.routes())


//app.use(require('./controller')(__dirname + '/control'))

/*var server = https.createServer(options, app.callback()).listen(3000)

var wss = new ws.Server({server: server})

wss.on('connection', function(wsConnect){
    wsConnect.on("message", function(message){
        let msg = JSON.parse(message)
        if (msg["type"] == "who")
            clients[msg["id"]] = wsConnect
    })
})*/

/*var sockets = {}
app.ws.use((ctx, next) => {
    //ctx.websocket.send({lalala: "hello"})
    ctx.websocket.on("message", (message)=>{
        let msg = JSON.parse(message)
        if (msg["type"] == "who"){
            sockets[msg["id"]] = ctx
        }
        ctx.websocket.send('{"verified": true}')
    })
    ctx.websocket.on("close", function(){
        console.log("close")
    })
    ctx.websocket.on("error", (err)=>{
        console.log(err)
    })
})*/

app.listen(3000, ()=>{
    console.log('app started at port 3000...')
});
