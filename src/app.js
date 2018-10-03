import { app } from 'electron';
import main from './main';
import loading from './utils/loading';
import terminateError from './utils/terminate-error';

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  try {
    loading.create();
    main();
  } catch (e) {
    terminateError(e.message);
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (!is.macos) {
  //   app.quit();
  // }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (mainWindow === null) {
  //   createWindow();
  // }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
