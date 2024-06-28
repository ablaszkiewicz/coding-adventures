import p5 from "p5";
import { Drawable } from "../my-drawable";
import { Point } from "../my-point";
import { Boundary } from "./my-boundary";

export class RectangularBoundary implements Boundary, Drawable {
    public center: Point;

    constructor(public pointA: Point, public pointB: Point) {
        this.center = new Point(
            (pointA.x + pointB.x) / 2,
            (pointA.y + pointB.y) / 2
        );
    }
    draw(app: p5): void {
        app.stroke("green");
        app.noFill();
        app.rect(
            this.pointA.x,
            this.pointA.y,
            this.pointB.x - this.pointA.x,
            this.pointB.y - this.pointA.y
        );
    }

    containsPoint(point: Point): boolean {
        return (
            point.x >= this.pointA.x &&
            point.x <= this.pointB.x &&
            point.y >= this.pointA.y &&
            point.y <= this.pointB.y
        );
    }

    intersectsWithOtherBoundary(other: RectangularBoundary): boolean {
        if (this.pointB.x < other.pointA.x || other.pointB.x < this.pointA.x) {
            return false;
        }

        if (this.pointB.y < other.pointA.y || other.pointB.y < this.pointA.y) {
            return false;
        }

        return true;
    }
}
