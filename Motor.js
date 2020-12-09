const Gpio = process.env.NODE_ENV !== "production" ?
    require("pigpio-mock").Gpio :
    require("pigpio").Gpio;

const MotorDirection = {
    Forward: true,
    Reverse: false,
};

/**
 * DC Motor (L298N)
 * ref: https://randomnerdtutorials.com/esp32-dc-motor-l298n-motor-driver-control-speed-direction/
 */
class Motor {

    get maxDutyCycle() { return 2000; }

    /**
     * Setup DC Motor with direction and speed control. 
     * @param {number} enablePin Pin to control speed 
     * @param {number} input1Pin Pin to control direction High
     * @param {number} input2Pin Pin to control direction Low
     * @param {boolean} reverse Switch High/Low if cables around the wrong way. Default to false.
     */
    constructor(enablePin, input1Pin, input2Pin, reverse) {
        this.reversedDirection = reverse ? false : true;

        this.enablePin = new Gpio(enablePin, { mode: Gpio.OUTPUT });
        this.enablePin
            .pwmRange(this.maxDutyCycle)
            .pwmWrite(0);

        this.input1Pin = new Gpio(input1Pin, { mode: Gpio.OUTPUT });
        this.input2Pin = new Gpio(input2Pin, { mode: Gpio.OUTPUT });

        this.speed = 0;
        this.direction = MotorDirection.Forward;
    }

    /**
     * Set Direction Forward, with defined Speed
     * @param {number} speed motor percentage of maximum speed [0,100] 
     */
    forward(speed) {
        this.setSpeed(speed);
        this.setDirection(MotorDirection.Forward);
    }

    /**
     * Set Direction Forward, with defined Speed
     * @param {number} speed motor percentage of maximum speed [0,100] 
     */
    reverse(speed) {
        this.setSpeed(speed);
        this.setDirection(MotorDirection.Reverse);
    }

    /**
     * Slow speed to stop over timespan (from full-speed to full-stop)
     * @param {number} timespan ms.  Time to change from full-speed to full-stop
     */
    brake(timespan) {
        const steps = 5;
        const ts = Math.round((this.speed / 100) * Math.max(timespan, 0));
        const stepInterval = Math.round(ts / steps);
        const stepSize = Math.round(this.speed / steps);

        let intHdlr = setInterval(() => {
            this.setSpeed(this.speed -= stepSize);

            if (this.speed == 0) {
                clearInterval(intHdlr);
            }
        }, stepInterval);
    }

    /**
     * Slow speed to stop
     */
    stop() {
        this.setSpeed(0);
    }

    off() {
        this.input1Pin.digitalWrite(this.direction ? 1 : 0);
        this.input2Pin.digitalWrite(this.direction ? 1 : 0);

        console.log('off', {
            input1: this.input1Pin.digitalValue,
            input2: this.input2Pin.digitalValue
        });
    }

    /**
     * Set the speed of the motor
     * @param {number} speed [0,100] 
     */
    setSpeed(speed) {
        this.speed = Math.min(Math.max(speed, 0), 100);
        const dutyCycle = Math.min(Math.round(this.speed / 100 * this.maxDutyCycle), this.maxDutyCycle);
        this.enablePin.pwmWrite(dutyCycle);

        console.log('setSpeed', {
            speed: this.speed,
            dutyCycle
        });
    }

    /**
     * Set the direction of the motor
     * @param {MotorDirection} direction forward or reverse 
     */
    setDirection(direction) {
        // Flip direciton if it should be reversed (when wired incorrectly)
        this.direction = this.reversedDirection ? !direction : direction;

        this.input1Pin.digitalWrite(this.direction ? 1 : 0);
        this.input2Pin.digitalWrite(!this.direction ? 1 : 0);

        console.log('setDirection', {
            direction: this.direction,
            input1: this.input1Pin.digitalValue,
            input2: this.input2Pin.digitalValue
        });
    }
}

module.exports = { MotorDirection, Motor };