/*  Methods: 
    Modifies the vector     Returns a new vector                Returns a scalar
        add                     added                               angle
        limit                   cloned                              distanceSq 
        normalize               inLocalSpace                        dot
        replace                 normalized                          equals 
        reset                   perpendicularClockwise              magnitude
        reverse                 perpendicularCounterClockwise       magnitudeSq
        rotate                  rotated
        scale                   scaled
        set                     subtracted  
        setDirection 
        setMagnitude                
        subtract
        truncate
*/

export default class Vector {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }

    // Modifies the vector
    add(vector2) {
        this.x += vector2.x;
        this.y += vector2.y;
    }
    subtract(vector2) {
        this.x -= vector2.x;
        this.y -= vector2.y;
    }
    truncate(max) {
        if((this.x * this.x + this.y * this.y) > max * max) {
            const oldMagnitude = Math.sqrt((this.x * this.x + this.y * this.y));
            const newMagnitude = max / oldMagnitude;
            this.x *= newMagnitude;
            this.y *= newMagnitude;
        }
    }
    normalize() {
        const magnitude = Math.sqrt(
            this.x * 
            this.x + 
            this.y * 
            this.y
        );
        if(magnitude > 0) {
            this.x /= magnitude;
            this.y /= magnitude;
        }
    }
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    rotate(radians) {
        const x = this.x;
        this.x = (this.x * Math.cos(radians)) - (this.y * Math.sin(radians));
        this.y = (x * Math.sin(radians)) + (this.y * Math.cos(radians));
    }
    replace(vector2) {
        this.x = vector2.x;
        this.y = vector2.y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }

    // Returns a new vector
    scaled(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    normalized() {
        const magnitude = Math.sqrt(
            this.x * 
            this.x + 
            this.y * 
            this.y
        );
        return magnitude > 0 ? new Vector(this.x / magnitude, this.y / magnitude) : new Vector;
    }
    added(vector2) {
        return new Vector(this.x + vector2.x, this.y + vector2.y);
    }

    subtracted(vector2) {
        return new Vector(this.x - vector2.x, this.y - vector2.y);
    }

    perpendicularClockwise() {
        return new Vector(this.y, -this.x);
    }
    perpendicularCounterClockwise() {
        return new Vector(-this.y, this.x);
    }

    rotated(radians) {        
        const x = (this.x * Math.cos(radians)) - (this.y * Math.sin(radians));
        const y = (this.x * Math.sin(radians)) + (this.y * Math.cos(radians));

        return new Vector(x, y);
    }
    inLocalSpace(position, heading) {
        let localPosition = new Vector(this.x - position.x, position.y - this.y);
        let angle = heading.angle();
        localPosition.rotate(-angle);
        return localPosition;
    }
    cloned() {
        return new Vector(this.x, this.y);
    }

    // Returns a scalar
    dot(vector2) {
        return (this.x * vector2.x + this.y * vector2.y);
    }
    magnitude() {
        return Math.sqrt(
            this.x * 
            this.x + 
            this.y * 
            this.y
        );
    }

    magnitudeSq() {
        return (
            this.x * 
            this.x + 
            this.y * 
            this.y
        );
    }
    distanceSq(target) {
        return (this.x-target.x) * (this.x-target.x) + (this.y-target.y) * (this.y-target.y);
    }

    angle(mag = 1) {
        if(this.x===0 && this.y===0) return 0;
        const angle = Math.atan2(this.y, this.x);
        return angle;
    }

    equals(vector2) {
        return (this.x === vector2.x && this.y === vector2.y);
    }

    limit(max) {
        if(this.magnitudeSq() > max) {
            this.normalize()
            this.scale(max);
        }
    }

    setDirection(magnitude, angle) {
        const x = Math.sin(angle);
        const y = -Math.cos(angle);
        this.x = x * magnitude;
        this.y = y * magnitude;
    }

    reset() {
        this.x = 0;
        this.y = 0;
    }
    reverse() {
        this.x = -this.x;
        this.y = -this.y;
    }

    setMagnitude(mag) {
        const currentMagnitude = 
            Math.sqrt(
                this.x * 
                this.x + 
                this.y * 
                this.y
            );
        const scalingFactor = mag / currentMagnitude;
        this.x *= scalingFactor;
        this.y *= scalingFactor;
    }
}