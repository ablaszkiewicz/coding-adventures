import { Point } from "framer-motion";
import { RectangularBoundary } from "../boundaries/rectangular-boundary";
import { Particle } from "../darticle";
import { QuadTree } from "../quad-tree";
import { BaseSearchEngine } from "./base-search-engine";
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
