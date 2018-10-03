import fs from 'fs';
import sql from 'sql.js';
import schema from './schema';
import terminateError from '~/utils/terminate-error';
import logger from 'logger';

export default class Database {
  constructor() {
    this.db = new sql.Database();
    this.exec(schema);
  }
  async exec(sql) {
    try {
      sql = sql
        .replace('\n', '')
        .split(';')
        .map((x) => x.trim())
        .join(';');
      this.db.run(sql);
    } catch (e) {
      logger.error(e);
      terminateError(
        'Error: Hubo un error en la escritura a la base de datos.'
      );
    }
  }
  write(path) {
    const data = this.db.export();
    // TODO: new Buffer() is deprecated
    // eslint-disable-next-line
    const buffer = new Buffer(data);
    fs.writeFileSync(path, buffer);
  }
}
