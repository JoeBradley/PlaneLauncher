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
    async forwardAsync(speed) {
        this.setDirection(MotorDirection.Forward);
        return this.setSpeed(speed);
    }

    /**
     * Set Direction Forward, with defined Speed
     * @param {number} speed motor percentage of maximum speed [0,100] 
     */
    async reverseAsync(speed) {
        this.setDirection(MotorDirection.Reverse);
        await this.setSpeed(speed);
    }

    /**
     * Slow speed to stop over timespan (from full-speed to full-stop)
     * @param {number} timespan ms.  Time to change from full-speed to full-stop
     */
    async brakeAsync(timespan) {
        const steps = 5;
        const ts = Math.round((this.speed / 100) * Math.max(timespan, 0));
        const stepSize = Math.round(this.speed / steps);

        while (this.speed > 0) {
            await this.setSpeed(this.speed -= stepSize);
            await sleep(ts);
        }

        this.off();
    }

    /**
     * Slow speed to stop
     */
    async stopAsync() {
        await this.setSpeed(0);
        this.off();
    }

    /**
     * Set motor to OFF position (both HIGH or both LOW)
     */
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
        return new Promise(resolve => {
            this.speed = Math.min(Math.max(speed, 0), 100);
            const dutyCycle = Math.min(Math.round(this.speed / 100 * this.maxDutyCycle), this.maxDutyCycle);
            this.enablePin.pwmWrite(dutyCycle);

            console.log('setSpeed', { speed: this.speed, target: dutyCycle, current: this.enablePin.getPwmDutyCycle() });

            let hdlr = setInterval(() => {

                if (this.enablePin.getPwmDutyCycle() >= dutyCycle - 20 && this.enablePin.getPwmDutyCycle() <= dutyCycle + 20) {
                    console.log('Speed set', { speed: this.speed, target: dutyCycle, current: this.enablePin.getPwmDutyCycle() });

                    clearInterval(hdlr);
                    resolve();
                }
            }, 50);
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

module.exports = { MotorDirection, Motor };