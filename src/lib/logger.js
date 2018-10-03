import logger from 'loglevel';
import config from '~/config';

// Set up logger
logger.setLevel(config.logger);

logger.info(
  config.env.production ? 'Running on production' : 'Not running on production'
);

export default logger;
