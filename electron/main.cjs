const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const PORT = 43123;
let serverProcess;

function serverPath() {
  return path.join(process.resourcesPath, 'app', '.next', 'standalone', 'server.js');
}

function waitForServer(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const check = () => {
      const req = http.get(url, res => { res.resume(); resolve(); });
      req.on('error', () => {
        if (Date.now() - started > timeout) reject(new Error('Local app server did not start'));
        else setTimeout(check, 250);
      });
      req.setTimeout(1000, () => req.destroy());
    };
    check();
  });
}

async function startServer() {
  const cwd = path.dirname(serverPath());
  serverProcess = spawn(process.execPath, [serverPath()], {
    cwd,
    env: { ...process.env, PORT: String(PORT), HOSTNAME: '127.0.0.1', NODE_ENV: 'production' },
    windowsHide: true,
    stdio: 'ignore',
  });
  await waitForServer(`http://127.0.0.1:${PORT}/tools/`);
}

async function createWindow() {
  await startServer();
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'RBLXFinder — Noobie Gaming Hub',
    backgroundColor: '#f8fafc',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  await win.loadURL(`http://127.0.0.1:${PORT}/tools/`);
}

app.whenReady().then(createWindow).catch(err => {
  console.error(err);
  app.quit();
});

app.on('window-all-closed', () => app.quit());
app.on('before-quit', () => {
  if (serverProcess && !serverProcess.killed) serverProcess.kill();
});
