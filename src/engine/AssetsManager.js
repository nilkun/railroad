class AssetsManager {
    constructor() {
        this.images = [];
        this.paths = []
    }
    addImg(path) {
        this.paths.push(path);
    }

    async initialize(init) {
        // init is the function to run after all assets are loaded
        this.images = [];
        let counter = 0;

        this.paths.forEach(path => {
            const image = new Image();
            this.images.push(image); 
            image.src = path;
            image.onload = () => { 
                // Create a progress bar if you want
                counter++;
                if(counter >= this.paths.length) { 
                    this.paths = [];
                    init();
                    // window.requestAnimationFrame(() => init()); 
                };
            }
        });
    }
    
    loadImg(path) {
        const image = new Image();
        image.src = path;
        image.onload = () => { 
            this.loaded++;
            start(); 
        }
        this.images.push(image);
        return image;
    }   
}

export default AssetsManager;