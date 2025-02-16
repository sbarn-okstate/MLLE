import { useState } from 'react';
import useIncrementWasm from './wasm-loader';

function App() {
  const [count, setCount] = useState(0);
  const increment = useIncrementWasm(); // This is either a function or null
  const isLoading = increment === null; // Check if increment is still loading

  const handleIncrement = () => {
    console.log('Button clicked');
    if (increment) {
      console.log('Increment function available');
      setCount((prevCount) => increment(prevCount)); // Call increment if it's loaded
    } else {
      console.log('Increment function not available');
    }
  };

  console.log('App render, increment:', increment);

  return (
    <>
      <div>
        <h1>React + WebAssembly</h1>
        <div className="card">
          <button onClick={handleIncrement}>
            {isLoading ? "Loading..." : `Count is ${count}`}
          </button>
        </div>
      </div>
    </>
  );
}

export default App;

