import { RayTracer } from "./ray-tracer";

export interface Message {
    status: "progress" | "done";
    data: any;
}

onmessage = async () => {
    const rayTracer = new RayTracer();
    const result = await rayTracer.render((progress) =>
        postMessage({ status: "progress", data: progress })
    );

    postMessage({
        status: "done",
        data: result,
    });
};
