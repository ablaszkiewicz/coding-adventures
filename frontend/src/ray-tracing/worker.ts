import { CameraOptions } from "./engine/camera";
import { EngineObject, RayTracer } from "./engine/ray-tracer";
import { threeVectorToMyVector3 } from "./engine/utils";
import { ObjectOnScene } from "./store";

export interface MessageToWorker {
    objects: ObjectOnScene[];
    options: CameraOptions;
}

onmessage = async (message) => {
    const data = message.data as MessageToWorker;

    const objects: EngineObject[] = data.objects.map((object) => ({
        position: threeVectorToMyVector3({
            x: object.position.x,
            y: object.position.y,
            z: object.position.z,
        }),
        color: object.color,
        material: object.material,
        scale: object.scale,
    }));

    const rayTracer = new RayTracer();
    const result = await rayTracer.render(objects, data.options, (progress) =>
        postMessage({ status: "progress", data: progress })
    );

    postMessage({
        status: "done",
        data: result,
    });
};
