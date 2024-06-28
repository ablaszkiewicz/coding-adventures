import { Color } from "./color";
import { setPixel } from "./helpers";
import { Ray } from "./ray";
import { Vector3 } from "./vector3";

const ASPECT_RATIO = 16.0 / 9.0;

const WIDTH = 800;
const HEIGHT = WIDTH / ASPECT_RATIO;

const VIEWPORT_HEIGHT = 2.0;
const VIEWPORT_WIDTH = VIEWPORT_HEIGHT * (WIDTH / HEIGHT);

const rayColor = (ray: Ray): Color => {
    const unitDirection = ray.direction.unit();
    const t = 0.5 * (unitDirection.y + 1.0);
    return {
        r: (1.0 - t) * 255 + 0.5 * t * 255,
        g: (1.0 - t) * 255 + 0.7 * t * 255,
        b: (1.0 - t) * 255 + 1.0 * t * 255,
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

        for (let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < HEIGHT; j++) {
                const pixelPosition = pixel00Position
                    .add(pixelDeltaU.scalarMultiply(i))
                    .add(pixelDeltaV.scalarMultiply(j));

                const rayDirection = pixelPosition.subtract(cameraCenter);
                const ray = new Ray(cameraCenter, rayDirection);

                const color = rayColor(ray);

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
