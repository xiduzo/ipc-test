// Empty

console.log(`process is alive!`);
const JohnnyFive = require("johnny-five");

const board = new JohnnyFive.Board({ port: "/dev/tty.usbserial-140" });

board.on("ready", () => {
    console.log("ready");
});
