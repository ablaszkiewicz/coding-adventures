import { Props } from "../QuadTree";
import { RectangularBoundary } from "./boundaries/RectangularBoundary";
import { Drawable } from "./Drawable";
import { Point } from "./Point";
import { WHITE } from "./utils";
import p5 from "p5";

export class QuadTree implements Drawable {
    private topLeft?: QuadTree;
    private topRight?: QuadTree;
    private bottomLeft?: QuadTree;
    private bottomRight?: QuadTree;

    private points: Point[] = [];

    constructor(public boundary: RectangularBoundary, private props: Props) {}
    draw(app: p5): void {
        const { pointA, pointB } = this.boundary;

        app.stroke(WHITE);
        app.noFill();
        app.rect(pointA.x, pointA.y, pointB.x - pointA.x, pointB.y - pointA.y);

        this.topLeft?.draw(app);
        this.topRight?.draw(app);
        this.bottomLeft?.draw(app);
        this.bottomRight?.draw(app);
    }

    insert(point: Point<any>): boolean {
        if (!this.boundary.containsPoint(point)) {
            return false;
        }

        if (
            this.points.length < this.props.maxParticlesPerCell &&
            !this.topLeft
        ) {
            this.points.push(point);
            return true;
        }

        if (!this.topLeft) {
            this.subdivide();
        }

        if (this.topLeft?.insert(point)) return true;
        if (this.topRight?.insert(point)) return true;
        if (this.bottomLeft?.insert(point)) return true;
        if (this.bottomRight?.insert(point)) return true;

        return false;
    }

    subdivide(): void {
        const { x, y } = this.boundary.center;
        const { pointA, pointB } = this.boundary;

        this.topLeft = new QuadTree(
            new RectangularBoundary(pointA, new Point(x, y)),
            this.props
        );
        this.topRight = new QuadTree(
            new RectangularBoundary(
                new Point(x, pointA.y),
                new Point(pointB.x, y)
            ),
            this.props
        );
        this.bottomLeft = new QuadTree(
            new RectangularBoundary(
                new Point(pointA.x, y),
                new Point(x, pointB.y)
            ),
            this.props
        );
        this.bottomRight = new QuadTree(
            new RectangularBoundary(new Point(x, y), pointB),
            this.props
        );

        this.points.forEach((point) => {
            if (this.topLeft?.insert(point)) return;
            if (this.topRight?.insert(point)) return;
            if (this.bottomLeft?.insert(point)) return;
            if (this.bottomRight?.insert(point)) return;
        });

        this.points = [];
    }

    public queryRange(range: RectangularBoundary): Point<any>[] {
        const pointsInRange: Point[] = [];

        if (!this.boundary.intersectsWithOtherBoundary(range)) {
            return [];
        }

        this.points.forEach((point) => {
            if (range.containsPoint(point)) {
                pointsInRange.push(point);
            }
        });

        if (!this.topLeft) {
            return pointsInRange;
        }

        pointsInRange.push(...(this.topLeft?.queryRange(range) || []));
        pointsInRange.push(...(this.topRight?.queryRange(range) || []));
        pointsInRange.push(...(this.bottomLeft?.queryRange(range) || []));
        pointsInRange.push(...(this.bottomRight?.queryRange(range) || []));

        return pointsInRange;
    }

    init(): void {
        this.topLeft?.init();
        this.topRight?.init();
        this.bottomLeft?.init();
        this.bottomRight?.init();
        this.topLeft = undefined;
        this.topRight = undefined;
        this.bottomLeft = undefined;
        this.bottomRight = undefined;
    }
}
