import { Camera, CameraOptions } from "./camera";
import { HittableList } from "./hittables/hittable-list";
import { MaterialType } from "./materials/material";
import { Sphere } from "./sphere";
import { Vector3 } from "./vector3";

export interface EngineObject {
    position: Vector3;
    color: Vector3;
    material: MaterialType;
    scale: number;
}

export class RayTracer {
    constructor() {}

    public render(
        objects: EngineObject[],
        options: CameraOptions,
        progressCallback?: (progress: number) => void
    ): ImageData {
        const world = new HittableList([
            ...objects.map(
                (object) =>
                    new Sphere(
                        object.position,
                        object.scale,
                        object.material,
                        object.color
                    )
            ),
            new Sphere(
                new Vector3(0, -100.5, -1),
                100,
                MaterialType.Lambertian,
                new Vector3(0.7, 0.7, 0.7)
            ),
        ]);

        const camera = new Camera();

        const imageData = camera.render(world, options, progressCallback);

        return imageData;
    }
}
