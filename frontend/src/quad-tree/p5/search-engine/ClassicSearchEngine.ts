import { RectangularBoundary } from "../boundaries/RectangularBoundary";
import { Particle } from "../Particle";
import { BaseSearchEngine } from "./BaseSearchEngine";

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
