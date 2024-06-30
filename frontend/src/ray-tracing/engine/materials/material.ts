import { HitRecord } from "../hittables/hit-record";
import { Ray } from "../ray";
import { Vector3 } from "../vector3";

export enum MaterialType {
    Lambertian = "Lambertian",
    Metal = "Metal",
}

export interface ScatterResult {
    didScatter: boolean;
    scattered?: Ray;
    attentuation?: Vector3;
}

export abstract class Material {
    public scatter(_ray: Ray, _hitRecord: HitRecord): ScatterResult {
        return { didScatter: false };
    }
}
