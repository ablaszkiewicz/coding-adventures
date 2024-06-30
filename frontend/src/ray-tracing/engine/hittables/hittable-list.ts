import { HitRecord } from "./hit-record";
import { Hittable } from "./hittable";
import { Ray } from "../ray";

export class HittableList implements Hittable {
    constructor(public objects: Hittable[]) {}

    hit(ray: Ray, tMin: number, tMax: number, hitRecord: HitRecord): boolean {
        const tempRecord = new HitRecord();
        let hitAnything = false;
        let closestSoFar = tMax;

        for (const object of this.objects) {
            if (object.hit(ray, tMin, closestSoFar, tempRecord)) {
                hitAnything = true;
                closestSoFar = tempRecord.t;

                hitRecord.normal = tempRecord.normal;
                hitRecord.position = tempRecord.position;
                hitRecord.t = tempRecord.t;
                hitRecord.material = tempRecord.material;
            }
        }

        return hitAnything;
    }
}
