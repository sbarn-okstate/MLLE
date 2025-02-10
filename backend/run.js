const Module = require('./backend.js');

Module.onRuntimeInitialized = () => {
    if (typeof Module._my_function === "function") {
        Module._my_function_again(); // Call the function
    } else {
        console.error("my_function is not found in the module.");
    }
};
