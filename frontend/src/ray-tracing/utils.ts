export const pi = 3.1415926535897932385;
export const infinity = Number.POSITIVE_INFINITY;

export function degreesToRadians(degrees: number) {
    return degrees * (pi / 180);
}

export function randomBetweem(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
