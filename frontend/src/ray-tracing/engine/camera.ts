import { setPixel } from "./helpers";
import { HitRecord } from "./hittables/hit-record";
import { Hittable } from "./hittables/hittable";
import { Ray } from "./ray";
import { infinity } from "./utils";
import { Vector3 } from "./vector3";

const IMAGE_WIDTH = 800;
const ASPECT_RATIO = 16.0 / 9.0;
const IMAGE_HEIGHT = IMAGE_WIDTH / ASPECT_RATIO;

export interface CameraOptions {
    samples: number;
    bounces: number;
}

export class Camera {
    private center!: Vector3;
    private pixel00Position!: Vector3;
    private pixelDeltaU!: Vector3;
    private pixelDeltaV!: Vector3;
    private pixelSamplesScale!: number;

    public render(
        world: Hittable,
        options: CameraOptions,
        progressCallback?: (progress: number) => void
    ): ImageData {
        this.initialize(options);

        const imageData = new ImageData(IMAGE_WIDTH, IMAGE_HEIGHT);
        let lastReportedPercentage = 0;

        for (let i = 0; i < IMAGE_WIDTH; i++) {
            for (let j = 0; j < IMAGE_HEIGHT; j++) {
                let color = new Vector3(0, 0, 0);

                for (let sample = 0; sample < options.samples; sample++) {
                    const ray = this.getRay(i, j);
                    color = color.add(
                        this.rayColor(ray, world, options.bounces)
                    );
                }

                setPixel(
                    imageData,
                    { x: i, y: j },
                    color.scalarMultiply(this.pixelSamplesScale)
                );

                const percentageDone =
                    ((i * IMAGE_HEIGHT + j) / (IMAGE_WIDTH * IMAGE_HEIGHT)) *
                    100;

                if (
                    progressCallback &&
                    percentageDone - lastReportedPercentage > 1
                ) {
                    progressCallback(percentageDone);
                    lastReportedPercentage = percentageDone;
                }
            }
        }

        return imageData;
    }

    public initialize(options: CameraOptions) {
        this.center = new Vector3(0, 0.5, 0.5);
        this.pixelSamplesScale = 1 / options.samples;

        // viewport
        const focalLength = 1.0;
        const viewportHeight = 2.0;
        const viewportWidth = (viewportHeight * IMAGE_WIDTH) / IMAGE_HEIGHT;

        // viewport vectors
        const viewportU = new Vector3(viewportWidth, 0, 0);
        const viewportV = new Vector3(0, -viewportHeight, 0);

        // pixel vectors
        this.pixelDeltaU = viewportU.scalarMultiply(1 / IMAGE_WIDTH);
        this.pixelDeltaV = viewportV.scalarMultiply(1 / IMAGE_HEIGHT);

        this.pixel00Position = this.center
            .subtract(new Vector3(0, 0, focalLength))
            .subtract(viewportU.scalarMultiply(0.5))
            .subtract(viewportV.scalarMultiply(0.5));
    }

    public rayColor(ray: Ray, world: Hittable, depth: number): Vector3 {
        if (depth <= 0) {
            return new Vector3(0, 0, 0);
        }

        const hitRecord = new HitRecord();

        if (world.hit(ray, 0.001, infinity, hitRecord)) {
            // without materials
            // const direction = hitRecord.normal.add(Vector3.randomUnitVector());
            // return this.rayColor(
            //     new Ray(hitRecord.position, direction),
            //     world,
            //     depth - 1
            // ).scalarMultiply(0.5);

            // with materials

            const scatterResult = hitRecord.material.scatter(ray, hitRecord);

            if (scatterResult.didScatter) {
                return this.rayColor(
                    scatterResult.scattered!,
                    world,
                    depth - 1
                ).multiply(scatterResult.attentuation!);
            }

            return new Vector3(0, 0, 0);
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
