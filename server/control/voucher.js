const Router = require("koa-router")
const db = require("../service/db2")

var addClient = async (ctx, next) => {
    db.bookModel.create({id: 0, configId: "ff", count: 2, dataId: "dd", endTime: "2020-11-21"})
    ctx.response.body = {state: true}
    
}

const send = require("koa-send")
var getFile = async (ctx, next) => {
  const name = ctx.params.name
  const path = `/download/${name}`;
  ctx.attachment(path);
  await send(ctx, path);
}

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

module.exports = router