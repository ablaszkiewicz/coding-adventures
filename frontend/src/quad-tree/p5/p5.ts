import p5 from "p5";
import { Particle } from "./Particle";
import { QuadTree } from "./QuadTree";
import { RectangularBoundary } from "./boundaries/RectangularBoundary";
import { ClassicSearchEngine } from "./search-engine/ClassicSearchEngine";
import { Point } from "./Point";
import { QuadTreeSearchEngine } from "./search-engine/QuadTreeSearchEngine";
import { BaseSearchEngine } from "./search-engine/BaseSearchEngine";
import { Engine, Props } from "../QuadTree";

export function sketch(p5: p5) {
    let particles: Particle[] = [];
    let searchEngine: BaseSearchEngine;
    let visualizeBoundaries = false;
    let visualizeParticleBoundaries = false;
    let numberOfParticles = 0;
    let maxParticlesPerCell = 0;
    let sizeOfParticles = 0;
    let engine = Engine.Classic;

    const init = (props: Props) => {
        const quadTree = new QuadTree(
            new RectangularBoundary(new Point(-400, -400), new Point(400, 400)),
            props
        );

        particles = [];
        const classicSearchEngine = new ClassicSearchEngine(particles);
        const quadTreeSearchEngine = new QuadTreeSearchEngine(quadTree);

        searchEngine =
            props.engine === Engine.Classic
                ? classicSearchEngine
                : quadTreeSearchEngine;

        particles.push(
            ...Array.from(
                { length: props.numberOfParticles },
                () => new Particle(searchEngine, props)
            )
        );

        return {
            particles,
            searchEngine,
        };
    };

    const searchRange = new RectangularBoundary(
        new Point(-170, -120),
        new Point(170, 120)
    );

    (p5 as any).updateWithProps = ({ props }: { props: Props }) => {
        if (
            engine !== props.engine ||
            numberOfParticles !== props.numberOfParticles ||
            sizeOfParticles !== props.sizeOfParticles ||
            maxParticlesPerCell !== props.maxParticlesPerCell
        ) {
            init(props);
        }

        visualizeBoundaries = props.visualizeBoundaries;
        visualizeParticleBoundaries = props.visualizeParticleBoundaries;
        numberOfParticles = props.numberOfParticles;
        maxParticlesPerCell = props.maxParticlesPerCell;
        sizeOfParticles = props.sizeOfParticles;
        engine = props.engine;
    };

    p5.setup = () => p5.createCanvas(800, 800, p5.WEBGL);

    p5.draw = () => {
        p5.background(0);

        searchEngine.init();
        particles.forEach((particle) => {
            searchEngine.insert(particle.point);
        });
        const particlesInRange: Particle[] = searchEngine.search(searchRange);

        particles.forEach((particle) => particle.draw(p5));

        particlesInRange.forEach((particle) => particle.markWithColor(p5));

        p5.strokeWeight(1);

        searchRange.draw(p5);
        if (visualizeBoundaries) {
            searchEngine.visualise(p5);
        }

        if (visualizeParticleBoundaries) {
            particles.forEach((particle) =>
                particle.getRectangularBoundaryForQuadTree().draw(p5)
            );
        }

        searchEngine.reset();
    };
}
