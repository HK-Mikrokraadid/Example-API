const fs = require('fs').promises;
const db = require('./db')

async function setupTestDatabase() {

  try {
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