import { Point } from "framer-motion";
import { RectangularBoundary } from "../boundaries/RectangularBoundary";
import { Particle } from "../Particle";
import { QuadTree } from "../QuadTree";
import { BaseSearchEngine } from "./BaseSearchEngine";
import p5 from "p5";

export class QuadTreeSearchEngine extends BaseSearchEngine {
    constructor(private readonly quadTree: QuadTree) {
        super();
    }

    init(): void {
        this.quadTree.init();
    }

    insert(point: Point): boolean {
        return this.quadTree.insert(point);
    }

    search(boundary: RectangularBoundary): Particle[] {
        const time = window.performance.now();

        const results = this.quadTree
            .queryRange(boundary)
            .map((point) => point.customData);

        const timeTaken = window.performance.now() - time;

        this.clock += timeTaken;

        return results;
    }

    visualise(p5: p5): void {
        this.quadTree.draw(p5);
    }
}
