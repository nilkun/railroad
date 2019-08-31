export default class Screen {
    constructor(
        width = 800,
        height = 600, 
        aspectRatio = 16 / 9,
        canvas = "canvas", 
        preventInit = false
    ) {

        this.aspectRatio = aspectRatio;

        this.canvas = document.getElementById(canvas);
        this.context = this.canvas.getContext("2d");
        this.canvasName = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        if(!preventInit) this.init();
    }    
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
    setBackground(color) {
        this.canvas.style.background = color;
    }
    init() {
        this.canvas.style.background = "#FFAA00";
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    getMouse(event) {
        const rect = this.canvas.getBoundingClientRect();
        return { 
            x: event.clientX - rect.left, 
            y: event.clientY - rect.top 
        };
    }
    getTouch(event) {
        // NB! If you have a border, it is added to the position;
        event.preventDefault();
        return { x: event.changedTouches[0].pageX  , y: event.changedTouches[0].pageY };
    }
    
    full() {
        // get viewport size;
        let e = window;
        let a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
    
        const screenWidth = e[a + 'Width'];
        const screenHeight = e[a + 'Height']
    
        // Keeping the aspect ratio    
        const resolutionX = screenWidth > screenHeight * this.aspectRatio ? Math.floor(screenHeight * this.aspectRatio) : screenWidth;
        const resolutionY = screenWidth > screenHeight * this.aspectRatio ? screenHeight : Math.floor(screenWidth / this.aspectRatio);
    
        // RESIZE DIV TO AVOID STRETCHING
        const div = document.getElementById("viewport");
        div.style.width = resolutionX;
        div.style.height = resolutionY; 
        
        // RESIZE CANVAS    
        this.resize(resolutionX, resolutionY)
    }
}