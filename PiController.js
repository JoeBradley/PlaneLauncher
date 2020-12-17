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
        this.catapultServo = new Servo(22, -45, 20);

        // this.leftMotor = new Motor.Motor(14, 15, 18, false);
        // this.rightMotor = new Motor.Motor(16, 20, 21, true);

        //function to run when user closes using ctrl+c
        //process.on('SIGINT', () => {
         //   this.horizontalServo.offAsync();
         //   this.verticalServo.offAsync();
         //   this.catapultServo.offAsync();
            // await this.leftMotor.offAsync();
            // await this.rightMotor.offAsync();
        //});
    }

    /**
     * Rotate horizontal servo
     * @param {number} angle - angle to rotate [-90,90]
     */
    async rotateHorizontalAsync(angle) {
        await this.horizontalServo.rotateAsync(angle);
    };

    /**
     * Rotate vertical servo
     * @param {number} angle - angle to rotate [0,90]
     */
    async rotateVerticalAsync(angle) {
        await this.verticalServo.rotateAsync(angle);
    }

    /**
     * Launch the plane. Start both motors forward for 3 seconds, then brake.
     * @param {number} speed launch speed [0, 100]
     */
    async launchAsync(speed) {
        // Reset catapult, Start motors, wait until they reach speed
        await Promise.all([
        //     await this.leftMotor.forwardAsync(speed), 
        //     await this.rightMotor.forwardAsync(speed)
            await this.catapultServo.rotateAsync(this.catapultServo.minAngle),
            await this.sleep(3000)
        ]);

        // trigger catapult
        await this.catapultServo.rotateAsync(this.catapultServo.maxAngle);

        // wait a little time to ensure plane launched successfully
        await this.sleep(100);

        // Stop motors and reset catapult
        await Promise.all([
            // await this.leftMotor.brakeAsync(), 
            // await this.rightMotor.brakeAsync(),
            await this.catapultServo.rotateAsync(this.catapultServo.minAngle)
        ]);

        // switch off catapult
        await this.catapultServo.offAsync();
    }

    /**
     * Sleep for set time
     * @param {number} timespanMs timespan ms to sleep
     */
    async sleep(timespanMs) {
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, timespanMs);
        });
    }
}

module.exports = new PiController();