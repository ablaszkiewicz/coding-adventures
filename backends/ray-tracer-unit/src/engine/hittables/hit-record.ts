import { LambertianMaterial } from "../materials/lambertian";
import { Material } from "../materials/material";
import { Ray } from "../ray";
import { Vector3 } from "../vector3";

export class HitRecord {
    public position: Vector3 = new Vector3(0, 0, 0);
    public normal: Vector3 = new Vector3(0, 0, 0);
    public t: number = 0;
    public material: Material = new LambertianMaterial(new Vector3(0, 0, 0));

    constructor() {}

    public setFaceNormal(ray: Ray, outwardNormal: Vector3): void {
        if (ray.direction.dot(outwardNormal) < 0) {
            this.normal = outwardNormal;
        } else {
            this.normal = outwardNormal.scalarMultiply(-1);
        }
    }
}
