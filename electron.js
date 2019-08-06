const { app, BrowserWindow } = require('electron')
const config = require('./config')
const path = require('path');
const Store = require('./store');


// Storage Intergration
const store = new Store
({
  configName: 'user-preferences',
  defaults:
  {
    windowBounds: { width: 800, height: 600 }
  }

});


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.

  var { win_width, win_height } = store.get('windowBounds');


  win = new BrowserWindow({
    icon: 'images/RedDeskLogo.png',
    minWidth: 550,
    minHeight: 200,
    width: win_width,
    height: win_height,
    frame: config.frame,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.on('resize', () => 
  {
    var { win_width, win_height } = win.getBounds();
    store.set('windowBounds', { win_width, win_height});
  });

// and load the index.html of the app.
win.loadFile('index.html')

if(config.autohidemenu == true)
{
  win.setAutoHideMenuBar(true)
}


// Changes size of window if the dev tools are set to true
if(config.devMode == true)
{
  // Open the DevTools.
  win.webContents.openDevTools()
  win.setBounds({width: 1800})
}



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