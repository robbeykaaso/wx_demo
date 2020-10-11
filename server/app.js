const fs = require("fs")
const https=require("https")
const sslify = require("koa-sslify").default

const options = {
    key: fs.readFileSync('../../https/www.robbeykaaso.work.key'),
    cert: fs.readFileSync('../../https/www.robbeykaaso.work_bundle.crt')
}

const Koa = require('koa'),
serve = require('koa-static')

const websocket = require('koa-websocket')

const app = websocket(new Koa());

app.use(serve(__dirname + "/images"))
app.use(require('koa-body')({multipart: true}))

app.use(require('./controller')(__dirname + '/service'))

https.createServer(options, app.callback()).listen(3000)

app.ws.use((ctx, next) => {
    //ctx.websocket.send({lalala: "hello"})
    console.log("hello")
    ctx.websocket.on("message", (message)=>{
        console.log(message)
        //ctx.websocket.send(message)
    })
    ctx.websocket.on("close", function(){
        console.log("close")
    })
})

//app.listen(3000, ()=>{
//    console.log('app started at port 3000...')
//});