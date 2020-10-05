const qr = require('qr-image')
const os = require('os')
const fs = require('fs')
const moment = require('moment')

function getIpAddress() {
  var ifaces=os.networkInterfaces()

  for (var dev in ifaces) {
    let iface = ifaces[dev]

    for (let i = 0; i < iface.length; i++) {
      let {family, address, internal} = iface[i]

      if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
        return address
      }
    }
  }
}

const sql = require('mysql')
const { fstat } = require('fs')
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

        let _sql = 'create table if not exists ' + table_client + ' (id varchar(255), PRIMARY KEY(id))'
        allServices.query(_sql)

        _sql = 'create table if not exists ' + table_enterprise + ' (id varchar(255), name VARCHAR(255), address VARCHAR(255), online tinyint(1), phone bigint(11), license_id bigint, license_img VARCHAR(255), leader_id bigint, leader_img VARCHAR(255), PRIMARY KEY(id))'
        allServices.query(_sql)   
        
        _sql = 'create table if not exists ' + table_client_enterprise + ' (id bigint auto_increment not null, client varchar(255), enterprise varchar(255), PRIMARY KEY(id))'
        allServices.query(_sql)

        _sql = 'create table if not exists ' + table_voucher_type + ' (id bigint, name VARCHAR(255), valid tinyint(1), PRIMARY KEY(id))'
        allServices.query(_sql)

        _sql = 'create table if not exists ' + table_voucher + ' (id bigint auto_increment not null unique, count int, voucher_type bigint, name varchar(255), valid tinyint(1), start_time datetime, end_time datetime, image varchar(255), publisher varchar(255), message varchar(255), primary key(id))'
        allServices.query(_sql)

        _sql = 'create table if not exists ' + table_client_voucher + ' (id bigint auto_increment not null, client varchar(255), voucher bigint, verify_time datetime, PRIMARY KEY(id))'
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
  let dt = ctx.request.query
  let enterprise = dt["enterprise"]

  if (dt["del"]){
    let _sql = 'delete from ' + table_client_enterprise + ' where enterprise=?'
    await allServices.query(_sql, enterprise)
    ctx.response.body = {err: 0}
  }else{
    let client = dt["client"]
    let _sql = 'select * from ' + table_client_enterprise + ' where client=? and enterprise=?'
    let subscription = await allServices.query(_sql, [client, enterprise])
    if (subscription.length > 0){
      ctx.response.body = {err: 1, msg: 'subscription exists'}
    }else{
      _sql = 'insert into ' + table_client_enterprise + ' set client=?, enterprise=?'
      let ret = await allServices.query(_sql, [client, enterprise]);
      ctx.response.body = {err: 0}
    }
  }
}

var getVoucherList = async (ctx, next) => {
    //all, by subscription, by enterprise, by client
    let dt = ctx.request.query
    if (dt["client_subscription"]){
      let _sql = 'select * from ' + table_client_enterprise + ' where client=?'
      let lst = await allServices.query(_sql, dt["client_subscription"])
      let ret = []
      for (let i in lst){
        _sql = 'select * from ' + table_voucher + ' where publisher=?'
        let dt = await allServices.query(_sql, lst[i]["enterprise"])
        for (let k in dt)
          ret.push(dt[k])
      }
      ctx.response.body = ret
    } else if (dt["client_own"]){
      let _sql = 'select * from ' + table_client_voucher + ' where client=?'
      let lst = await allServices.query(_sql, dt["client_own"])
      let ret = []
      for (let i in lst){
        _sql = 'select * from ' + table_voucher + ' where id=?'
        let dt = await allServices.query(_sql, lst[i]["voucher"])
        dt[0]["verify_time"] = lst[i]["verify_time"]
        ret.push(dt[0])
      }
      ctx.response.body = ret
    }else if (dt["client_publish"]){
      _sql = 'select * from ' + table_voucher + ' where publisher=?'
      let ret = await allServices.query(_sql, dt["client_publish"])
      ctx.response.body = ret
      //let _sql = 'select * from ' + table_
    }else if (dt["client"]){
      let _sql = 'select * from ' + table_client_enterprise + ' where client=?'
      let lst = await allServices.query(_sql, dt["client"])
      let enterprises = {}
      for (let i in lst)
        enterprises[lst[i]["enterprise"]] = true
      _sql = 'select * from ' + table_voucher
      let voucher = await allServices.query(_sql)
      let ret = []
      for (let i in voucher)
        if (!enterprises[voucher[i]["publisher"]])
          ret.push(voucher[i])
      ctx.response.body = ret
    }
}

