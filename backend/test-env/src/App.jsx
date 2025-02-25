import { useEffect, useState } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    // Load TensorFlow.js in the main thread
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs";
    script.onload = () => console.log("TensorFlow.js loaded in main thread");
    document.body.appendChild(script);

    // Create a Web Worker
    const worker = new Worker(new URL("./worker.js", import.meta.url), {type: 'module'});

    worker.onmessage = (event) => console.log('Worker log: ' + event.data);

    const test_model = [
      {
          type: "dense",
          inputShape: [5],
          units: 128,
          activation: "relu"
      },
      {
          type: "dropout",
          rate: 0.2
      },
      {
          type: "dense",
          units: 64,
          activation: "relu"
      },
      {
          type: "dense",
          units: 32,
          activation: "relu"
      },
      {
          type: "dense",
          units: 1,
      }
    ];
  //  const xs = tf.tensor2d([[1], [2], [3], [4], [5]], [5, 1]);  // Input data
  //  const ys = tf.tensor2d([[1], [3], [5], [7], [9]], [5, 1]);  // Expected output (linear pattern)
    // Ask the worker to load TensorFlow.js
    worker.postMessage({type: "prepareModel", data: test_model});
   // worker.postMessage({type: "trainModel"});
    return () => worker.terminate();
  }, []);

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Worker Message: {message}
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
