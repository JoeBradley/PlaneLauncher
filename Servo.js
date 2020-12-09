const Gpio = process.env.NODE_ENV !== "production" ?
    require("pigpio-mock").Gpio :
    require("pigpio").Gpio;

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
        return new Promise(resolve => { 
            const pulseWidth = this.calculatePulseWidth(angle, this.minAngle, this.maxAngle);

            console.log('Set servo pulseWidth', { angle, pulseWidth });
    
            this.motor.servoWrite(pulseWidth);   

            // Resolve once motor pulse width is near target (+/- 20)
            let hdlr = setInterval(() => { 
                if (this.motor.getServoPulseWidth() >= pulseWidth - 20 &&  this.motor.getServoPulseWidth() <= pulseWidth + 20){
                    clearInterval(hdlr);
                    console.log('Servo pulseWidth set', { angle, pulseWidth });
                    resolve();
                }
            }, 50); 
        });
    };

    /**
     * Switch Servo off (pulse width = 0)
     */
    async offAsync() {
        return new Promise(resolve => { 
            const pulseWidth = 0;
            
            console.log('Set servo pulseWidth', { pulseWidth });
    
            this.motor.servoWrite(pulseWidth);   
            
            // Resolve once motor pulse width is near target (+/- 20)
            let hdlr = setInterval(() => { 
                if (this.motor.getServoPulseWidth() >= pulseWidth - 20 &&  this.motor.getServoPulseWidth() <= pulseWidth + 20){
                    clearInterval(hdlr);
                    console.log('Servo pulseWidth set', { angle, pulseWidth });
                    resolve();
                }
            }, 50); 
        });
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
}

module.exports = Servo;