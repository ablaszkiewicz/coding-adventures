import { infinity, randomNumberBetweem } from "./utils";

export class Vector3 {
    constructor(public x: number, public y: number, public z: number) {}

    public add(other: Vector3): Vector3 {
        return new Vector3(
            this.x + other.x,
            this.y + other.y,
            this.z + other.z
        );
    }

    public subtract(other: Vector3): Vector3 {
        return new Vector3(
            this.x - other.x,
            this.y - other.y,
            this.z - other.z
        );
    }

    public scalarMultiply(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    public multiply(other: Vector3): Vector3 {
        return new Vector3(
            this.x * other.x,
            this.y * other.y,
            this.z * other.z
        );
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    public dot(other: Vector3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    public cross(other: Vector3): Vector3 {
        return new Vector3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }

    public unit(): Vector3 {
        return this.scalarMultiply(1 / this.length());
    }

    public randomOnHemisphere(): Vector3 {
        const onUnitSphere = Vector3.randomInUnitSphere();
        if (onUnitSphere.dot(this) > 0.0) {
            return onUnitSphere;
        } else {
            return onUnitSphere.scalarMultiply(-1);
        }
    }

    public nearZero(): boolean {
        const s = 1e-8;

        return (
            Math.abs(this.x) < s && Math.abs(this.y) < s && Math.abs(this.z) < s
        );
    }

    public reflect(other: Vector3): Vector3 {
        return this.subtract(other.scalarMultiply(2 * this.dot(other)));
    }

    static randomInUnitSphere(): Vector3 {
        while (true) {
            const p = Vector3.randomBetween(-1, 1);
            if (p.lengthSquared() >= 1) continue;
            return p;
        }
    }

    static randomUnitVector(): Vector3 {
        return Vector3.randomInUnitSphere().unit();
    }

    static random(): Vector3 {
        return new Vector3(
            (Math.random() - 0.5) * infinity,
            (Math.random() - 0.5) * infinity,
            (Math.random() - 0.5) * infinity
        );
    }

    static randomBetween(min: number, max: number): Vector3 {
        return new Vector3(
            randomNumberBetweem(min, max),
            randomNumberBetweem(min, max),
            randomNumberBetweem(min, max)
        );
    }
}

export type Color = Vector3;
