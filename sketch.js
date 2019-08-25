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

function loadFile(file) {
    createP("using file: " + file.name);
    let lines = split(file.data, ',');
    logoPath = [];
    start = false;
    let skip = 0;
    if (lines.length >= 5000) skip = 16;
    else if (lines.length >= 3000) skip = 10;
    else if (lines.length >= 1000) skip = 6;
    for (let i = 0; i < lines.length; i += skip) {
        if (lines[i].indexOf(":") == -1) continue;
        logoPath.push(new Complex(
            parseFloat(lines[i].replace("{", "").replace("}", "").split(":")[1].trim()),
            parseFloat(lines[i + 1].replace("{", "").replace("}", "").split(":")[1].trim())));
    }

    if (logoPath.length > 0) {
        var dropZone = select('#dropzone');
        dropZone.remove();
        fourierT = dft(logoPath);
        start = true;
    }
}


function highlight() {
    background(150);
}

function unhighlight() {
    background(100);
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
    //lineColor = color(random(0, 255), random(0, 255), random(0, 255));
}
