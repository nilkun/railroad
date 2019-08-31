export default class Delta {
    constructor() {
        this._previous;
        this._current;
        this.time;

        this.reset();
    }

    update() {
        this._previous = this._current;
        this._current = Date.now();
        this.time = .001 * (this._current - this._previous); // TIME IN SECONDS
    }
    
    start() {
        this.reset();
    }

    reset() {
        this._previous = Date.now();
        this._current = Date.now();
        this.time = 0;
    }
}

