const fs = require("fs")
const https=require("https")
const sslify = require("koa-sslify").default

const options = {
    key: fs.readFileSync('../../https/www.robbeykaaso.work.key'),
    cert: fs.readFileSync('../../https/www.robbeykaaso.work_bundle.crt')
}

const Koa = require('koa'),
serve = require('koa-static')

const app = new Koa();

app.use(serve(__dirname + "/images"))
app.use(require('koa-body')({multipart: true}))

app.use(require('./controller')(__dirname + '/service'))

https.createServer(options, app.callback()).listen(3000)

//app.listen(3000, ()=>{
//    console.log('app started at port 3000...')
//});