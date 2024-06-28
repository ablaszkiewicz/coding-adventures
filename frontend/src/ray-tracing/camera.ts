import { setPixel } from "./helpers";
import { HitRecord } from "./hit-record";
import { Hittable } from "./hittable";
import { Ray } from "./ray";
import { infinity } from "./utils";
import { Vector3 } from "./vector3";

const IMAGE_WIDTH = 800;
const ASPECT_RATIO = 16.0 / 9.0;

export class Camera {
    private imageHeight!: number;
    private center!: Vector3;
    private pixel00Position!: Vector3;
    private pixelDeltaU!: Vector3;
    private pixelDeltaV!: Vector3;

    public render(context: CanvasRenderingContext2D, world: Hittable) {
        this.initialize();

        const imageData = new ImageData(IMAGE_WIDTH, this.imageHeight);

        for (let i = 0; i < IMAGE_WIDTH; i++) {
            for (let j = 0; j < this.imageHeight; j++) {
                const pixelPosition = this.pixel00Position
                    .add(this.pixelDeltaU.scalarMultiply(i))
                    .add(this.pixelDeltaV.scalarMultiply(j));

                const rayDirection = pixelPosition.subtract(this.center);
                const ray = new Ray(this.center, rayDirection);

                const color = this.rayColor(ray, world);

                setPixel(imageData, { x: i, y: j }, color);
            }
        }

        context.putImageData(imageData, 0, 0);
    }

    public initialize() {
        this.imageHeight = IMAGE_WIDTH / ASPECT_RATIO;

        this.center = new Vector3(0, 0, 0);

        // viewport
        const focalLength = 1.0;
        const viewportHeight = 2.0;
        const viewportWidth = (viewportHeight * IMAGE_WIDTH) / this.imageHeight;

        // viewport vectors
        const viewportU = new Vector3(viewportWidth, 0, 0);
        const viewportV = new Vector3(0, -viewportHeight, 0);

        // pixel vectors
        this.pixelDeltaU = viewportU.scalarMultiply(1 / IMAGE_WIDTH);
        this.pixelDeltaV = viewportV.scalarMultiply(1 / this.imageHeight);

        this.pixel00Position = this.center
            .subtract(new Vector3(0, 0, focalLength))
            .subtract(viewportU.scalarMultiply(0.5))
            .subtract(viewportV.scalarMultiply(0.5));
    }

    public rayColor(ray: Ray, world: Hittable) {
        const hitRecord = new HitRecord();

        if (world.hit(ray, 0, infinity, hitRecord)) {
            return {
                r: 0.5 * (hitRecord.normal.x + 1) * 255,
                g: 0.5 * (hitRecord.normal.y + 1) * 255,
                b: 0.5 * (hitRecord.normal.z + 1) * 255,
            };
        }

        const unitDirection = ray.direction.unit();
        const a = 0.5 * (unitDirection.y + 1.0);
        return {
            r: (1.0 - a) * 255 + 0.5 * a * 255,
            g: (1.0 - a) * 255 + 0.7 * a * 255,
            b: (1.0 - a) * 255 + 1.0 * a * 255,
        };
    }
}
