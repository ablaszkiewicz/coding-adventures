import { HitRecord } from "./hittables/hit-record";
import { Hittable } from "./hittables/hittable";
import { LambertianMaterial } from "./materials/lambertian";
import { Material, MaterialType } from "./materials/material";
import { MetalMaterial } from "./materials/metal";
import { Ray } from "./ray";
import { Vector3 } from "./vector3";

export class Sphere implements Hittable {
    private readonly material: Material;

    constructor(
        public readonly center: Vector3,
        public readonly radius: number,
        public readonly materialType: MaterialType,
        public readonly color: Vector3
    ) {
        switch (materialType) {
            case MaterialType.Metal:
                this.material = new MetalMaterial(color);
                break;
            case MaterialType.Lambertian:
                this.material = new LambertianMaterial(color);
                break;
            default:
                throw new Error(`Material type ${materialType} not supported`);
        }
    }

    hit(ray: Ray, tMin: number, tMax: number, hitRecord: HitRecord): boolean {
        if (!ray || !ray.origin) {
            console.log(ray);
        }

        const oc = this.center.subtract(ray.origin);
        const a = ray.direction.lengthSquared();
        const h = ray.direction.dot(oc);
        const c = oc.lengthSquared() - this.radius * this.radius;

        const discriminant = h * h - a * c;

        if (discriminant < 0) {
            return false;
        }

        const sqrtd = Math.sqrt(discriminant);

        let root = (h - sqrtd) / a;
        if (root <= tMin || root >= tMax) {
            root = (h + sqrtd) / a;
            if (root <= tMin || root >= tMax) {
                return false;
            }
        }

        hitRecord.t = root;
        hitRecord.position = ray.at(root);

        const outwardNormal = hitRecord.position
            .subtract(this.center)
            .scalarMultiply(1 / this.radius);
        hitRecord.setFaceNormal(ray, outwardNormal);
        hitRecord.material = this.material;

        return true;
    }
}
