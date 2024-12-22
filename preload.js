/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, ipcRenderer } = require('electron');

// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }

//   for (const type of ['chrome', 'node', 'electron']) {
//     replaceText(`${type}-version`, process.versions[type])
//   }
// })

const handlers = {
  ipc: {
    send: (channel, data) => {
      console.time(`send ${channel}`);
      ipcRenderer.send(channel, data);
      console.timeEnd(`send ${channel}`);
    },
    on: (channel, callback) => {
      const listener = (_event, response) => callback(response);
      ipcRenderer.on(channel, listener);
    },
  }
}

contextBridge.exposeInMainWorld('electron', handlers);