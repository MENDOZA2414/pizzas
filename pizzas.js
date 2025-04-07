let cantidad = 6;
let canvas;

function setup() {
  canvas = createCanvas(900, 500);
  angleMode(DEGREES);
  canvas.parent(document.body.querySelector("main")); // Centrar el canvas
  drawScene();
}

function actualizar() {
  const valor = document.getElementById("entrada").value;
  cantidad = int(valor);
  clear();
  drawScene();
}

function drawScene() {
  background(245);

  // Bandeja
  fill(220);
  noStroke();
  rect(40, 80, width - 80, 350, 20);

  // Dibujar pizzas
  dibujarPizza(150, 250, 100, cantidad, 'pendiente');
  dibujarPizza(450, 250, 100, cantidad, 'dda');
  dibujarPizza(750, 250, 100, cantidad, 'bresenham');

  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  text("Punto-Pendiente", 150, 400);
  text("DDA", 450, 400);
  text("Bresenham", 750, 400);
}

function dibujarPizza(cx, cy, radio, n, tipo) {
  // Base
  fill(230, 180, 120);
  noStroke();
  circle(cx, cy, radio * 2.1);

  // Salsa
  fill(200, 70, 60);
  circle(cx, cy, radio * 1.85);

  // Queso
  fill(255, 240, 160);
  circle(cx, cy, radio * 1.6);

  // Peperonis
  fill(150, 40, 40);
  for (let i = 0; i < 6; i++) {
    let ang = random(0, 360);
    let dist = random(20, radio - 15);
    let x = cx + dist * cos(ang);
    let y = cy + dist * sin(ang);
    circle(x, y, 10);
  }

  // Rebanadas
  stroke(50);
  strokeWeight(1);
  for (let i = 0; i < n; i++) {
    let angulo = 360 * i / n;
    let x = cx + radio * cos(angulo);
    let y = cy + radio * sin(angulo);

    if (tipo === 'pendiente') {
      puntoPendiente(cx, cy, x, y);
    } else if (tipo === 'dda') {
      dda(cx, cy, x, y);
    } else if (tipo === 'bresenham') {
      bresenham(cx, cy, round(x), round(y));
    }
  }
}

// === Punto-Pendiente ===
function puntoPendiente(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  if (abs(dx) > abs(dy)) {
    if (x1 > x2) [x1, y1, x2, y2] = [x2, y2, x1, y1];
    let m = dy / dx;
    let y = y1;
    for (let x = x1; x <= x2; x++) {
      point(x, round(y));
      y += m;
    }
  } else {
    if (y1 > y2) [x1, y1, x2, y2] = [x2, y2, x1, y1];
    let mInv = dx / dy;
    let x = x1;
    for (let y = y1; y <= y2; y++) {
      point(round(x), y);
      x += mInv;
    }
  }
}

// === DDA ===
function dda(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let m = dy / dx;
  let x = x1;
  let y = y1;
  if (abs(m) <= 1) {
    let pasos = abs(dx);
    let incY = dy / pasos;
    let dirX = dx > 0 ? 1 : -1;
    for (let i = 0; i <= pasos; i++) {
      point(round(x), round(y));
      x += dirX;
      y += incY;
    }
  } else {
    let pasos = abs(dy);
    let incX = dx / pasos;
    let dirY = dy > 0 ? 1 : -1;
    for (let i = 0; i <= pasos; i++) {
      point(round(x), round(y));
      y += dirY;
      x += incX;
    }
  }
}

// === Bresenham ===
function bresenham(x1, y1, x2, y2) {
  let dx = abs(x2 - x1);
  let dy = abs(y2 - y1);
  let x = x1;
  let y = y1;
  let pasoX = x2 > x1 ? 1 : -1;
  let pasoY = y2 > y1 ? 1 : -1;

  if (dx > dy) {
    let p = 2 * dy - dx;
    let dobleDy = 2 * dy;
    let dobleDyDx = 2 * (dy - dx);
    for (let i = 0; i <= dx; i++) {
      point(x, y);
      if (p < 0) {
        x += pasoX;
        p += dobleDy;
      } else {
        x += pasoX;
        y += pasoY;
        p += dobleDyDx;
      }
    }
  } else {
    let p = 2 * dx - dy;
    let dobleDx = 2 * dx;
    let dobleDxDy = 2 * (dx - dy);
    for (let i = 0; i <= dy; i++) {
      point(x, y);
      if (p < 0) {
        y += pasoY;
        p += dobleDx;
      } else {
        x += pasoX;
        y += pasoY;
        p += dobleDxDy;
      }
    }
  }
}