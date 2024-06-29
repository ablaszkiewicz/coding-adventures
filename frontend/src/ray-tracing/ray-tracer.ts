import { Camera, CameraOptions } from "./camera";
import { HittableList } from "./hittable-list";
import { Sphere } from "./sphere";
import { Vector3 } from "./vector3";

export class RayTracer {
    constructor() {}

    public render(
        positions: Vector3[],
        options: CameraOptions,
        progressCallback?: (progress: number) => void
    ): ImageData {
        const world = new HittableList([
            ...positions.map((position) => new Sphere(position, 0.5)),
            new Sphere(new Vector3(0, -100.5, -1), 100),
        ]);

        const camera = new Camera();

        const imageData = camera.render(world, options, progressCallback);

        return imageData;
    }
}
