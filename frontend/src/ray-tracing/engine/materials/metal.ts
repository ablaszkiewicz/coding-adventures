import { HitRecord } from "../hittables/hit-record";
import { Ray } from "../ray";
import { Vector3 } from "../vector3";
import { Material, ScatterResult } from "./material";

export class MetalMaterial extends Material {
    constructor(public albedo: Vector3) {
        super();
    }

    scatter(ray: Ray, hitRecord: HitRecord): ScatterResult {
        const reflected = ray.direction.reflect(hitRecord.normal);

        const scattered = new Ray(hitRecord.position, reflected);
        const attentuation = this.albedo;

        return {
            didScatter: true,
            scattered,
            attentuation: attentuation,
        };
    }
}
