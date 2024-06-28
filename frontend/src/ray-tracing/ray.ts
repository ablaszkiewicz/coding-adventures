import { Vector3 } from "./vector3";

export class Ray {
    constructor(public origin: Vector3, public direction: Vector3) {}

    public at(t: number): Vector3 {
        return this.origin.add(this.direction.scalarMultiply(t));
    }
}
