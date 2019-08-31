'use strict'
import Screen from "./../engine/Screen.js"
import TileManager from "../tiles/TileManager.js";
import Delta from "./../engine/DeltaTime.js";
import Toolbox from "../Toolbox.js";
import Vector from "../engine/Vector.js";
import Station from "./Station.js";
import Player from "./Player.js";
import AssetsManager from "../engine/AssetsManager.js";
import FIND from "./Find.js"
import Train from "./Train.js";
const cities =[ "Kabul", "Tirana", "Algiers", "Andorra la Vella", "Luanda", "Saint John's", 
"Buenos Aires", "Yerevan", "Canberra", "Vienna", "Baku", "Nassau", "Manama", "Dhaka", "Bridgetown", 
"Minsk", "Brussels", "Belmopan", "Porto-Novo", "Thimphu", "La Paz", "Sarajevo", "Gaborone", "Brasilia", 
"Bandar Seri Begawan", "Sofia", "Ouagadougou", "Gitega", "Phnom Penh", "Yaounde", "Ottawa", "Praia", "Bangui", 
"N'Djamena", "Santiago", "Beijing", "Bogota", "Moroni", "Brazzaville", "Kinshasa", "San Jose", "Yamoussoukro", 
"Zagreb", "Havana", "Nicosia", "Prague", "Copenhagen", "Djibouti", "Roseau", "Santo Domingo", "Quito", "Cairo", 
"San Salvador", "Malabo", "Asmara", "Tallinn", "Addis Ababa", "Suva", "Helsinki", "Paris", "Libreville", "Banjul", 
"Tbilisi", "Berlin", "Accra", "Athens", "Saint George's", "Guatemala City", "Conakry", "Bissau", "Georgetown", 
"Port-au-Prince", "Tegucigalpa", "Budapest", "Reykjavik", "New Delhi", "Jakarta", "Tehran", "Baghdad", "Dublin", 
"Jerusalem", "Rome", "Kingston", "Tokyo", "Amman", "Astana", "Nairobi", "Tarawa Atoll", "Pyongyang", "Seoul", "Pristina", 
"Kuwait City", "Bishkek", "Vientiane", "Riga", "Beirut", "Maseru", "Monrovia", "Tripoli", "Vaduz", "Vilnius", "Luxembourg", 
"Skopje", "Antananarivo", "Lilongwe", "Kuala Lumpur", "Male", "Bamako", "Valletta", "Majuro", "Nouakchott", "Port Louis", 
"Mexico City", "Palikir", "Chisinau", "Monaco", "Ulaanbaatar", "Podgorica", "Rabat", "Maputo", "Windhoek", "Kathmandu", 
"Amsterdam", "Wellington", "Managua", "Niamey", "Abuja", "Oslo", "Muscat", "Islamabad", "Melekeok", "Panama City", "Port Moresby", 
"Asuncion", "Lima", "Manila", "Warsaw", "Lisbon", "Doha", "Bucharest", "Moscow", "Kigali", "Basseterre", "Castries", "Kingstown", "Apia", 
"San Marino", "Sao Tome", "Riyadh", "Dakar", "Belgrade", "Victoria", "Freetown", "Singapore", "Bratislava", "Ljubljana", "Honiara", 
"Mogadishu", "Pretoria", "Juba ", "Madrid", "Colombo", 
"Khartoum", "Paramaribo", "Mbabane", "Stockholm", "Bern", "Damascus", "Taipei", "Dushanbe", "Dar es Salaam", "Bangkok", "Lome", "Nuku'alofa", 
"Port-of-Spain", "Tunis", "Ankara", "Ashgabat", "Vaiaku village", "Funafuti province", "Kampala", "Kyiv", "Abu Dhabi", "London", 
"Washington D.C.", "Montevideo", "Tashkent", "Port-Vila", "Caracas", "Hanoi", "Sanaa", "Lusaka", "Harare"];

