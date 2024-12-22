/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
let count = 0;
const counter = document.getElementById('counter')

const FPS_60 = 1000 / 60

setInterval(() => {
    counter.innerHTML = ++count;
}, FPS_60)

const button = document.getElementById('freeze-button')

window.electron.ipc.on('test-response', response => {
    console.timeEnd('ipc')
    console.log('received response', response)
})

button.addEventListener('click', () => {
    console.time('ipc')
    window.electron.ipc.send('test', 'hello from renderer')
})