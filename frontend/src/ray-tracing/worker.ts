import { RayTracer } from "./ray-tracer";
import { Vector3 } from "./vector3";

export interface MessageToWorker {
    objectsPositions: Vector3[];
}

onmessage = async (message) => {
    const data = message.data as MessageToWorker;

    const positions = data.objectsPositions.map(
        (position) => new Vector3(position.x, position.y, position.z)
    );

    const rayTracer = new RayTracer();
    const result = await rayTracer.render(positions, (progress) =>
        postMessage({ status: "progress", data: progress })
    );

    postMessage({
        status: "done",
        data: result,
    });
};