const TOOLS = {
    "station": 0,
    "train": 1,
    "track": 2,
};
// USE TO MAKE UNIQUE ID's
const getID = (function() {
    let ID = 0;
    return () => ID++;
})()

const RESOURCES = "./resources/images/"

export default class Game {
    constructor() {
        // THIS WILL HOLD THE CANVAS AND HANDLE RESOLUTION CHANGES
        this.screen;
        this.delta = new Delta;

        this.toolbox;
        this.tileManager;

        this.tiles = new Vector(48, 27);
        // mouse
        this.mouseIsPressed = false;

        this.route = [];
        this.allItems = new Map;
        this.isLayingTracks = false;

        this.player = new Player;
        this.assMan = new AssetsManager;

        this.toolboxWidth = 9;

    }
    buildStation(position, player = this.player) {
        let isValid = true;
        // CHECK IF LOCATION IS VALID
        for(let i = -5; i < 6; i++) {
            let j, k;
            // FANCY LOOP THROUGH WEIRD SHAPE!
            if(i === -5 || i === 5) { j = -2; k = 3 }
            else if(i === -4 || i === 4) { j = -3; k = 4 }
            else if(i === -3 || i === 3) { j = -4; k = 5 }
            else { j = -5; k = 6} 
            for(; j < k; j++) {
                try {
                    if(this.tileManager.tiles[position.x + i][position.y + j].property.type === 1) {
                        isValid = false;
                        console.log("TOO CLOSE TO EXISTING STATION");
                        break;
                    }                        
                } catch {} // only check if valid
            }
        }

        if(isValid) {
            // BUILD STATION
            // ADD STATION TO GAME INVENTORY
            // PUT IN PLAYER'S STATION ARRAY
            // ADD TO MAP
            const name = cities.splice(Math.floor(Math.random() * (cities.length - 1)), 1)[0];
            const id = getID();
            this.allItems.set(id, new Station(position.x, position.y, name, player, id));

                // this.mouseEnd.x, this.mouseEnd.y, name, player, id));
            const obj = this.allItems.get(id);
            
            player.stations.push(this.allItems.get(id))
            this.tileManager.tiles[position.x][position.y].property = obj;
            this.tileManager.tiles[position.x][position.y].owner = player;
            this.screen.context.drawImage(this.stationImage, 
                position.x * this.tileWidth + this.toolboxWidth * this.tileWidth, 
                position.y * this.tileWidth,
                this.tileWidth,
                this.tileWidth,
                )
        }
    }

    buildTracks(start = this.mouseStart, goal = this.mouseEnd, player = this.player ) {
        // LAY TRACKS FIND PATH

        console.log("TRACKING")
        this.route = FIND.path(this.tileManager.tiles, start, goal, player, this);

        this.screen.context.lineWidth = 2;
        this.screen.context.moveTo(
            this.route[0][0]* this.tileWidth + this.tileWidth / 2 + this.toolboxWidth * this.tileWidth, 
            this.route[0][1] * this.tileWidth + this.tileWidth / 2
        );
        this.route.forEach(node => {
            this.screen.context.lineTo(node[0]* this.tileWidth + this.tileWidth / 2 + this.toolboxWidth * this.tileWidth, node[1] * this.tileWidth + this.tileWidth / 2);
        })
        this.screen.context.strokeStyle = "grey"
        this.screen.context.stroke();
    }
    mouseup(e) {
        if(this.mouseIsPressed && !this.toolbox.click(e) && e.x > this.toolboxWidth * this.tileWidth) {
            this.mouseIsPressed = false;
            this.mouseEnd = new Vector(Math.floor(e.x / this.tileWidth - this.toolboxWidth), Math.floor(e.y / this.tileWidth));

            switch(this.toolbox.selected) {
                case TOOLS.station:
                    this.buildStation(this.mouseEnd);
                    break;
                case TOOLS.train:
                    break;
                case TOOLS.track:
                    if(this.isLayingTracks) this.buildTracks();
                    break;
            }
        }
        else if(this.toolbox.selected === 1) {
            this.buyTrain();
        }
        this.mouseIsPressed = false;  
        this.isLayingTracks = false;
    }
    mousedown(e) {if(this.toolbox.click(e)) {  }
        else {
            this.tileManager.getTile(e, this.screen.context);
            this.mouseIsPressed = true;
            this.mouseStart = new Vector(Math.floor(e.x / this.tileWidth - this.toolboxWidth), Math.floor(e.y / this.tileWidth));
            if(this.toolbox.selected === TOOLS.track) {
                try { 
                    if (this.tileManager.tiles[this.mouseStart.x][this.mouseStart.y].property.type === 1 
                        && this.tileManager.tiles[this.mouseStart.x][this.mouseStart.y].owner === this.player
                    ) {
                            this.isLayingTracks = true;
                    }
                }
                catch { }
            }
        }
    }
    mousemove(e) {
        if(this.mouseIsPressed) {
        }
    }

