import {app, BrowserWindow, ipcMain, screen, shell, dialog} from 'electron'
import {release} from 'node:os'
import {join} from 'node:path';
import * as remoteMain from '@electron/remote/main';
import {initApp} from "./modules/init";
import {AppServer} from "./modules/Server";
import {getHostIp} from "./utils/utility";
import {download} from 'electron-dl';
import Store from "electron-store";
import {ConfigModel, FileModel} from "../models";
import {DownloadManager} from "./modules/DownloadManager";

Store.initRenderer();
const settings = new Store();
const APP_CONFIG: ConfigModel = settings.get('config') as ConfigModel;

remoteMain.initialize();
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null, downloadManager: DownloadManager;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {

  const screenSize = screen.getPrimaryDisplay().size;
  const width = 1000, height = 800;
  win = new BrowserWindow({
    title: 'Share App',
    width,
    height,
    fullscreenable: false,
    x: (screenSize.width -  width),
    y: (screenSize.height - height),
    resizable: false,
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  remoteMain.enable(win.webContents);

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  /**
   * Initialize download manager
   */
  downloadManager = new DownloadManager(win, {
    maxDownloadInstances: 3,
    savePath: APP_CONFIG.destinationDir
  });
  downloadManager.listenToDownloadEvents();

  initWindowEvents();
}

function initWindowEvents() {
  win.on('close', async (e) => {
    e.preventDefault();
    const downloadsCount = downloadManager.getDownloadQueue().length;

    if (downloadsCount == 0) {
      win.destroy();
      return;
    }

    const choice = await dialog.showMessageBox(
        win,
        {
          type: 'question',
          buttons: ['Yes', 'No, hang on'],
          title: 'Are you sure?',
          message: `There are 4 instances of downloads running, quiting will abort all downloads`
        }
    );

    if (choice.response === 0) {
      await downloadManager.cancelAllDownloads();
      win.destroy();
    }
  });
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})


initApp(settings)
    .catch(console.error)

// Init server
const appServer = new AppServer();
appServer.startServer();

ipcMain.handle('get-ip', async (_, arg) => {
  return getHostIp();
})

ipcMain.handle('find-rooms', async (_, arg) => {
  return await appServer.shareRoom.findRooms();
})

ipcMain.handle('create-room', async (_, arg) => {
  const {name, maxParticipants} = JSON.parse(arg);

  return await appServer.createRoom(name, maxParticipants);
});

ipcMain.handle('close-room', async (_, arg) => {
  appServer.closeRoom();
  return true;
});

ipcMain.on('open-file', async (event, path) => {
  shell.openPath(path)
  shell.beep()
});

ipcMain.on('open-destination-folder', async (event, path) => {
  const config: ConfigModel = settings.get('config') as ConfigModel;
  shell.openPath(config.destinationDir)
});

ipcMain.handle('select-dir', async (_, arg) => {
  const {filePaths} = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return filePaths[0];
});


app.on('quit', () => {
  appServer.stopServer();
})


// interface FileDownload extends FileModel {
//   downloadItemHandler: DownloadItem;
//   url: string;
// }
// let filesInDownload: FileDownload[] = [];
// ipcMain.on('download-file', async (event, arg) => {
//   const file = JSON.parse(arg) as FileDownload;
//   // url
//   const url = `http://${file.device.machineIp}:2391/download?path=${file.device.path}&type=${file.type}`
//   console.log(url)
//   // Get config
//   const config: ConfigModel = settings.get('config') as ConfigModel;
//   await download(win, url, {
//     directory: config.destinationDir,
//     openFolderWhenDone: false,
//     overwrite: true,
//     saveAs: false,
//     onStarted: (item) => {
//       file.downloadItemHandler = item;
//       filesInDownload.push(file);
//       win.webContents.send('file-download-started', JSON.stringify({
//         fileId: file.id,
//         canResume: item.canResume()
//       }));
//     },
//     onProgress(progress) {
//       win.webContents.send('file-download-progress', JSON.stringify({
//         fileId: file.id,
//         ...progress
//       }))
//     },
//     onTotalProgress(progress) {
//       win.webContents.send('total-download-progress', JSON.stringify({
//         fileId: file.id,
//         ...progress
//       }))
//     },
//     onCompleted(data) {
//       win.webContents.send('file-download-complete', JSON.stringify({
//         fileId: file.id,
//         path: data.path
//       }))
//     },
//     onCancel(_) {
//       win.webContents.send('file-download-canceled', JSON.stringify({
//         fileId: file.id,
//       }))
//     },
//   });
// });