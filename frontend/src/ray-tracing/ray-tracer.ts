import { Color } from "./color";
import { setPixel } from "./helpers";
import { HitRecord } from "./hit-record";
import { Hittable } from "./hittable";
import { HittableList } from "./hittable-list";
import { Ray } from "./ray";
import { Sphere } from "./sphere";
import { infinity } from "./utils";
import { Vector3 } from "./vector3";

const ASPECT_RATIO = 16.0 / 9.0;

const WIDTH = 800;
const HEIGHT = WIDTH / ASPECT_RATIO;

const VIEWPORT_HEIGHT = 2.0;
const VIEWPORT_WIDTH = VIEWPORT_HEIGHT * (WIDTH / HEIGHT);

const rayColor = (ray: Ray, world: Hittable): Color => {
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
};

export class RayTracer {
    constructor(private readonly context: CanvasRenderingContext2D) {}

    public render() {
        const focalLength = 1.0;
        const cameraCenter = new Vector3(0, 0, 0);

        const viewportU = new Vector3(VIEWPORT_WIDTH, 0, 0);
        const viewportV = new Vector3(0, -VIEWPORT_HEIGHT, 0);

        const pixelDeltaU = viewportU.scalarMultiply(1 / WIDTH);
        const pixelDeltaV = viewportV.scalarMultiply(1 / HEIGHT);

        const viewportTopLeft = cameraCenter
            .subtract(new Vector3(0, 0, focalLength))
            .subtract(viewportU.scalarMultiply(0.5))
            .subtract(viewportV.scalarMultiply(0.5));

        const pixel00Position = viewportTopLeft.add(
            pixelDeltaU.scalarMultiply(0.5).add(pixelDeltaV.scalarMultiply(0.5))
        );

        const imageData = new ImageData(WIDTH, WIDTH);

        const world = new HittableList([
            new Sphere(new Vector3(0, 0, -1), 0.5),
            new Sphere(new Vector3(0, -100.5, -1), 100),
        ]);

        for (let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < HEIGHT; j++) {
                const pixelPosition = pixel00Position
                    .add(pixelDeltaU.scalarMultiply(i))
                    .add(pixelDeltaV.scalarMultiply(j));

                const rayDirection = pixelPosition.subtract(cameraCenter);
                const ray = new Ray(cameraCenter, rayDirection);

                const color = rayColor(ray, world);

                setPixel(imageData, { x: i, y: j }, color);
            }
        }

        this.context.putImageData(imageData, 0, 0);
    }

    public clear() {
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, WIDTH, HEIGHT);
    }
}
