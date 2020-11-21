const Router = require("koa-router")
const voucher = require("./voucher")

const router = new Router()
router.use("/test", voucher.routes())

module.exports = router