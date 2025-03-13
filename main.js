const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let tray;
let timerInterval;
let timeLeft = 20 * 60; // Default 20 minutes

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        enableRemoteModule: false,
    },
  });

  mainWindow.loadFile('index.html');

  tray = new Tray(path.join(__dirname, 'assets', 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Quit', click: () => {
      clearInterval(timerInterval);
      app.quit();
    }}
  ]);

  tray.setToolTip('Pomodoro Timer');
  tray.setContextMenu(contextMenu);

  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide(); // Minimize to tray
  });

  ipcMain.on('start-timer', (event, time) => {
    clearInterval(timerInterval);
    timeLeft = time * 60;

    timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        event.reply('timer-finished');
      } else {
        timeLeft--;
        event.reply('update-timer', timeLeft);
      }
    }, 1000);
  });

  ipcMain.on('pause-timer', () => {
    clearInterval(timerInterval);
  });

  ipcMain.on('reset-timer', (event, time) => {
    clearInterval(timerInterval);
    timeLeft = time * 60;
    event.reply('update-timer', timeLeft);
  });
});
