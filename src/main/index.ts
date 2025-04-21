import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import newFileHandler from './lib/handlers/newFile';
import "./lib/blockchain/utils";
import { chain, fileManager } from './lib/helpers/constants';
import mineBlock from './lib/handlers/mineBlock.js';
import readFile from './lib/handlers/readFile.js';

// import { assignI } from 'json-db-jdb';

// assignI("keys", "keypairs", {
//     pairs: JSON.stringify([]),
// });

function createWindow(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
        }
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) 
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    else
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'));

    // custom logics

    fileManager.loadUnminedQueueFromFile();
    fileManager.loadChainFromFile();
    
    ipcMain.on("new-file", (
        _, args: {
            status: "create" | "add"
            filename: string
            content: string
            parentId: string
        }
    ) => {
        newFileHandler(args.filename, args.content, args.parentId);
    });

    ipcMain.on("mine", mineBlock);

    ipcMain.on("get-chain", event => {
        event.reply("full-chain", { req_chain: chain.getChain() });
    });

    ipcMain.on("read-file", readFile)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron');

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    // IPC test);
    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) 
            createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});