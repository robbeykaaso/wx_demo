const Koa = require('koa'),
serve = require('koa-static')

const app = new Koa();

app.use(serve(__dirname + "/images"))
app.use(require('koa-body')({multipart: true}))

app.use(require('./controller')(__dirname + '/service'))

app.listen(3000, ()=>{
    console.log('app started at port 3000...')
});