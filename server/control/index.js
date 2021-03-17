const Router = require("koa-router")
const voucher = require("./voucher")
const game = require("./game")
const util = require("./util")

const router = new Router()
router.use("/test", voucher.routes())
router.use("/game", game.routes())
router.use("/util", util.routes())

module.exports = router