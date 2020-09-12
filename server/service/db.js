const sql = require('mysql')

const data_base = 'wx_test'

const table_client = 'client'
const table_enterprise = 'enterprise'
const table_voucher = "voucher"
const table_voucher_type = "voucher_type"
const table_client_voucher = "client_voucher"
const table_client_enterprise = "client_enterprise"

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
  }
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
        //let _sql = 'create table if not exists ' + table_subscription + ' (id int AUTO_INCREMENT, title VARCHAR(255), PRIMARY KEY(id))'
        //allServices.query(_sql)

        _sql = 'create table if not exists ' + table_client + ' (id bigint, PRIMARY KEY(id))'
        allServices.query(_sql)

        _sql = 'create table if not exists ' + table_enterprise + ' (id bigint, name VARCHAR(255), address VARCHAR(255), online tinyint(1), phone bigint(11), license_id bigint, license_img VARCHAR(255), leader_id bigint, leader_img VARCHAR(255), PRIMARY KEY(id))'
        allServices.query(_sql)   
        
        _sql = 'create table if not exists ' + table_client_enterprise + ' (id bigint, client bigint, enterprise bigint, PRIMARY KEY(id))'
        allServices.query(_sql)

        _sql = 'create table if not exists ' + table_voucher_type + ' (id bigint, name VARCHAR(255), valid tinyint(1), PRIMARY KEY(id))'
        allServices.query(_sql)

        _sql = 'create table if not exists ' + table_voucher + ' (id bigint, voucher_type bigint, name VARCHAR(255), valid tinyint(1), start_time DATETIME, end_time DATETIME, verify_time DATETIME, home VARCHAR(255), PRIMARY KEY(id))'
        allServices.query(_sql)

        _sql = 'create table if not exists ' + table_client_voucher + ' (id bigint, client bigint, voucher bigint, PRIMARY KEY(id))'
        allServices.query(_sql)
    })
    //await allServices.createTable('coupons')
}
initDB()

var addClient = async (ctx, next) => {
  let id = 12345

  let _sql = 'select * from ' + table_client + ' where id=?'
  let client = await allServices.query(_sql, id)
  if (client.length > 0){
    ctx.response.body = {state: false, msg: 'client exists'}
  }else{
    _sql = 'replace into ' + table_client + ' set id=?'
    let ret = await allServices.query(_sql, id)
    ctx.response.body = {state: true}
  }
}

var addSubscription = async (ctx, next) => {

}

var getVoucherList = async (ctx, next) => {
    //all, by subscription, by enterprise, by client
}

var getVoucherDetail = async (ctx, next) => {

} 

var addEnterprise = async (ctx, next) => {

}

var getVoucherTypeList = async (ctx, next) => {

}

var updateVoucherDetail = async (ctx, next) => {
    
}

var publishVoucher = async (ctx, next) => {

}

var updateVouncherList = async (ctx, next) => {

}

var getVoucherQRCode = async (ctx, next) => {

}

var verifyVoucherQRCode = async (ctx, next) => {

}

let exp = {};
exp['GET ' + '/'] = get_index
exp['GET ' + '/addClient'] = addClient
exp['GET ' + '/addSubscription'] = addSubscription
exp['GET ' + '/getVoucherList'] = getVoucherList
exp['GET ' + '/getVoucherDetail'] = getVoucherDetail
exp['GET ' + '/addEnterprise'] = addEnterprise
exp['GET ' + '/getVoucherTypeList'] = getVoucherTypeList
exp['GET ' + '/updateVoucherDetail'] = updateVoucherDetail
exp['GET ' + '/publishVoucher'] = publishVoucher
exp['GET ' + '/updateVoucherList'] = updateVouncherList
exp['GET ' + '/getVoucherQRCode'] = getVoucherQRCode
exp['GET ' + '/verifyVoucherQRCode'] = verifyVoucherQRCode

//exp['GET ' + '/find'] = findData
//exp['GET ' + '/publish'] = publish
//exp['GET ' + '/subscribe/:client'] = subscribe
//exp['GET ' + '/getAllSubscription/:client'] = getAllSubscription
//exp['GET ' + '/getAllPublishment/:client'] = getAllPublishment
module.exports = exp