import { app, dialog } from 'electron';
import dockOnMac from './utils/dockOnMac';
import fs from 'fs-extra';
import path from 'path';
import loading from './utils/loading';
import terminateError from './utils/terminate-error';
import writeDb from './write';
import wav from 'wav';
import logger from 'logger';

export default function main() {
  dockOnMac(true);
  dialog.showOpenDialog({ properties: ['openDirectory'] }, (dirs) => {
    if (dirs && dirs[0]) run(dirs[0]);
    else {
      logger.info('No path selected');
      app.quit();
    }
  });
}

async function run(dir) {
  loading.show();
  const data = fs
    .readdirSync(dir)
    .filter((x) => fs.lstatSync(path.join(dir, x)).isDirectory())
    .map((x) => {
      const match = /[0-9]{1,}/.exec(x);
      return match
        ? { dir: x, i: Number(match[0]), wav: getWav(path.join(dir, x)) }
        : null;
    })
    .filter((x) => x && x.wav.length)
    .sort((a, b) => a.i - b.i);

  for (let i = 0; i < data.length; i++) {
    const dirData = data[i];
    if (dirData.wav.length > 1) {
      return terminateError(
        `Error: Se encontraron varios ficheros wav en la carpeta "${
          dirData.dir
        }" y sus subcarpetas.`
      );
    }
  }

  const wavs = await Promise.all(
    data.map(async ({ i, wav }) => ({
      i,
      path: wav[0],
      length: await getDuration(wav[0])
    }))
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));
  await writeDb(wavs);
}

function getWav(dir) {
  const all = fs.readdirSync(dir);
  const files = all.filter(
    (x) => !fs.lstatSync(path.join(dir, x)).isDirectory()
  );
  const wavs = files
    .filter((x) => /\.wav$/i.exec(x))
    .map((x) => path.join(dir, x));

  return all
    .filter((x) => fs.lstatSync(path.join(dir, x)).isDirectory())
    .reduce((acc, x) => acc.concat(getWav(path.join(dir, x))), [])
    .concat(wavs);
}

async function getDuration(filepath) {
  return new Promise((resolve, reject) => {
    try {
      const { size } = fs.lstatSync(filepath);
      const stream = fs.createReadStream(filepath);
      const reader = new wav.Reader();
      // the "format" event gets emitted at the end of the WAVE header
      reader.on('format', function(format) {
        const byteRate = format.byteRate;
        const duration = size / byteRate;
        stream.close();

        const min = Math.floor(duration / 60);
        const toSec = duration - min * 60;
        const sec = Math.floor(toSec);
        const ms = toSec - sec;
        const str = { min: String(min), sec: String(sec), ms: String(ms) };
        resolve(
          `${str.min.length < 2 ? '0' + str.min : str.min}:${
            str.sec.length < 2 ? '0' + str.sec : str.sec
          }.${str.ms.slice(2, 5)}`
        );
      });
      stream.pipe(reader);
    } catch (e) {
      logger.error(e);
      terminateError(
        `Error: El archivo ${filepath} no es valido. ${e.message}`
      );
    }
  });
}