    buyTrain() {
        const station1 = new Vector(4, 10);
        const station2 = new Vector(24, 12);
        const trackStart = new Vector(4,10);
        const trackEnd = new Vector(24, 12);

        this.buildStation(station1, this.player)
        this.buildStation(station2, this.player)
        this.buildTracks(trackStart, trackEnd, this.player)


        this.player.trains.push(new Train);
        console.log(this.player.stations[1].x, this.player.stations[0].x)
        this.player.trains[this.player.trains.length - 1].path = FIND.tracks(this.tileManager.tiles, this.player.stations[1], this.player.stations[0], this.player)

        this.player.trains[this.player.trains.length - 1].x = this.player.stations[1].x;
        this.player.trains[this.player.trains.length - 1].y = this.player.stations[1].y

        // console.log("why", this.player.trains[this.player.trains.length - 1].x)
    }
    async loadResources() {
        this.assMan.addImg(RESOURCES + "buyIcon.png");
        this.assMan.addImg(RESOURCES + "desert.png");
        this.assMan.addImg(RESOURCES + "grass.png");
        this.assMan.addImg(RESOURCES + "ice.png");
        this.assMan.addImg(RESOURCES + "rails-basic.png");
        this.assMan.addImg(RESOURCES + "trackIcon.png");
        this.assMan.addImg(RESOURCES + "buyStation.png");
        this.assMan.addImg(RESOURCES + "title.png");
        this.assMan.addImg(RESOURCES + "redStation.png");
        this.assMan.initialize(() => { console.log("loaded..."); this.setup(); });
    }

