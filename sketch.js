/*jshint esversion: 6 */
let c;
let time = 0;
let startOverCount = 0;
let logoPath = [];
let path = [];
let fourierT;
let x = [];
let start = false;
let lineColor;

function setup() {
    c = createCanvas(windowWidth, 325);    
    var elt = document.getElementById('header');
    c.parent(elt);
    centerCanvas();
    c.style('position', 'fixed');
    c.style('top','0');
    const skip = 8;
    for (let i = 0; i < drawing.length; i += skip) {
        const c = new Complex(drawing[i].x, drawing[i].y);
        logoPath.push(c);
    }
    fourierT = dft(logoPath);
    fourierT.sort((a, b) => b.amp - a.amp);
    start = true;
    setNewColor();
}

function windowResized() {
    centerCanvas();
}

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    c.position(x, y);
}

function epicycles(x, y, fourier) {

    for (let i = 0; i < fourier.length; i++) {
        let prex = x;
        let prey = y;
        let freq = fourier[i].freq;
        let radius = fourier[i].amp;
        let phase = fourier[i].phase;
        x += radius * cos(freq * time + phase);
        y += radius * sin(freq * time + phase);

        stroke(0, 50);
        noFill();
        ellipse(prex, prey, radius * 2);
        stroke(0, 100);
        line(prex, prey, x, y);
    }
    return createVector(x, y);

}


function draw() {
    if (!start) {
        return;
    }
    background(255);
    let v = epicycles(width / 2, height / 2, fourierT);
    path.unshift(v);

    beginShape();
    noFill();
    stroke(lineColor);
    for (let i = 0; i < path.length; i++) {
        vertex(path[i].x, path[i].y);
    }
    endShape();

    time += TWO_PI / fourierT.length;
    if (path.length > fourierT.length) {
        path = [];
        setNewColor();
    }
}

function setNewColor() {   
    lineColor = color(0,255,255);
}
