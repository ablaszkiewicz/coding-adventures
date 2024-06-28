import { RectangularBoundary } from "../boundaries/rectangular-boundary";
import { Particle } from "../darticle";
import { BaseSearchEngine } from "./base-search-engine";

export class ClassicSearchEngine extends BaseSearchEngine {
    constructor(private readonly particles: Particle[]) {
        super();
    }

    search(boundary: RectangularBoundary): Particle[] {
        const time = window.performance.now();

        const results = this.particles.filter((particle) =>
            boundary.intersectsWithOtherBoundary(
                particle.getRectangularBoundaryForQuadTree()
            )
        );

        const timeTaken = window.performance.now() - time;

        this.clock += timeTaken;

        return results;
    }
}
