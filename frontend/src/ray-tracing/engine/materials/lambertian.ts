import { HitRecord } from "../hittables/hit-record";
import { Ray } from "../ray";
import { Vector3 } from "../vector3";
import { Material, ScatterResult } from "./material";

export class LambertianMaterial extends Material {
    constructor(public albedo: Vector3) {
        super();
    }

    scatter(_ray: Ray, hitRecord: HitRecord): ScatterResult {
        let scatterDirection = hitRecord.normal.add(Vector3.randomUnitVector());

        if (scatterDirection.nearZero()) {
            // todo: don't I need to create a copy here?
            scatterDirection = hitRecord.normal;
        }

        const scattered = new Ray(hitRecord.position, scatterDirection);
        const attentuation = this.albedo;

        return {
            didScatter: true,
            scattered,
            attentuation: attentuation,
        };
    }
}
