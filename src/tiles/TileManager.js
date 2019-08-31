import Vector from "../engine/Vector.js";
import Tile from "./Tile.js";

export default class TileManager {
    constructor(tileSize = 20, size, toolboxWidth) {
        this.map = [];
        this.offset = new Vector;
        this.toolboxWidth = toolboxWidth;

        this.tiles = new Array(size.x);
        for(let i = 0; i < this.tiles.length; i++) {
            this.tiles[i] = new Array(size.y);
            for(let j = 0; j < this.tiles[i].length; j++) {
                this.tiles[i][j] = new Tile("green");
            }
        }

        // This is for creating tiles
        this.canvasTileSize = tileSize;

        this.canvasBuffer1;
        this.canvasBuffer2;
        this.frontBuffer;
    }
    getTile(position, renderer) {
        const x = this.toolboxWidth * this.canvasTileSize + Math.floor(position.x / this.canvasTileSize);
        const y = Math.floor(position.y / this.canvasTileSize);
        renderer.fillStyle = "brown"
        renderer.imageSmoothingEnabled = "false";
        renderer.fillRect(
            Math.floor(x * this.canvasTileSize),
            Math.floor(y * this.canvasTileSize), 
            Math.floor(this.canvasTileSize), 
            Math.floor(this.canvasTileSize)
        );
    }
    getSprites() {

    }

    render(renderer) {
        for(let x = 0; x < this.tiles.length; x++) {
            for(let y = 0; y < this.tiles[x].length; y++) {
                renderer.fillStyle = this.tiles[x][y].color;
                
                renderer.imageSmoothingEnabled = "false";
                renderer.fillRect(
                    this.toolboxWidth * this.canvasTileSize + Math.floor(x * this.canvasTileSize),
                    Math.floor(y * this.canvasTileSize), 
                    Math.ceil(this.canvasTileSize), 
                    Math.ceil(this.canvasTileSize)
                );
            }
        }
    }
}