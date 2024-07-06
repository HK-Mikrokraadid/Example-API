const mysql = require('mysql2');
const { db } = require('./config');
console.log(db);
const pool = mysql.createPool(db).promise();

module.exports = pool;
