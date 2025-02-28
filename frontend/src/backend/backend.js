// backend.js

let backend_worker = null;

export function createBackendWorker() {
    if (!backend_worker) {
        backend_worker = new Worker(new URL("./worker.js", import.meta.url), {type: 'module'});
        console.log("Backend worker created.");
    
        backend_worker.onmessage = (event) => {
            const message = event.data;

            if (typeof message === "string") {
                console.log("[Backend]", message);
                return;
            }

            if (typeof message === "object" && message !== null) {
                const {func, args} = message;

                switch (func){
                    default:
                        console.log('Unknown function call from backend worker:', func);
                }

                return;
            }

            console.warn("Received unknown message format from backend worker:", message);
        }
        return;
    }
    console.log('Backend worker already created.');
}

export function getBackendWorker(){
    if (!backend_worker) createBackendWorker();
    return backend_worker;
}

