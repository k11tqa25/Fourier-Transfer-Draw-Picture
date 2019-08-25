/*jshint esversion: 6 */
let time = 0;
let startOverCount = 0;
let logoPath = [];
let path = [];
let fourierT;
let x = [];
let start = false;
let lineColor;

function setup() {
    createCanvas(800, 600);
    frameRate(120);
    const skip = 8;
    for (let i = 0; i < drawing.length; i += skip) {
        const c = new Complex(drawing[i].x, drawing[i].y);
        logoPath.push(c);
    }
    console.log(logoPath);
    fourierT = dft(logoPath);
    fourierT.sort((a, b) => b.amp - a.amp);
    console.log(fourierT);
    start = true;
    setNewColor();
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
