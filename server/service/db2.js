const Sequelize = require("sequelize")
const mysql = require('mysql2/promise');
const config = require("../model/config")

//console.log('init sequelize...');
var db = {}
async function init(){
    const {host, port, database, username, password} = config
    const connection = await mysql.createConnection({ host: host, port: port, user: username, password: password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    const sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host, //数据库地址
        dialect: 'mysql', //指定连接的数据库类型
        pool: {
            max: 5, //连接池最大连接数量
            min: 0, //最小连接数量
            idle: 10000, //如果一个线程 10秒内么有被使用过的话，就释放
        },
        //define: {
        //    freezeTableName: true,
        //    timestamps: true,
        //    paranoid: true
        //},
        timezone: "+08:00",
        logging: false, // 执行过程会log一些SQL的logging，设为false不显示
    })
    db.bookModel = require("../model/book.js")(sequelize, Sequelize.DataTypes)
    await sequelize.sync()
}

init()

//对连接进行测试，查看控制台
/* sequelize
    .authenticate()
    .then(() => {
        console.log('******Connection has been established successfully.********');
        console.log('******测试结束，即将退出！！！********');
        process.exit(); //结束进程
    })
    .catch(err => {
        console.error('***************Unable to connect to the database:***********', err);
    }); */
//module.exports = db