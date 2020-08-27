const sql = require('mysql')

const data_base = 'wx_test'
const table_subscription = 'subscription'

const db_config = {
  host: '0.0.0.0',
  user: 'root',
  port: 3306,
//  database: 'wx_test',
  password: '1234',
  connectionLimit: 50
}

const conn = sql.createConnection(db_config)

let allServices = {
  query: function (sql, values) {

      return new Promise((resolve, reject) => {
        conn.query(sql, values, (err, rows) => {

            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
            //connection.release()
        })
      })
  },
  createDB: (name)=>{
        let _sql = 'create database if not exists ' + name
        return allServices.query(_sql)
  },
  deleteDB: (name)=>{
      let _sql = 'drop database if exists ' + name
      return allServices.query(_sql)
  },
  createTable: (name)=>{
      let _sql = 'create table if not exists ' + name + ' (id int AUTO_INCREMENT, title VARCHAR(255), PRIMARY KEY(id))'
      return allServices.query(_sql)
  },
  addSubscription: (obj) => {
    let _sql = 'replace into ' + table_subscription + ' set title=?'
    return allServices.query(_sql, obj)
  },
  findSubscription: function (obj) {
    let _sql = 'select * from ' + table_subscription + ' where title=?'
    return allServices.query(_sql, obj)
},
}

var get_index = async (ctx, next) => {
    //ctx.response.type = "text/plain";
    ctx.response.body = {
        activities: [
          {text: "玛莎拉蒂5000优惠券"},
          {text: "小米之家智能手环优惠券"},
          {text: "网易严选"},
          {text: "小鹏汽车"},
          {text: "..."},
          {text: "..."},
          {text: "..."},
          {text: "..."},
          {text: "..."},
          {text: "..."},
          {text: "..."}
        ]
      }  
}

var findData = async (ctx, next) => {
    var dt = await allServices.findSubscription("hello")
      //ctx.response.type = "text/plain";
    ctx.response.body = {id: dt}
  //ctx.response.type = "text/plain";
}

var publish = async (ctx, next) => {
    var dt = await allServices.addSubscription("hello")
}

var subscribe = async (ctx, next) => {

}

var getAllSubscription = async (ctx, next) => {

}

var getAllPublishment = async (ctx, next) => {

}

//allServices.deleteDB(db_config.database)
async function initDB(){
    await allServices.createDB(data_base)
    conn.changeUser({database: data_base}, function(err){
        if (err){
            console.log ("connect db failed!")
            return
        }
        allServices.createTable(table_subscription)
    })
    //await allServices.createTable('coupons')
}
initDB()

let exp = {};
exp['GET ' + '/'] = get_index
exp['GET ' + '/find'] = findData
exp['GET ' + '/publish'] = publish
exp['GET ' + '/subscribe/:client'] = subscribe
exp['GET ' + '/getAllSubscription/:client'] = getAllSubscription
exp['GET ' + '/getAllPublishment/:client'] = getAllPublishment
module.exports = exp