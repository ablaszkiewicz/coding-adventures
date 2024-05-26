import { Point } from "../Point";

export interface Boundary {
    center: Point;
    containsPoint(point: Point): boolean;
    intersectsWithOtherBoundary(other: Boundary): boolean;
}
