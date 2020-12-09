const socket = io(); //load socket.io-client and connect to the host that serves the page

const logger = document.getElementById("logs");
const pilotText = document.getElementById("pilot");
const msgText = document.getElementById("msg");
const sendButton = document.getElementById("send");

const launchButton = document.getElementById("launch");
const speedSlider = document.getElementById("speed");
const verticalSlider = document.getElementById("vertical");
const horizontalSlider = document.getElementById("horizontal");

window.addEventListener("load", function () { //when page loads
    msgText.addEventListener("keyup", function (event) {
        if (event.key.toLocaleLowerCase() === 'enter') {
            msgText.value = msgText.value.slice(0, -1);
            sendMessage();
        }
    });

    sendButton.addEventListener("click", sendMessage);
    launchButton.addEventListener("click", () => sendAction('takeoff', +speedSlider.value));
    verticalSlider.addEventListener("change", (event) => sendAction('vertical', +event.target.value));
    horizontalSlider.addEventListener("change", (event) => sendAction('horizontal', +event.target.value));
});

function sendMessage() {
    const msg = msgText.value;
    if (msg === '' || msg === undefined) {
        return;
    }
    
    const name = pilotText.value || 'Pilot';
    console.log('msg', { msg, name });
    socket.emit('msg', { msg, name });
    msgText.value = '';
};

function sendAction(action, value) {
    socket.emit('launch', { action, value });
}

socket.on('msg', function (msg) {
    console.log('msg', { msg });
    let logs = msg + '\n' + logger.value;
    logger.value = logs;
});

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
};
