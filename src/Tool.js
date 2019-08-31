export default class Tool {
    constructor(x, y, w, h, name, click, icon) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.name = name;
        this.icon = icon;

        // CLICK FUNCTION
        this.click = click;
    }
}