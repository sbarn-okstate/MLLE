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

    worker.onmessage = (event) => setMessage(event.data);

    // Ask the worker to load TensorFlow.js
    worker.postMessage("prepareModel");

    return () => worker.terminate();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
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
