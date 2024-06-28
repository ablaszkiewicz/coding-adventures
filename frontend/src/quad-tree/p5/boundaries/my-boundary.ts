import { Point } from "../my-point";

export interface Boundary {
    center: Point;
    containsPoint(point: Point): boolean;
    intersectsWithOtherBoundary(other: Boundary): boolean;
}
