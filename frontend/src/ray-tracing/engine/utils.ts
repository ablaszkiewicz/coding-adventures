import { Vector3 as MyVector3 } from "./vector3";

export const pi = 3.1415926535897932385;
export const infinity = Number.POSITIVE_INFINITY;

export function degreesToRadians(degrees: number) {
    return degrees * (pi / 180);
}

export function randomNumberBetweem(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export const threeVectorToMyVector3 = (threePosition: {
    x: number;
    y: number;
    z: number;
}): MyVector3 => {
    const myPosition = new MyVector3(
        threePosition.z,
        threePosition.y,
        -threePosition.x
    );

    return myPosition;
};
