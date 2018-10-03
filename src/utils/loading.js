import { BrowserWindow } from 'electron';

let win;
export default {
  create() {
    win = new BrowserWindow({
      width: 350,
      height: 200,
      frame: false,
      alwaysOnTop: true,
      show: false
    });
    // win.webContents.openDevTools();
    win.loadFile('public/loading.html');
  },
  show() {
    win.show();
  },
  hide() {
    win.hide();
  }
};
