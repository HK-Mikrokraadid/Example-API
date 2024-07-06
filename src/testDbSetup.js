const fs = require('fs').promises;
const dbConfig = require('./config').db;
const db = require('./db')

async function setupTestDatabase() {

  try {
    // Create the test database if it doesn't exist
    await db.query(`DROP DATABASE IF EXISTS ${dbConfig.database};`);
    await db.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database};`);

    // Use the test database
    await db.query(`USE ${dbConfig.database};`);

    // Read the SQL file
    const sqlFile = await fs.readFile('./testSql/testData.sql', 'utf8');

    // Split the file into separate SQL statements
    const statements = sqlFile.split(';').filter(statement => statement.trim() !== '');

    // Execute each statement
    for (const statement of statements) {
      await db.query(statement);
    }
    console.log('Test database setup complete');
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
}

module.exports = { setupTestDatabase };