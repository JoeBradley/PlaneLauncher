const PiController = require('./PiController');

// Socket Message Handler
class LaunchController {

    /**
     * 
     * @param {*} io - socket client 
     */
    constructor(io) {
        this.io = io;
        this.piController = new PiController();
    }

    connect() {
        const io = this.io.sockets;
        const piController = this.piController;

        io.on('connection', function (socket) {
            console.log('client connected', { client_id: socket.client.id });

            socket.on('launch', function (data) {
                console.log('launch', { data });
                io.emit('msg', JSON.stringify(data));

                switch (data.action) {
                    case 'takeoff':
                        console.log('[launch] takeoff: ' + data.value);
                        piController.launch(data.value);
                        break;
                    case 'horizontal':
                        console.log('[launch] horizontal: ' + data.value);
                        piController.horizontalServo.rotate(data.value);
                        break;
                    case 'vertical':
                        console.log('[launch] vertical: ' + data.value);
                        piController.verticalServo.rotate(data.value);
                        break;
                    default: break;
                }
            });
        });
    }
};

module.exports = function (io) {
    return new LaunchController(io);
};