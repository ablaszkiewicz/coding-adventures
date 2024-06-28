import { setPixel } from "./helpers";
import { HitRecord } from "./hit-record";
import { Hittable } from "./hittable";
import { Ray } from "./ray";
import { infinity } from "./utils";
import { Vector3 } from "./vector3";

const IMAGE_WIDTH = 800;
const ASPECT_RATIO = 16.0 / 9.0;
const SAMPLES_PER_PIXEL = 100;

export class Camera {
    private imageHeight!: number;
    private center!: Vector3;
    private pixel00Position!: Vector3;
    private pixelDeltaU!: Vector3;
    private pixelDeltaV!: Vector3;
    private pixelSamplesScale!: number;

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
        this.pixelSamplesScale = 1 / SAMPLES_PER_PIXEL;

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

    public rayColor(ray: Ray, world: Hittable): Vector3 {
        const hitRecord = new HitRecord();

        if (world.hit(ray, 0, infinity, hitRecord)) {
            return hitRecord.normal
                .add(new Vector3(1, 1, 1))
                .scalarMultiply(0.5);
        }

        const unitDirection = ray.direction.unit();
        const a = 0.5 * (unitDirection.y + 1.0);
        return new Vector3(0.5, 0.7, 1.0)
            .scalarMultiply(a)
            .add(new Vector3(1, 1, 1).scalarMultiply(1 - a));
    }

    private getRay(i: number, j: number): Ray {
        const offset = this.sampleSquare();
        const pixelSample = this.pixel00Position
            .add(this.pixelDeltaU.scalarMultiply(i + offset.x))
            .add(this.pixelDeltaV.scalarMultiply(j + offset.y));

        const rayOrigin = this.center;
        const rayDirection = pixelSample.subtract(this.center);

        return new Ray(rayOrigin, rayDirection);
    }

    private sampleSquare(): Vector3 {
        return new Vector3(Math.random() - 0.5, Math.random() - 0.5, 0);
    }
}
