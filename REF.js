/**
 * 包含所有包依赖,配置信息以及工具方法
 */
let fs = require('fs');
let expect = require('chai').expect;
let xlsx = require('node-xlsx');
let querystring = require('querystring');
let bluebird = require('bluebird');
let rp = require('request-promise');
let mysql = require('mysql');
let stringtool = require('./stringtool');

/**
 * 根据电子表格转换为数组
 * @param rows 表格的行数组
 */
let sheetToObjectArr = function (rows) {
    let columns = rows[0];
    let paramArray = [];
    rows.forEach(function (row, index, array) {
        //排除column行
        if (index == 0) {
            return;
        }
        let obj = {};
        columns.forEach(function (columnName, columnIndex, array) {
            obj[columnName] = row[columnIndex];
        });
        paramArray.push(obj);
    });
    return paramArray;
}

/**
 * 执行sql语句
 * @param db 目标数据库
 * @param query sql语句
 */
let mysqlQuery = function (db, query) {
    var connection = mysql.createConnection({
        host: '192.168.11.117',
        user: 'zhaoying',
        password: 'zhaoying123',
        database: 'milanoo'
    });
    connection.connect();
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
    });

    connection.end();
}

/**
 * 外部json接口调用
 * @param fullUrl 接口全路径
 * @returns {*}
 */
let externalApiGet = function (fullUrl) {
    let options = {
        method: 'GET',
        uri: fullUrl,
        gzip: true,
        json: true
    };
    return rp(options).then(function (json) {
        return json;
    });
}

/**
 * 写表格
 * @param sheets 表格对象
 * @param fileName 要存储的文件名
 */
let buildSheet = function(sheets, fileName) {
    let buffer = xlsx.build(sheets);
    fs.writeFileSync(fileName, buffer);
}

module.exports = {
    fs: fs,
    stringtool: stringtool,
    expect: expect,
    xlsx: xlsx,
    querystring: querystring,
    blubird: bluebird,
    rp: rp,
    mysql: mysql,
    sheetToObjectArr: sheetToObjectArr,
    mysqlQuery: mysqlQuery,
    externalApiGet: externalApiGet,
    buildSheet : buildSheet,
    config: {
        _hostAddress: 'http://192.168.11.67:8080'
    }
}