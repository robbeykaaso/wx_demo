const Router = require("koa-router")
const voucher = require("./voucher")
const game = require("./game")

const router = new Router()
router.use("/test", voucher.routes())
router.use("/game", game.routes())

module.exports = router