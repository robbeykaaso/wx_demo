const db = require("../service/db2")

var addClient = async (ctx, next) => {
    db.bookModel.create({id: 0, configId: "ff", count: 2, dataId: "dd", endTime: "2020-11-21"})
    ctx.response.body = {state: true}
    
}

let exp = {};
exp['GET ' + '/db2'] = addClient
module.exports = exp