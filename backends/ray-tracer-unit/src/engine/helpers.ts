import { Interval } from './interval';
import { Vector3 } from './vector3';

export function setPixel(imageData: number[], color: Vector3, counter: number) {
  const { x: r, y: g, z: b } = color;
  const index = counter * 4;

  const intensity = new Interval(0.0, 0.999);
  const rByte = 256 * intensity.clamp(r);
  const gByte = 256 * intensity.clamp(g);
  const bByte = 256 * intensity.clamp(b);

  imageData[index] = rByte;
  imageData[index + 1] = gByte;
  imageData[index + 2] = bByte;
  imageData[index + 3] = 255;
}
