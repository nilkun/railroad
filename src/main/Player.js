import Vector from "../engine/Vector.js";

export default class Player {
    constructor() {
        this.stations = [];
        this.rails = 0;
        this.trains = []
    }
    update() {
        for(let i = 0; i < this.trains.length; i++) {
            const train = this.trains[i];
            const target = new Vector(
                train.x - train.path[train.path.length - 1][0], 
                train.y - train.path[train.path.length - 1][1])
            train.x -= target.x * .004 * train.speed;
            train.y -= target.y * .004 * train.speed;
            if(Math.abs(train.x - train.path[train.path.length - 1][0]) > Math.abs(target.x * .004 * train.speed) + .1
            && Math.abs(train.y - train.path[train.path.length - 1][1]) > Math.abs(target.x * .004 * train.speed) + .1) {
                console.log("hit spot");
                train.x = train.path[train.path.length - 1][0]
                train.y = train.path[train.path.length - 1][1]
                train.path.pop();
            }
        }
    }

}