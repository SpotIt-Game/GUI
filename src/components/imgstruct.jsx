class imgStruct {
    constructor(url, rotation, scale, x, y, width, height) {
        this.url = url;
        this.rotation = parseFloat(rotation);
        this.scale = parseFloat(scale);
        this.x = parseFloat(x); //position relative to x axis
        this.y = parseFloat(y); //position relative to y axis
        this.width = parseInt(width)
        this.height = parseInt(height)
        this.styler = {
            backgroundColor: `transparent`,
            border: `0px solid #000`,
            position: 'absolute',
            width: `${this.width * Math.sqrt(this.scale)}px`,
            // height: `${this.height * Math.sqrt(this.scale)}px`, // Adjusted to include height
            top: `${this.y + 240 - (this.height * Math.sqrt(this.scale)) / 2}px`, // Adjusted to center vertically
            left: `${this.x + 240 - (this.width * Math.sqrt(this.scale)) / 2}px`, // Adjusted to center horizontally
            transformOrigin: `top left`,
            transform: `rotate(${this.rotation}rad)`,
        };
    }
}

export default imgStruct