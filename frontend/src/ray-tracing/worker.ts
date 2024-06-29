import { Vector3 as ThreeVector3 } from "three";
import { CameraOptions } from "./ray-tracer/camera";
import { RayTracer } from "./ray-tracer/ray-tracer";
import { threeVectorToMyVector3 } from "./ray-tracer/utils";

export interface MessageToWorker {
    objectsPositions: ThreeVector3[];
    options: CameraOptions;
}

onmessage = async (message) => {
    console.log(message);

    const data = message.data as MessageToWorker;

    const positions = data.objectsPositions.map((position) =>
        threeVectorToMyVector3({
            x: position.x,
            y: position.y,
            z: position.z,
        })
    );

    const rayTracer = new RayTracer();
    const result = await rayTracer.render(positions, data.options, (progress) =>
        postMessage({ status: "progress", data: progress })
    );

    postMessage({
        status: "done",
        data: result,
    });
};
