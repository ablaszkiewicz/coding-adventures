import { HitRecord } from "./hit-record";
import { Ray } from "./ray";

export interface Hittable {
    hit(ray: Ray, tMin: number, tMax: number, hitRecord: HitRecord): boolean;
}
