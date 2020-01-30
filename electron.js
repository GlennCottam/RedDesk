const { app, BrowserWindow, globalShortcut } = require('electron');
const electron = require('electron');
const Store = require('electron-store');
const store = new Store();

let win

// Storing and retreiving user information
if(store.get('default') == null)
{
  console.log("User Pref Empty, storing defaults");
  setDefaultPref();
}
else if(store.get('default') == true)
{
  console.log('Defaults Found');
}
else if(store.get('default') == false)
{
  console.log('Custom User Prefs found');
}
else
{
  console.log("invalid preferences loaded, setting defaults");
  setDefaultPref();
}

function restartWindow()
{
  win.close();
  createWindow();
}

// Sets default values
function setDefaultPref()
{
  console.log("Setting Default Preferences");
  store.set('win_width', 800);
  store.set('win_height', 600);
  store.set('autoHideMenu', false);
  store.set('frame', true);
  store.set('devMode', false);
  store.set('default', true);
  
  restartWindow();
}

function toggleDevMode()
{
  var devMode = store.get('devMode');

  if(devMode == false)
  {
    store.set('devMode', true);
  }
  else if(devMode == true)
  {
    store.set('devMode', false);
  }
  else
  {
    console.log("Unknown Value, resetting to Defaults");
    setDefaultPref();
  }

  restartWindow();
}


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.


function createWindow () {
  // Menu Options
  const Menu = electron.Menu;

  const menuTemplate = [
    {
      label: 'RedDesk',
      submenu: [
        {
          label: 'About RedDesk',
          click: () => {  }
        },
        {
          label: 'Restart Window',
          accelerator: 'CommandOrControl+Shift+R',
          click: () => { restartWindow(); }
        },
        {
          label: 'Load Defaults',
          accelerator: 'CommandOrCountrol+Shift+L',
          click: () => { setDefaultPref(); }
        },
        {
          label: 'Toggle Development Mode',
          accelerator: 'CommandOrControl+Shift+D',
          click: () => { toggleDevMode(); }
        },
        {
          label: 'Exit',
          accelerator: 'CommandOrControl+Q',
          click: () => { app.quit(); }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  var win_width = store.get('win_width');
  var win_height = store.get('win_height');

  // Create the browser window.
  win = new BrowserWindow({
    icon: 'images/RedDeskLogo.png',
    minWidth: 550,
    minHeight: 200,
    width: win_width,
    height: win_height,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

// and load the index.html of the app.
win.loadFile('index.html')

if(store.get('autoHideMenu') == true)
{
  win.removeMenu();
}

if(store.get('devMode') == true)
{
  win.webContents.openDevTools();
  var width = store.get('win_width');
  var height = store.get('win_height');

  width += 800;
  console.log("width: " + win_width);

  win.setBounds({ width: width, height: height });
}

win.on('resize', () => 
{
  var { width, height } = win.getBounds();
  store.set('win_width', width);
  store.set('win_height', height);
});

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.