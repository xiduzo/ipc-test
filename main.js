// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, utilityProcess } = require("electron");
const path = require("node:path");

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile("index.html");

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
    createProcesses(); // init with some processes

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("test", async (event, request) => {
    cleanupProcesses();
    console.debug("recieved request", request);
    event.reply("test-response", "hello from main");
    createProcesses(); // Create some for the next round of freezes
});

const processes = new Map();

// Create some utility processes
function createProcesses() {
    const filePath = path.join(__dirname, "test.js");
    console.debug("creating process");
    const newProcess = utilityProcess.fork(filePath, [""], {
        stdio: "pipe",
    });

    newProcess.on("spawn", () => {
        console.debug(`[newProcess] pid: ${newProcess.pid}`);
        processes.set(Number(newProcess.pid), newProcess);
    });

    newProcess.stdout?.on("data", (data) => {
        console.debug("[newProcess]", data.toString());
    });
}

function cleanupProcesses() {
    for (const [pid, process] of Array.from(processes)) {
        process.on("exit", () => {
            console.debug(`[CLEANUP] process ${pid} exited`);
            processes.delete(pid);
        });
        // Killing utility processes will freeze the main process and renderer process
        // see https://github.com/electron/electron/issues/45053
        console.time("kill");
        process.kill();
        console.timeEnd("kill");
    }
}
