const cfg = require('./env');
const Gpio = cfg.useMock ? 
    require('pigpio-mock').Gpio : 
    require('pigpio').Gpio;

const servoPulseWidthMin = 550;
const servoPulseWidthMax = 2300;
const servoMinAngle = -90;
const servoMaxAngle = 90;

/**
 * ref: https://components101.com/servo-motor-basics-pinout-datasheet
 */
class Servo {
    /**
     * Create new Servo.  Min/Max angle must be in range of Servo Min/Max range.
     * @param {number} pin GPIO pin number 
     * @param {*} minAngle min angle of servo (>= servoMinAngle)
     * @param {*} maxAngle max angle of servo (=< servoMaxAngle)
     */
    constructor(pin, minAngle, maxAngle) {
        this.motor = new Gpio(pin, { mode: Gpio.OUTPUT });
        this.minAngle = minAngle;
        this.maxAngle = maxAngle;
    }

    /**
     * Rotate horizontal servo
     * @param {number} angle [-90,90]
     */
    async rotateAsync(angle) {
        const pulseWidth = this.calculatePulseWidth(angle, this.minAngle, this.maxAngle);

        console.log('Rotate servo', { angle, pulseWidth });

        await this.setServoPulseWidthAsync(pulseWidth);
    };

    /**
     * Switch Servo off (pulse width = 0)
     */
    async offAsync() {
        const pulseWidth = 0;

        console.log('Set servo pulse width', { pulseWidth });

        await this.setServoPulseWidthAsync(pulseWidth);
    }

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

    async setServoPulseWidthAsync(pulseWidth) {
        return new Promise(resolve => {
            this.motor.servoWrite(pulseWidth);

            // Resolve once motor pulse width is near target (+/- 20)
            const intTimespan = 50;
            const maxWait = 300;
            let waited = 0;

            setTimeout(() => resolve(), maxWait);
            
            // let hdlr = setInterval(() => {
            //     waited += intTimespan;

            //     if (waited >= maxWait ||
            //         (this.motor.getServoPulseWidth() >= pulseWidth - 20 &&
            //             this.motor.getServoPulseWidth() <= pulseWidth + 20)) {
            //         clearInterval(hdlr);
            //         console.log('Servo pulse width set', { pulseWidth });
            //         resolve();
            //     }
            // }, intTimespan);
        });
    };
}

module.exports = Servo;