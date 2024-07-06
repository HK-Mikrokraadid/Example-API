const mysql = require('mysql2');
const { db } = require('./config');

const pool = mysql.createPool(db).promise();

module.exports = pool;
