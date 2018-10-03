const registerSx = (sx, _ = (global.SX = {})) =>
  Object.keys(sx).forEach((key) => (global.SX[key] = sx[key]));
const sx = (name) => `node -r ./package-scripts.js -e "global.SX.${name}()"`;
const scripts = (x) => ({ scripts: x });
const exit0 = (x) => `${x} || shx echo `;
const series = (x) => `(${x.join(') && (')})`;
// const intrim = (x) => x.replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

const APP_NAME = 'jamman';
const BUILD_DIR = 'build';
const PKG_DIR = 'dist';

const package = ({ platform, arch }) =>
  `electron-packager ./ ${APP_NAME} --platform=${platform}${
    arch ? ` --arch=${arch} ` : ' '
  }--out=${PKG_DIR}/`;

process.env.LOG_LEVEL = 'disable';
module.exports = scripts({
  start: series([
    exit0(`shx rm -r ${BUILD_DIR}`),
    `shx mkdir ${BUILD_DIR}`,
    exit0('nps lint'),
    `babel src --out-dir ${BUILD_DIR}`,
    'electron .'
  ]),
  dev: 'onchange "./src/**/*.{js,jsx,ts}" -i -- nps private.dev',
  pkg: {
    default: series([
      'nps validate build',
      exit0(`shx rm -rf ${PKG_DIR}`),
      `mkdir ${PKG_DIR}`,
      'nps private.pkg'
    ]),
    darwin: 'nps validate private.pkg.build private.pkg.darwin',
    x86: 'nps validate private.pkg.build private.pkg.x86',
    x86_64: 'nps validate private.pkg.build private.pkg.x86_64',
    win32: 'nps validate private.pkg.build private.pkg.win32'
  },
  fix: `prettier --write "./src/**/*.{js,jsx,ts,json,scss}"`,
  lint: {
    default: 'eslint ./src --ext .js',
    test: 'eslint ./test --ext .js',
    md: 'markdownlint *.md --config markdown.json'
  },
  validate: 'nps fix lint lint.md private.validate_last',
  update: 'npm update --save/save-dev && npm outdated',
  clean: `${exit0(
    `shx rm -r ${BUILD_DIR} ${PKG_DIR} coverage`
  )} && shx rm -rf node_modules`,
  // Private
  private: {
    dev: `${sx('clear')} && ${exit0(
      'nps lint'
    )} && babel src --out-dir ${BUILD_DIR} && electron .`,
    pkg: {
      default:
        'nps private.pkg.darwin private.pkg.x86 private.pkg.x86_64 private.pkg.win32',
      darwin: package({ platform: 'darwin' }),
      x86: package({ platform: 'linux', arch: 'ia32' }),
      x86_64: package({ platform: 'linux', arch: 'x64' }),
      win32: package({ platform: 'win32', arch: 'all' }),
      build: series([
        exit0(`shx rm -r ${BUILD_DIR}`),
        `shx mkdir ${BUILD_DIR}`,
        'nps private.pkg.babel'
      ]),
      babel: `cross-env NODE_ENV=production babel src --out-dir ${BUILD_DIR}`
    },
    validate_last: `npm outdated || ${sx('countdown')}`
  }
});

registerSx({
  clear: () => console.log('\x1Bc'),
  countdown: (i = 8) => {
    if (!process.env.MSG) return;
    console.log('');
    const t = setInterval(() => {
      process.stdout.write('\r' + process.env.MSG + ' ' + i);
      !i-- && (clearInterval(t) || true) && console.log('\n');
    }, 1000);
  }
});
