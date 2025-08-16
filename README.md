## MNIST Digit Recognizer (TensorFlow.js)

An interactive **handwritten digit recognizer** built with **TensorFlow.js**.  
You can **draw digits (0–9)** on a canvas in your browser, train a simple CNN model on MNIST, and then predict your drawn digit.

---

## 🚀 Features
- ✏️ Draw digits on an HTML5 canvas
- 🧠 Train a Convolutional Neural Network (CNN) directly in the browser
- 🔮 Predict digits in real time
- ⚡ Powered by TensorFlow.js, runs entirely client-side

---

## 📂 Project Structure
```
├── index.html # UI structure
├── style.css # Styles
├── script.js # Drawing, training & prediction logic
├── data.js # Loads and preprocesses MNIST data
└── README.md
```

---
## ## 🛠️ Installation & Usage

1. Clone this repo:
   ```bash
   git clone https://github.com/your-username/mnist-digit-recognizer.git
   cd mnist-digit-recognizer
2. Open index.html in your browser.
(No backend/server needed, runs fully client-side.)

3. Click Train Model to train on MNIST data.

4. Draw a digit and click Predict Digit.

---

## 📊 Model Architecture

Conv2D (8 filters, 5x5, ReLU)

MaxPooling2D

Conv2D (16 filters, 5x5, ReLU)

MaxPooling2D

Dense (64, ReLU)

Dense (10, Softmax)

---

🔮 Example

Draw digit 5 → model outputs Prediction: 5.