    setup() {
        const divider = 3;
        this.tileWidth = this.screen.canvas.width / 16 / divider

        this.stationImage = this.assMan.images[8];
        this.toolbox = new Toolbox(this.tileWidth, this.tiles, this.assMan.images, this.screen.context);
        this.tileManager = new TileManager(this.tileWidth, this.tiles, this.toolboxWidth);

        this.tileManager.render(this.screen.context);
        this.delta.update();

        this.ai1 = new Player;
        this.ai2 = new Player;

        this.currentPlayer;

        const station1 = new Vector(4, 4);
        const station2 = new Vector(24, 4);
        const trackStart = new Vector(4,4);
        const trackEnd = new Vector(24, 4);

        this.buildStation(station1, this.ai1)
        this.buildStation(station2, this.ai1)
        this.buildTracks(trackStart, trackEnd, this.ai1)


        document.addEventListener("mousedown", e => this.mousedown(this.screen.getMouse(e)));
        document.addEventListener("mouseup", e => this.mouseup(this.screen.getMouse(e)));
        document.addEventListener("mousemove", e => this.mousemove(this.screen.getMouse(e)));
        this.screen.context.beginPath();
        this.screen.context.strokeStyle = "black"
        // VERTICAL LINES
        for(let x = this.toolboxWidth; x < 48; x++) {
            this.screen.context.moveTo(Math.floor(x * this.tileWidth), 0)
            this.screen.context.lineTo(Math.floor(x * this.tileWidth), this.tileWidth * 27)
        }
        const offset = this.toolboxWidth * this.tileWidth;
        for(let y = 0; y < 28; y++) {
            this.screen.context.moveTo(offset, Math.floor(y * this.tileWidth))
            this.screen.context.lineTo(offset + this.tileWidth * 39, Math.floor(y * this.tileWidth)) 
        }

        this.screen.context.imageSmoothingEnabled = "false"
        this.screen.context.stroke();


        this.screen.context.beginPath();
        this.buildStation(station1, this.ai1)
        this.buildStation(station2, this.ai1)
        this.buildTracks(trackStart, trackEnd, this.ai1)

        this.run();
    }
    init() {

        this.screen = new Screen;
        this.screen.full();
        this.loadResources();
    }
    run() { 
        this.screen.context.beginPath();
        this.screen.context.fillStyle = "grey";
        this.screen.context.fillRect(0, 0, this.toolboxWidth * this.tileWidth, this.screen.canvas.height)
        this.screen.context.strokeStyle = "darkgrey";
        const lw = 8 / 2
        this.screen.context.lineWidth = lw * 2;
        this.screen.context.strokeRect(0 + lw, 0 + lw, this.toolboxWidth * this.tileWidth -  lw * 2, this.screen.canvas.height-  lw * 2)
        this.screen.context.drawImage(
                        this.assMan.images[7],                        
                        this.tileWidth / 2 - lw/2,
                        this.tileWidth / 2,
                        this.tileWidth * 16.5 / 2,
                        this.tileWidth / 2
                    );

        this.toolbox.render(this.screen.context);

        this.player.update();

        const offset = this.toolboxWidth * this.tileWidth;
        // console.log("hey", this.player.trains[0].x)
        this.player.trains.forEach(train => {
            console.log(train)
                this.screen.context.fillRect(offset + train.x * this.tileWidth, train.y * this.tileWidth, 10, 10)
            // this.screen.context.fillRect(offset + train.x * this.tileWidth, 200, 20, 20);
            // console.log(train)
        });
        
        requestAnimationFrame(() => this.run())
        // this.screen.context.fillStyle = "rgba(0, 0, 0, 0.7)";
        // this.screen.context.rect(0, 0, this.tileWidth * 48, this.tileWidth * 27);
        // this.screen.context.fill();
        // this.screen.context.beginPath();

        // this.screen.context.fillStyle = "white";
        // this.screen.context.rect(this.tileWidth * 2, this.tileWidth * 2, this.tileWidth * 44, this.tileWidth * 23);
        // this.screen.context.fill();
        // this.screen.context.stroke();
        
        // const renderer = this.screen.context;
        // renderer.font = this.tileWidth * 2 + "px Arial"
        // renderer.fillStyle = "black"
        // const name = "Nilkun Station"
        // const width = renderer.measureText(name).width
        // renderer.fillText(name, renderer.canvas.width/2 - width/2, this.tileWidth * 4.5);

        // renderer.font = this.tileWidth + "px Arial"
        // const exit = "EXIT";
        // const route = "ROUTE";
        // const exitWidth = renderer.measureText(exit).width;
        // const routeWidth = renderer.measureText(route).width
        // this.screen.context.beginPath();

        // renderer.fillStyle = "grey"
        // this.screen.context.rect(this.tileWidth * 42.5 - exitWidth - routeWidth, this.tileWidth * 22, this.tileWidth + exitWidth, this.tileWidth * 2);
        // this.screen.context.rect(this.tileWidth * 44.5 - exitWidth +1.5 * this.tileWidth - routeWidth, this.tileWidth * 22, this.tileWidth + routeWidth, this.tileWidth * 2);
        // renderer.fill();

        // renderer.fillStyle = "black"
        // renderer.fillText(exit, this.tileWidth * 43 - exitWidth - routeWidth, this.tileWidth * 23.4);
        // renderer.fillText(route, this.tileWidth * 45 - exitWidth +1.5 * this.tileWidth - routeWidth, this.tileWidth * 23.4);
    }
}