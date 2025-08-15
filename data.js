import * as tf from '@tensorflow/tfjs';

export class MnistData {
  constructor() {
    this.IMAGE_SIZE = 28 * 28;
    this.NUM_CLASSES = 10;
    this.trainImages = null;
    this.trainLabels = null;
    this.testImages = null;
    this.testLabels = null;
  }

  async load() {
    // Load CSV from hosted URL
    const response = await fetch(
      'https://storage.googleapis.com/learnjs-data/model-builder/mnist_train.csv'
    );
    const csvData = await response.text();

    const lines = csvData.split('\n').filter(line => line.length > 0);

    const images = [];
    const labels = [];

    lines.forEach(line => {
      const parts = line.split(',');
      labels.push(parseInt(parts[0]));
      const pixels = parts.slice(1).map(x => parseFloat(x) / 255.0);
      images.push(pixels);
    });

    // Convert to tensors
    const imageTensor = tf.tensor2d(images, [images.length, 28 * 28]).reshape([-1, 28, 28, 1]);
    const labelTensor = tf.oneHot(tf.tensor1d(labels, 'int32'), this.NUM_CLASSES);

    // Split into train/test (simple split: 80% train, 20% test)
    const trainSize = Math.floor(images.length * 0.8);

    this.trainImages = imageTensor.slice([0, 0, 0, 0], [trainSize, 28, 28, 1]);
    this.trainLabels = labelTensor.slice([0, 0], [trainSize, this.NUM_CLASSES]);

    this.testImages = imageTensor.slice([trainSize, 0, 0, 0], [images.length - trainSize, 28, 28, 1]);
    this.testLabels = labelTensor.slice([trainSize, 0], [images.length - trainSize, this.NUM_CLASSES]);
  }

  getTrainData() {
    return { xs: this.trainImages, labels: this.trainLabels };
  }

  getTestData() {
    return { xs: this.testImages, labels: this.testLabels };
  }
}