var getSubscribedEnterprises = async (ctx, next) => {
  let dt = ctx.request.query
  let client = dt["client"]
  let _sql = 'select * from ' + table_client_enterprise + ' where client=?'
  let subscription = await allServices.query(_sql, [client])
  let ret = {}
  for (let i in subscription){
    _sql = 'select * from ' + table_enterprise + ' where id=?'
    let id = subscription[i]["enterprise"]
    let enterprise = await allServices.query(_sql, id)
    ret[id] = enterprise[0]
  }
  ctx.response.body = ret
}

var getVoucherDetail = async (ctx, next) => {
  let dt = ctx.request.query

  let id = dt["id"] == undefined ? - 1 : dt["id"]
  let _sql = 'select * from ' + table_voucher + ' where id=?'
  let voucher = await allServices.query(_sql, id)
  if (voucher.length > 0){
    ctx.response.body = voucher[0]
  }else
    ctx.response.body = {state: false, msg: 'no this voucher'}
} 

var getEnterpriseDetail = async (ctx, next) => {
  let dt = ctx.request.query
  
  let id = dt["id"] == undefined ? "" : dt["id"]
  let _sql = 'select * from ' + table_enterprise + ' where id=?'
  let enterprise = await allServices.query(_sql, id)
  if (enterprise.length > 0){
    ctx.response.body = enterprise[0]
  }else
    ctx.response.body = {err: 1, msg: 'no this enterprise'}
}

var addEnterprise = async (ctx, next) => {
  let dt = ctx.request.query

  let id = dt["id"]
  if (id == undefined){
    ctx.response.body = {err: 1, msg: 'invalid enterprise'}
    return
  }
  let name = dt["name"]
  if (name == undefined){
    ctx.response.body = {err: 1, msg: 'invalid name'}
    return
  }
  let address = dt["address"]
  if (address == undefined){
    ctx.response.body = {err: 1, msg: 'invalid address'}
    return
  }
  let online = 0
  let phone = dt["phone"]
  if (phone == undefined){
    ctx.response.body = {err: 1, msg: 'invalid phone'}
    return
  }
  let license_id = dt["license_id"]
  if (license_id == undefined){
    ctx.response.body = {err: 1, msg: 'invalid license'}
    return
  }
  let license_img = "hello"
  let leader_id = dt["leader_id"]
  if (leader_id == undefined){
    ctx.response.body = {err: 1, msg: 'invalid leader'}
    return
  }
  let leader_img = "hello"

  let _sql = 'select * from ' + table_enterprise + ' where id=?'
  let enterprise = await allServices.query(_sql, id)
  if (enterprise.length > 0){
    ctx.response.body = {err: 1, msg: 'enterprise exists'}
  }else{
    //insert enterprise
    _sql = 'insert into ' + table_enterprise + ' set id=?, name=?, address=?, online=?, phone=?, license_id=?, license_img=?, leader_id=?, leader_img=?'
    let ret = await allServices.query(_sql, [id, name, address, online, phone, license_id, license_img, leader_id, leader_img])
    //update existed vouchers valid
    _sql = 'select * from ' + table_voucher + ' where publisher=?'
    let voucher = await allServices.query(_sql, id)
    for (var i in voucher){
      _sql = 'replace into ' + table_voucher + ' set id=?, count=?, voucher_type=?, name=?, valid=?, start_time=?, end_time=?, image=?, publisher=?, message=?'
      let ret = await allServices.query(_sql, [voucher[i]["id"], voucher[i]["count"], voucher[i]["voucher_type"], voucher[i]["name"], 1, voucher[i]["start_time"], voucher[i]["end_time"], voucher[i]["image"], voucher[i]["publisher"], voucher[i]["message"]])
    }
    ctx.response.body = {err: 0}
  }
}

var getVoucherTypeList = async (ctx, next) => {
  let _sql = 'select * from ' + table_voucher_type
  let ret = await allServices.query(_sql)
  ctx.response.body = ret
}

var updateVoucherDetail = async (ctx, next) => {
  let dt = ctx.request.query

  let id = dt["id"] == undefined ? - 1 : dt["id"]
  let count = dt["count"]
  let voucher_type = dt["voucher_type"]
  let voucher_name = dt["voucher_name"]
  let name = dt["name"]
  let valid = dt["valid"]
  let start_time = dt["start_time"]
  let end_time = dt["end_time"]
  let image = dt["image"]
  let publisher = dt["publisher"]
  let message = dt["message"]

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
    _sql = 'replace into ' + table_voucher + ' set id=?, count=?, voucher_type=?, name=?, valid=?, start_time=?, end_time=?, image=?, publisher=?, message=?'
    let ret = await allServices.query(_sql, [id, count, voucher_type, name, valid != "false" ? 1 : 0, start_time, end_time, image, publisher, message])
    ctx.response.body = {state: true}
  }else{
    _sql = 'insert into ' + table_voucher + ' set count=?, voucher_type=?, name=?, valid=?, start_time=?, end_time=?, image=?, publisher=?, message=?'
    let ret = await allServices.query(_sql, [count, voucher_type, name, valid != "false" ? 1 : 0, start_time, end_time, image, publisher, message])
    ctx.response.body = {state: true}
  }
  
}

