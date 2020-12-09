const PiController = require('./PiController');

// Socket Message Handler
class LaunchController {

    /**
     * Launch controller listens for commands fom the client, and takes action 
     * @param {socket.io.Server} server - socket IO server 
     */
    constructor(server) {
        this.server = server;
        this.piController = new PiController();
    }

    connect() {
        const sockets = this.server.sockets;
        const piController = this.piController;

        sockets.on('connection', function (socket) {
            console.log('client connected', { client_id: socket.client.id });

            socket.on('launch', async (data) => {
                console.log('launch', { data });
                sockets.emit('msg', JSON.stringify(data));

                switch (data.action) {
                    case 'takeoff':
                        console.log('[launch] takeoff: ' + data.value);
                        await piController.launchAsync(data.value);
                        break;
                    case 'horizontal':
                        console.log('[launch] horizontal: ' + data.value);
                        await piController.horizontalServo.rotateAsync(data.value);
                        break;
                    case 'vertical':
                        console.log('[launch] vertical: ' + data.value);
                        await piController.verticalServo.rotateAsync(data.value);
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