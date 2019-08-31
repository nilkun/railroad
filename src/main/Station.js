export default class Station {
    constructor(x, y, name, owner, id) {
        this.x = x;
        this.y = y
        this.level = 0;
        this.name = name;
        this.owner = owner;
        this.type = 1;
        this.connectedTo = new Map;
        this.id = id;
    }

    addConnection(station, distance = 10) {
        if(station.id !== this.id) {
            this.connectedTo.set(station.id, station);
                // [station.id] = station;
        }
        // this.connectedTo.push({station, distance})
    }
}