import Vector from "../engine/Vector.js";
import Tile from "./Tile.js";

export default class TileManager {
    constructor(tileSize = 20) {
        this.map = [];
        this.offset = new Vector;

        this.tiles = new Array(48);
        for(let i = 0; i < this.tiles.length; i++) {
            this.tiles[i] = new Array(27);
            for(let j = 0; j < this.tiles[i].length; j++) {
                this.tiles[i][j] = new Tile(Math.random() > .5 ? "blue" : "pink");
            }
        }

        // This is for creating tiles
        this.canvasTileSize = tileSize;

        this.canvasBuffer1;
        this.canvasBuffer2;
        this.frontBuffer;
    }
    getTile(position, renderer) {
        // const x = Math.floor(position.x / this.canvasTileSize);
        // const y = Math.floor(position.y / this.canvasTileSize);
        // renderer.fillStyle = Math.random() > .5 ? "purple" : "red"
        // renderer.fillRect(x * this.canvasTileSize, y * this.canvasTileSize, this.canvasTileSize, this.canvasTileSize);



        const cosine = Math.sqrt(3) / 2;
        const sine = 1/2;
        const side = 50;
        const half = side / 2;
        const twoHexes = (side * 2) + (half);

        const xVal = Math.floor(position.x / (half + sine * half));
        const yVal = Math.floor(position.y / (side * cosine));
        const x = xVal;
        const y = yVal;
        console.log(yVal)
        const offset = x%2 === 0 ? -half / 2 : -half / 2 + side;

        renderer.beginPath();
        renderer.moveTo(offset + ((x * side + side * sine)), y);
        renderer.lineTo(offset + ((x * side + side * sine)) + half, y);
        renderer.lineTo(offset + ((x * side + side * sine)) + half + half * sine, y + half * cosine);
        renderer.lineTo(offset + ((x * side + side * sine)) + half , y + side * cosine);
        renderer.lineTo(offset + ((x * side + side * sine)), y + side * cosine)
        renderer.lineTo(offset + ((x * side + side * sine)) - half * sine, y + half * cosine);
        renderer.lineTo(offset + ((x * side + side * sine)), y);  
        renderer.fillStyle = "red";

        renderer.imageSmoothingEnabled = "false";
        renderer.fill();


    }
    getSprites() {

    }

    render(renderer) {
        // for(let x = 0; x < this.tiles.length; x++) {
        //     for(let y = 0; y < this.tiles[x].length; y++) {

        //         renderer.fillStyle = this.tiles[x][y].color;
        //         renderer.fillRect(x * this.canvasTileSize, y * this.canvasTileSize, this.canvasTileSize, this.canvasTileSize);
        //     }
        // }
        const cosine = Math.sqrt(3) / 2;
        const sine = 1/2;
        const side = 50;
        const half = side / 2;
        let x = half / 2;
        let y = 0;

        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++) {
                const down = j * side * cosine;
                renderer.moveTo(x + (i * (side + side * sine)), y + down);
                renderer.lineTo(x + (i * (side + side * sine)) + half, y + down);
                renderer.lineTo(x + (i * (side + side * sine)) + half + half * sine, y + down + half * cosine);
                renderer.lineTo(x + (i * (side + side * sine)) + half , y + down + side * cosine);
                renderer.lineTo(x + (i * (side + side * sine)), y + down + side * cosine)
                renderer.lineTo(x + (i * (side + side * sine)) - half * sine, y + down + half * cosine);
                renderer.lineTo(x + (i * (side + side * sine)), y + down);  
                // renderer.fillStyle = "pink";

                // renderer.imageSmoothingEnabled = "false";
                // renderer.fill();
                // renderer.imageSmoothingEnabled = "false";
                // renderer.stroke();
            }
          
        }
        
        y += cosine * half;
        x += half + half * sine;
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++) {
                const down = j * side * cosine; 
                renderer.moveTo(x + (i * (side + side * sine)), y + down);
                renderer.lineTo(x + (i * (side + side * sine)) + half, y + down);
                renderer.lineTo(x + (i * (side + side * sine)) + half + half * sine, y + down + half * cosine);
                renderer.lineTo(x + (i * (side + side * sine)) + half , y + down + side * cosine);
                renderer.lineTo(x + (i * (side + side * sine)), y + down + side * cosine)
                renderer.lineTo(x + (i * (side + side * sine)) - half * sine, y + down + half * cosine);
                renderer.lineTo(x + (i * (side + side * sine)), y + down);  

                // renderer.fillStyle = "pink";
                // renderer.imageSmoothingEnabled = "false";
                // renderer.fill();
                // renderer.imageSmoothingEnabled = "false";
                // renderer.stroke();
            }        
        }



        renderer.imageSmoothingEnabled = "false";
        renderer.stroke();
    }

}