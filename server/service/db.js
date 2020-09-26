const sql = require('mysql')

const data_base = 'wx_test'

const table_client = 'client'
const table_enterprise = 'enterprise'
const table_voucher = "voucher"
const table_voucher_type = "voucher_type"
const table_client_voucher = "client_voucher"
const table_client_enterprise = "client_enterprise"

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
        
        _sql = 'create table if not exists ' + table_client_enterprise + ' (id bigint auto_increment not null, client bigint, enterprise bigint, PRIMARY KEY(id))'
        allServices.query(_sql)

        _sql = 'create table if not exists ' + table_voucher_type + ' (id bigint, name VARCHAR(255), valid tinyint(1), PRIMARY KEY(id))'
        allServices.query(_sql)

        _sql = 'create table if not exists ' + table_voucher + ' (id bigint auto_increment not null unique, count int, voucher_type bigint, name varchar(255), valid tinyint(1), start_time datetime, end_time datetime, home varchar(255), primary key(id))'
        allServices.query(_sql)

        _sql = 'create table if not exists ' + table_client_voucher + ' (id bigint auto_increment not null, client bigint, voucher bigint, verify_time datetime, PRIMARY KEY(id))'
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
    _sql = 'insert into ' + table_client + ' set id=?'
    let ret = await allServices.query(_sql, id)
    ctx.response.body = {state: true}
  }
}

var addSubscription = async (ctx, next) => {
  let client = 12345
  let enterprise = 54321

  let _sql = 'select * from ' + table_client_enterprise + ' where client=? and enterprise=?'
  let subscription = await allServices.query(_sql, [client, enterprise])
  if (subscription.length > 0){
    ctx.response.body = {state: false, msg: 'subscription exists'}
  }else{
    _sql = 'insert into ' + table_client_enterprise + ' set client=?, enterprise=?'
    let ret = await allServices.query(_sql, [client, enterprise]);
    ctx.response.body = {state: true}
  }
}

var getVoucherList = async (ctx, next) => {
    //all, by subscription, by enterprise, by client
    let dt = ctx.request.query
    _sql = 'select * from ' + table_voucher
    let voucher = await allServices.query(_sql)
    ctx.response.body = voucher
}

var getVoucherDetail = async (ctx, next) => {
  let id = 1
  _sql = 'select * from ' + table_voucher + ' where id=?'
  let voucher = await allServices.query(_sql, id)
  if (voucher.length > 0){
    ctx.response.body = voucher[0]
  }else
    ctx.response.body = {state: false, msg: 'no this voucher'}
} 

var addEnterprise = async (ctx, next) => {
  let id = 12345
  let name = "hello"
  let address = "hello@sina.com"
  let online = 0
  let phone = 12345678910
  let license_id = 12121212
  let license_img = "hello"
  let leader_id = 21212121
  let leader_img = "hello"

  let _sql = 'select * from ' + table_enterprise + ' where id=?'
  let enterprise = await allServices.query(_sql, id)
  if (enterprise.length > 0){
    ctx.response.body = {state: false, msg: 'enterprise exists'}
  }else{
    _sql = 'insert into ' + table_enterprise + ' set id=?, name=?, address=?, online=?, phone=?, license_id=?, license_img=?, leader_id=?, leader_img=?'
    let ret = await allServices.query(_sql, [id, name, address, online, phone, license_id, license_img, leader_id, leader_img])
    ctx.response.body = {state: true}
  }
}

var getVoucherTypeList = async (ctx, next) => {
  let _sql = 'select * from ' + table_voucher_type
  let ret = await allServices.query(_sql)
  ctx.response.body = ret
}

var updateVoucherDetail = async (ctx, next) => {
  let id = 1
  let count = 10
  let voucher_type = 1
  let voucher_name = "hello"
  let name = "hello"
  let valid = 0
  let start_time = "2006-07-02 08:09:04"
  let end_time = "2006-09-02 08:09:04"
  let home = "hello2"

  //insert voucher type
  let _sql = 'select * from ' + table_voucher_type + ' where id=?'
  let voucher_tp = await allServices.query(_sql, voucher_type)
  if (voucher_tp.length == 0){
    _sql = 'insert into ' + table_voucher_type + ' set id=?, name=?, valid=?'
    let ret = await allServices.query(_sql, [voucher_type, voucher_name, 1])
  }

  //insert voucher
  _sql = 'select * from ' + table_voucher + ' where id=?'
  let voucher = await allServices.query(_sql, id)
  if (voucher.length > 0){
    _sql = 'replace into ' + table_voucher + ' set id=?, count=?, voucher_type=?, name=?, valid=?, start_time=?, end_time=?, home=?'
    let ret = await allServices.query(_sql, [id, count, voucher_type, name, valid, start_time, end_time, home])
    ctx.response.body = {state: true}
  }else{
    _sql = 'insert into ' + table_voucher + ' set count=?, voucher_type=?, name=?, valid=?, start_time=?, end_time=?, home=?'
    let ret = await allServices.query(_sql, [count, voucher_type, name, valid, start_time, end_time, home])
    ctx.response.body = {state: true}
  }
  
}

var updateVoucherList = async (ctx, next) => {
  let client = 12345
  let voucher = 1
  let verify_time = null

  let _sql = 'select * from ' + table_client_voucher + ' where client=? and voucher=?'
  let receive = await allServices.query(_sql, [client, voucher])
  if (receive.length > 0){
    _sql = 'replace into ' + table_client_voucher + ' set id=?, client=?, voucher=?, verify_time=?'
    let ret = await allServices.query(_sql, [receive[0]['id'], client, voucher, verify_time]);
  }else{
    _sql = 'insert into ' + table_client_voucher + ' set client=?, voucher=?, verify_time=?'
    let ret = await allServices.query(_sql, [client, voucher, verify_time]);
  }
  ctx.response.body = {state: true}
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
exp['GET ' + '/updateVoucherList'] = updateVoucherList
exp['GET ' + '/getVoucherQRCode'] = getVoucherQRCode
exp['GET ' + '/verifyVoucherQRCode'] = verifyVoucherQRCode

module.exports = exp