var updateVoucherList = async (ctx, next) => {
  let dt = ctx.request.query

  let client = dt["client"]
  let voucher_id = dt["voucher"]
  let verify_time = dt["verify_time"]

  let _sql = 'select * from ' + table_client_voucher + ' where client=? and voucher=?'
  let receive = await allServices.query(_sql, [client, voucher_id])
  if (receive.length > 0){
    _sql = 'replace into ' + table_client_voucher + ' set id=?, client=?, voucher=?, verify_time=?'
    let ret = await allServices.query(_sql, [receive[0]['id'], client, voucher_id, verify_time])
  }else{
    _sql = 'select * from ' + table_voucher + ' where id=?'
    let voucher = await allServices.query(_sql, voucher_id)
    if (voucher.length > 0){
      if (voucher[0]["count"] > 0){
        _sql = 'replace into ' + table_voucher + ' set id=?, count=?, voucher_type=?, name=?, valid=?, start_time=?, end_time=?, image=?, publisher=?, message=?'
        let ret = await allServices.query(_sql, [voucher[0]["id"], voucher[0]["count"] - 1, voucher[0]["voucher_type"], voucher[0]["name"], voucher[0]["valid"], voucher[0]["start_time"], voucher[0]["end_time"], voucher[0]["image"], voucher[0]["publisher"], voucher[0]["message"]])

        _sql = 'insert into ' + table_client_voucher + ' set client=?, voucher=?, verify_time=?'
        ret = await allServices.query(_sql, [client, voucher_id, verify_time])
      }else{
        ctx.response.body = {err: 1, msg: "not enough voucher"}
        return
      }
    }else{
      ctx.response.body = {err: 1, msg: "no this voucher"}
      return
    }
  }
  ctx.response.body = {err: 0}
}

var getVoucherQRCode = async (ctx, next) => {
  let dt = ctx.request.querystring
  let img = qr.image(getIpAddress() + ":3000/verifyVoucherQRCode?" + dt, {size: 10})
  img.pipe(fs.createWriteStream("F:/qrqrText.png"))
  ctx.response.type = "image/png"
  ctx.response.body = img
}

var verifyVoucherQRCode = async (ctx, next) => {
  let client = ctx.request.query.client
  let dt = ctx.request.querystring
  let voucher_id = dt.split("&")[0].split("=")[1]
  let _sql = 'select * from ' + table_client_voucher + ' where client=? and voucher=?'
  let receive = await allServices.query(_sql, [client, voucher_id])
  if (receive.length > 0){
    if (receive[0]["verify_time"]){
      ctx.response.body = {err: 1, msg: "已核销"}
    }else{
      let verify_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
      _sql = 'replace into ' + table_client_voucher + ' set id=?, client=?, voucher=?, verify_time=?'
      let ret = await allServices.query(_sql, [receive[0]['id'], client, voucher_id, verify_time])
      ctx.response.body = {err: 0, msg: "核销成功"}
    }
  }else
    ctx.response.body = {err: 1, msg: "no this voucher"}

}

let exp = {};
exp['GET ' + '/'] = get_index
exp['GET ' + '/addClient'] = addClient
exp['GET ' + '/addSubscription'] = addSubscription
exp['GET ' + '/getVoucherList'] = getVoucherList
exp['GET ' + '/getVoucherDetail'] = getVoucherDetail
exp['GET ' + '/getEnterpriseDetail'] = getEnterpriseDetail
exp['GET ' + '/addEnterprise'] = addEnterprise
exp['GET ' + '/getVoucherTypeList'] = getVoucherTypeList
exp['GET ' + '/getSubscribedEnterprises'] = getSubscribedEnterprises
exp['GET ' + '/updateVoucherDetail'] = updateVoucherDetail
exp['GET ' + '/updateVoucherList'] = updateVoucherList
exp['GET ' + '/getVoucherQRCode'] = getVoucherQRCode
exp['GET ' + '/verifyVoucherQRCode'] = verifyVoucherQRCode

module.exports = exp