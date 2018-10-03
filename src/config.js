import { app } from 'electron';
import { is } from 'electron-util';
import path from 'path';
import { levels as loglevels } from 'loglevel';
const env = is.development ? 'development' : 'production';
const onEnv = (obj) => (obj.hasOwnProperty(env) ? obj[env] : obj.default);

export default {
  env: {
    production: env === 'production',
    development: env === 'development'
  },
  backup: onEnv({
    default: null,
    production: {
      in: path.join(
        app.getPath('home'),
        'DigiTech/JamManager/JamManager.db.sqlite'
      ),
      out: path.join(
        app.getPath('home'),
        'DigiTech/JamManager/JamManager.db.sqlite.bak'
      )
    }
  }),
  db: onEnv({
    default: path.join(app.getPath('home'), '_test.sqlite'),
    production: path.join(
      app.getPath('home'),
      'DigiTech/JamManager/JamManager.db.sqlite'
    )
  }),
  logger: onEnv({
    default: loglevels.WARN,
    development: loglevels.TRACE
  })
};
