const Router = require("koa-router")
const db = require("../service/db2")
const fs = require("fs")

var addClient = async (ctx, next) => {
    db.bookModel.create({id: 0, configId: "ff", count: 2, dataId: "dd", endTime: "2020-11-21"})
    ctx.response.body = {state: true}
    
}

const send = require("koa-send")
//const { tmpdir } = require("os")
const getFile = async (ctx, next) => {
  const name = ctx.params.name
  const path = `/download/${name}`
  ctx.attachment(path);
  await send(ctx, path);
}

//Save file
const saveFile = (file, path) => {
    return new Promise((resolve, reject) => {
        let render = fs.createReadStream(file)
        // Create a write stream
        let upStream = fs.createWriteStream(path)
        render.pipe(upStream);
        upStream.on('finish', () => {
            resolve(path)
        });
        upStream.on('error', (err) => {
            reject(err)
        });
    })
}

const upload_root = "upload"
if (!fs.existsSync(upload_root))
    fs.mkdirSync(upload_root)
const uploadFile = async (ctx, next) => {
    const dt = ctx.request.body
    const fls = ctx.request.files
    if (Object.keys(fls).length){
        let dir = upload_root + "/" + dt.type
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir)
        else{
            let files = fs.readdirSync(dir);
            if (files.length > 10){
                ctx.response.body = {err: 1, msg: "out of storage"}
                return
            }
        }
        dir += "/" + dt.id
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir)
        for (let i in fls){
            const nms = fls[i].name.split("/")
            await saveFile(fls[i].path, dir + "/" + nms[nms.length - 1])
        }
    }
    ctx.response.body = {err: 0}
}

const rimraf = require("rimraf");
const deleteFile = async (ctx, next) => {
    let dir = ctx.query["dir"]
    let nm = ctx.query["name"]
    rimraf.sync(upload_root + "/" + dir + "/" + nm)
    ctx.status = 200
}

const viewUpload = async (ctx, next) => {
    let pth = decodeURI(ctx.path)
    let prm = ctx.originalUrl.replace(ctx.path, "")
    let prt_rt = "/test"
    let rt = prt_rt + "/viewupload/"
    pth = pth.replace(rt, "")
    let dir = upload_root + "/" + pth

    let exists = fs.existsSync(dir);
    if (!exists){
        ctx.response.body = "not found"
        return;
    }
    let stats = fs.statSync(dir)
    if (!stats.isDirectory()){
        //dir = "/" + dir
        //ctx.attachment(dir);
        await require('koa-sendfile')(ctx, dir)
        //await send(ctx, dir);
        return;
    }
    let files = fs.readdirSync(dir)
    let items = []
    const dir2 = rt + pth
    let filters = {"book": true, "article": true}
    if (pth != "")
        items.push({title: "../", href: dir2 + (dir2.endsWith("/") ? "" : "/") + ".." + prm})
    for (let i in files){
        if (dir == "upload/" && ctx.query['robbeykaaso'] != 'user' && filters[files[i]])
            continue
        stats = fs.statSync(dir + "/" + files[i])
        let tm = stats.mtime.toString();
        tm = tm.substring(0, tm.indexOf('GMT') - 1)
        if (stats.isDirectory())
            items.push({title: files[i] + '/', 
                        time: tm, 
                        size: '-', 
                        href: dir2 + (dir2.endsWith("/") ? "" : "/") + files[i] + prm
                    })
        else
            items.push({title: files[i], 
                        time: tm, 
                        size: stats.size, 
                        href: dir2 + (dir2.endsWith("/") ? "" : "/") + files[i] + prm
                    })
    }
    await ctx.render('index', {
        isManager: ctx.query['robbeykaaso'] == 'user',
        title: pth,
        items: items
    });
    //ctx.response.type = "text/plain";
    //ctx.response.body = "found";
    return;
};

const router = new Router()
//router.get("/db2", addClient)
/*
    get/game/start/palyer_id
    req: {
        player_id: {
            ***
        }
    }
    res: {
        game_id: ***,
        status: "wait/go"
    }
*/
router.get("/download/:name", getFile)
router.post("/upload", uploadFile)
router.get("/delete", deleteFile)
router.get("/viewupload/*", viewUpload)

module.exports = router