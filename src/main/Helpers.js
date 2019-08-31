const fullScreen = (aspectRatio = 16/9) => {

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
    const resolution = new Vector(
        screenWidth > screenHeight * aspectRatio ? Math.floor(screenHeight * aspectRatio) : screenWidth,
        screenWidth > screenHeight * aspectRatio ? screenHeight : Math.floor(screenWidth / aspectRatio),
    );

    // RESIZE DIV TO AVOID STRETCHING
    const div = document.getElementById("viewport");
    div.style.width = resolution.x;
    div.style.height = resolution.y; 
    
    // RESIZE CANVAS    
    screen.resize(resolution.x, resolution.y)
}