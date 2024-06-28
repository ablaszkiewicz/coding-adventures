import { Color } from "./color";

export function setPixel(
    imageData: ImageData,
    position: {
        x: number;
        y: number;
    },
    color: Color
) {
    const { data } = imageData;
    const { x, y } = position;
    const { r, g, b } = color;
    const index = (y * imageData.width + x) * 4;

    data[index] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = 255;
}
