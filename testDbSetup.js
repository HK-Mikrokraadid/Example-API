const fs = require('fs').promises;
const mysql = require('mysql2/promise');
const { db } = require('./config');

async function setupTestDatabase() {
  let connection;
  try {
    // Create a connection to the MySQL server
    connection = await mysql.createConnection(db);

    // Create the test database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${db.database}`);

    // Use the test database
    await connection.query(`USE ${db.database}`);

    // Read the SQL file
    const sqlFile = await fs.readFile('./testSql/testData.sql', 'utf8');

    // Split the file into separate SQL statements
    const statements = sqlFile.split(';').filter(statement => statement.trim() !== '');

    // Execute each statement
    for (const statement of statements) {
      await connection.query(statement);
    }
    console.log('Test database setup complete');
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { setupTestDatabase };