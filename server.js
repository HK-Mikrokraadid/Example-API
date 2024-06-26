const config = require('./config');
const app = require('./app');
const logger = require('./general/logger');

const port = config.port || 3000;

app.listen(port, () => {
  logger.info(`Blog app listening at http://localhost:${port}`);
});