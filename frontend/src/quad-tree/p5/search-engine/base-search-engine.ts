import { Point } from "framer-motion";
import { RectangularBoundary } from "../boundaries/rectangular-boundary";
import { Particle } from "../darticle";

export abstract class BaseSearchEngine {
    protected clock = 0;

    init(): void {}

    insert(_point: Point): boolean {
        return false;
    }

    reset(): void {
        // console.log(`Took ${this.clock} US to search`);
        this.clock = 0;
    }

    abstract search(boundary: RectangularBoundary): Particle[];

    visualise(_p5: any): void {}
}
