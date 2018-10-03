import { app, dialog } from 'electron';
import loading from './loading';

export default function terminateError(message) {
  loading.hide();
  dialog.showMessageBox(
    {
      title: 'Error',
      message,
      type: 'error',
      buttons: ['Aceptar']
    },
    () => {
      app.quit();
    }
  );
}
