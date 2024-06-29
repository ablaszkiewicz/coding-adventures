import { HitRecord } from "./hit-record";
import { Hittable } from "./hittable";
import { Ray } from "./ray";
import { Vector3 } from "./vector3";

export class Sphere implements Hittable {
    constructor(
        public readonly center: Vector3,
        public readonly radius: number
    ) {}

    hit(ray: Ray, tMin: number, tMax: number, hitRecord: HitRecord): boolean {
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

        return true;
    }
}
