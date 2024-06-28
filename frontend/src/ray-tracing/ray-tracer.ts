import { Camera } from "./camera";
import { HittableList } from "./hittable-list";
import { Sphere } from "./sphere";
import { Vector3 } from "./vector3";

const ASPECT_RATIO = 16.0 / 9.0;

const WIDTH = 800;
const HEIGHT = WIDTH / ASPECT_RATIO;

const VIEWPORT_HEIGHT = 2.0;
const VIEWPORT_WIDTH = VIEWPORT_HEIGHT * (WIDTH / HEIGHT);

export class RayTracer {
    constructor(private readonly context: CanvasRenderingContext2D) {}

    public render() {
        const world = new HittableList([
            new Sphere(new Vector3(0, 0, -1), 0.5),
            new Sphere(new Vector3(0, -100.5, -1), 100),
        ]);

        const camera = new Camera();

        camera.render(this.context, world);
    }

    public clear() {
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, WIDTH, HEIGHT);
    }
}
