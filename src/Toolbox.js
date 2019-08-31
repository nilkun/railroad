import Tool from "./Tool.js";

const TOOLS = {
    "station": 0,
    "train": 1,
    "track": 2,
}

export default class Toolbox {
    constructor(tileSize, aspectRatio, icons, renderer) {

        const buyTrain = () => console.log("You bought a train!")

        const buyStation = () => console.log("You bought a station!")
        const layTracks = () => console.log("Laying tracks.")
        this.tools = [];
        this.tools.push(new Tool( 1.5, 3, 2, 1, "station", buyStation, icons[6]));
        this.tools.push(new Tool( 1.5, 4.5, 2, 1, "train", buyTrain, icons[0]));
        this.tools.push(new Tool( 1.5, 6, 1, 1, "track", layTracks, icons[5]));
        this.tileSize = tileSize;
        this.selected = 0;
        this.renderer = renderer;

        this.state;
    }

    click(position) {
        for(let i = 0; i < this.tools.length; i++) {
            const tool = this.tools[i];
            if(position.x >= tool.x  * this.tileSize 
                && position.x <= tool.x * this.tileSize + tool.width * this.tileSize 
                && position.y >= tool.y * this.tileSize 
                && position.y <= tool.y * this.tileSize+ tool.height * this.tileSize
            ) {
                tool.click();
                this.renderOne(this.selected);
                this.selected = i;
                this.renderBox(this.selected);
                return true;
            }            
        }
        return false;
    }
    renderOne(idx) {
        const tool = this.tools[idx];
        this.renderer.fillStyle = "grey";
        this.renderer.fillRect(tool.x * this.tileSize - 2, tool.y * this.tileSize - 2, tool.width * this.tileSize + 4, tool.height * this.tileSize + 4)
        this.renderer.drawImage(tool.icon, tool.x * this.tileSize, tool.y * this.tileSize, tool.width * this.tileSize, tool.height * this.tileSize );
    }
    renderBox(idx) {
        const tool = this.tools[idx];
        this.renderer.strokeStyle = "lightgrey";
        this.renderer.lineWidth = 2;
        this.renderer.strokeRect(tool.x * this.tileSize + 1, tool.y * this.tileSize + 1, tool.width * this.tileSize - 2, tool.height * this.tileSize - 2);
    }

    render() {
        for(let i = 0; i < this.tools.length; i++) this.renderOne(i);
    }
}
