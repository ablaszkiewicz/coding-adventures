import { Interval } from "./interval";
import { Vector3 } from "./vector3";

export function setPixel(
    imageData: ImageData,
    position: {
        x: number;
        y: number;
    },
    color: Vector3
) {
    const { data } = imageData;
    const { x, y } = position;
    const { x: r, y: g, z: b } = color;
    const index = (y * imageData.width + x) * 4;

    const intensity = new Interval(0.0, 0.999);
    const rByte = 256 * intensity.clamp(r);
    const gByte = 256 * intensity.clamp(g);
    const bByte = 256 * intensity.clamp(b);

    data[index] = r * 256;
    data[index + 1] = g * 256;
    data[index + 2] = b * 256;
    data[index + 3] = 255;
}
