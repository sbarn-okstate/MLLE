import { useEffect, useState } from "react";

export default function useIncrementWasm() {
  const [increment, setIncrement] = useState<((count: number) => number) | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Dynamically import the WebAssembly module
        const Module = (await import("./cpp/increment.js")).default; // Access the default export

        // Module is now a function that returns a promise
        const instance = await Module(); // Wait for the module to be ready

        // Access the increment function from the module
        const incFunc = instance['_test']; // Access the function exported by Emscripten

        if (incFunc) {
          // Set the increment function in state
          setIncrement(() => (count: number) => incFunc(count));
        } else {
          console.error("Increment function not found in WASM module");
        }
      } catch (error) {
        console.error("Error loading WASM module:", error);
      }
    })();
  }, []);

  return increment;
}
