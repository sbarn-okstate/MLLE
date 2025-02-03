import { useEffect, useState } from "react";

export default function useIncrementWasm() {
    const [increment, setIncrement] = useState<(count: number) => number | null>(null);

    useEffect(() => {
        (async () => {
            const Module = (await import("./increment.js")).default;
            Module().then((instance: any) => {
                const incFunc = instance.cwrap("increment", "number", ["number"]);
                setIncrement(() => incFunc);
            });
        })();
    }, []);

    return increment;
}