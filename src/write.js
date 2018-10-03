import Database from './db';
import { app, dialog } from 'electron';
import loading from './utils/loading';
import fs from 'fs-extra';
import config from './config';

export default async function(wavs) {
  const db = new Database();

  // Insert list
  db.exec(`INSERT INTO jamlists VALUES (1, 0, 'Mi Lista');`);

  // Insert all loops
  const dict = wavs.reduce((acc, wav) => {
    acc[wav.i] = wav;
    return acc;
  }, {});

  const arr = Array(200)
    .fill(0)
    .map((_, i) => {
      const wav = dict[i + 1];
      return wav
        ? {
            name: wav.path
              .split('/')
              .slice(-1)[0]
              .replace(/\.wav$/i, ''),
            length: wav.length,
            filepath: wav.path
          }
        : null;
    });

  const sql = arr.reduce((acc, obj, i) => {
    const id = i + 1;

    if (!obj)
      return (
        acc +
        `INSERT INTO loops VALUES (${id}, 1, 'false', NULL, NULL, NULL, 'false', ${id}, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);`
      );

    const { name, length, filepath } = obj;
    return (
      acc +
      `INSERT INTO loops VALUES (${id}, 1, 'true', NULL, NULL, NULL, 'false', ${id}, '${name}', '${length}', 0, '${filepath.slice(
        -30
      )}', NULL, 'Unspecified', NULL, 'StopInstantly', 'Silence', 4, 120, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '${filepath}');`
    );
  }, '');

  loading.hide();

  dialog.showMessageBox(
    {
      title: 'Info',
      message:
        'Se sobreescribirá la base de datos de Jamman. Esta acción es irreversible.',
      buttons: ['Aceptar', 'Cancelar']
    },
    async (buttonIndex) => {
      if (buttonIndex) return app.quit();

      loading.show();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      db.exec(sql);

      // app.getPath('userData')
      if (config.backup) fs.copyFileSync(config.backup.in, config.backup.out);

      db.write(config.db);

      loading.hide();
      dialog.showMessageBox(
        {
          title: 'Finalizado',
          message: 'Finalizado',
          buttons: ['Aceptar']
        },
        () => {
          app.quit();
        }
      );
    }
  );
}
