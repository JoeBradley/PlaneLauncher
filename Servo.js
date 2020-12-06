const Gpio = process.env.NODE_ENV !== "production" ?
    require("pigpio-mock").Gpio :
    require("pigpio").Gpio;

const servoPulseWidthMax = 2000;
const servoPulseWidthMin = 500;
const servoMinAngle = -90;
const servoMaxAngle = 90;

class Servo {
    constructor(pin, minAngle, maxAngle) {
        this.motor = new Gpio(pin, { mode: Gpio.OUTPUT });
        this.minAngle = minAngle;
        this.maxAngle = maxAngle;
    }

    /**
     * Rotate horizontal servo
     * @param {number} angle [-90,90]
     */
    rotate(angle) {
        const pulseWidth = this.calculatePulseWidth(angle, this.minAngle, this.maxAngle);

        console.log('Set servo pulseWidth', { pulseWidth });
        this.motor.servoWrite(pulseWidth);
    };

    /**
     * Calcuate the pulse with for the given angle
     * @param {number} angle 
     * @param {number} minAngle 
     * @param {number} maxAngle
     * @returns {number} servo pulse width 
     */
    calculatePulseWidth(angle, minAngle, maxAngle) {
        // ensure angle with min max of servo range, and desired range (could be less than range of the sero)
        let minR = Math.max(minAngle, servoMinAngle);
        let maxR = Math.max(maxAngle, servoMaxAngle);
        let r = Math.max(Math.min(angle, maxR), minR);

        const offset = servoMinAngle < 0 ? Math.abs(servoMinAngle) : Math.abs(servoMinAngle) * -1;
        const min = servoMinAngle + offset;
        const max = servoMaxAngle + offset;
        const adjR = r + offset;

        const per = (1 - ((max - adjR) / max));

        const pw = Math.round((servoPulseWidthMax - servoPulseWidthMin) * per) + servoPulseWidthMin;

        return pw;
    }
}

module.exports = Servo;