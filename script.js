const canvas = document.getElementById('canvas');
const contex = canvas.getContext('2d'); // changed variable name
const clear = document.getElementById('clear');
let isDrawing = false;
let model;

// Fill background black
contex.fillStyle = 'black';
contex.fillRect(0, 0, canvas.width, canvas.height);

// Drawing settings
contex.strokeStyle = 'white';
contex.lineWidth = 15;
contex.lineCap = 'round';

// Mouse events
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  contex.beginPath();
  contex.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    contex.lineTo(e.offsetX, e.offsetY);
    contex.stroke();
  }
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  contex.closePath();
});

canvas.addEventListener('mouseleave', () => {
  isDrawing = false;
});

// Clear button
clear.addEventListener('click', () => {
  contex.fillStyle = 'black';
  contex.fillRect(0, 0, canvas.width, canvas.height);
});