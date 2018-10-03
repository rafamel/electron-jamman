import { app } from 'electron';
import { is } from 'electron-util';

export default (show = true) => {
  if (is.macos) {
    if (show) app.dock.show();
    else app.dock.hide();
  }
};
