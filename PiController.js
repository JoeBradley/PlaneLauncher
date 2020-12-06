// ref:https://www.raspberrypi.org/documentation/usage/gpio/
const Servo = require('./Servo');
//const Motor = require('./Motor');

/**
 * RaspberryPI Controller with connected components
 */
class PiController {

    /**
     * Initialize components
     */
    constructor() {
        this.horizontalServo = new Servo(17, -90, 90);
        this.verticalServo = new Servo(27, 0, 90);

        // this.leftMotor = new Motor.Motor(0, 0, 0, false);
        // this.rightMotor = new Motor.Motor(0, 0, 0, true);
    }

    /**
     * Rotate horizontal servo
     * @param {number} angle - angle to rotate [-90,90]
     */
    rotateHorizontal(angle) {
        this.horizontalServo.rotate(angle);
    };

    /**
     * Rotate vertical servo
     * @param {number} angle - angle to rotate [0,90]
     */
    rotateVertical(angle) {
        this.verticalServo.rotate(angle);
    }

    /**
     * Launch the plane. Start both motors forward for 3 seconds, then brake.
     * @param {number} speed launch speed [0, 100]
     */
    launch(speed) {
        // this.leftMotor.forward(speed);
        // this.rightMotor.forward(speed);

        // setTimeout(() => {
        //     this.leftMotor.brake(1000);
        //     this.rightMotor.brake(1000);

        //     setTimeout(() => {
        //         this.leftMotor.off();
        //         this.rightMotor.off();
        //     }, 1100);
        // }, 3000);
    }
}

module.exports = PiController;