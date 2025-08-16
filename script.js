import { MnistData } from "./data.js";

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const clearBtn = document.getElementById('clear');
  const trainBtn = document.getElementById('trainModel');
  const predictBtn = document.getElementById('predictDigit');
  const status = document.getElementById('status');
  const progress = document.getElementById('progress');
  const result = document.getElementById('result');

  let isDrawing = false;
  let model;
  let data;

  // Initialize canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 15;
  ctx.lineCap = 'round';

  function getPosition(e) {
    if (e.touches && e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.offsetX, y: e.offsetY };
  }

  function startDrawing(e) {
    isDrawing = true;
    const pos = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (isDrawing) {
      const pos = getPosition(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  }

  function stopDrawing() {
    isDrawing = false;
    ctx.closePath();
  }

  // Mouse and Touch events
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);
  
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });
  canvas.addEventListener('touchend', stopDrawing);


  // Clear button
  clearBtn.addEventListener('click', () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    result.innerText = 'Prediction: -';
  });

  // Define the model
  function createModel() {
    model = tf.sequential();
    model.add(tf.layers.conv2d({inputShape: [28, 28, 1], kernelSize: 3, filters: 8, activation: 'relu'}));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
    model.add(tf.layers.conv2d({filters: 16, kernelSize: 3, activation: 'relu'}));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 128, activation: 'relu'}));
    model.add(tf.layers.dense({units: 10, activation: 'softmax'}));

    model.compile({
      optimizer: tf.train.adam(),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  // Train the model
  async function trainModel() {
    trainBtn.disabled = true;
    status.innerText = 'Loading data...';
    if (!data) {
      data = new MnistData();
      await data.load();
    }
    status.innerText = 'Data loaded. Creating model...';

    createModel();
    status.innerText = 'Model created. Starting training...';

    const trainData = data.getTrainData();

    await model.fit(trainData.xs, trainData.labels, {
      epochs: 1500,
      batchSize: 32,
      validationSplit: 0.1,
      callbacks:{
        onEpochEnd: async(epoch, logs) =>{
        console.log("Epoch: " + epoch +
        " Loss: " + logs.loss);
        }
      }
    });

    predictBtn.disabled = false;
    status.innerText = 'Training complete!';
    trainBtn.disabled = false;
  }

  // Prediction
  async function predictDigit() {
    if (!model) {
      alert('Model not trained yet!');
      return;
    }

    const tensor = tf.tidy(() => {
      const img = tf.browser.fromPixels(canvas, 1);
      const resized = tf.image.resizeNearestNeighbor(img, [28, 28]);
      const batched = resized.expandDims(0);
      return batched.toFloat().div(255.0);
    });
    
    const prediction = model.predict(tensor);
    const predValue = prediction.argMax(1).dataSync()[0];
    result.innerText = `Prediction: ${predValue}`;
    tensor.dispose();
  }

  // Attach to buttons
  trainBtn.addEventListener('click', trainModel);
  predictBtn.addEventListener('click', predictDigit);
});