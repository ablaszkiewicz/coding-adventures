import { Drawable } from "./my-drawable";
import { Point } from "./my-point";
import { GRAY, WHITE, random } from "./utils";
import { RectangularBoundary } from "./boundaries/rectangular-boundary";
import p5 from "p5";
import { BaseSearchEngine } from "./search-engine/base-search-engine";
import { Props } from "../QuadTree";

const PARTICLE_RANDOM_FACTOR = 1;

const MIN_BOUNDARIES = new Point(-400, -400);
const MAX_BOUNDARIES = new Point(400, 400);
const FRAMES_TO_GLOW = 10;
const DELTA_TIME_MODIFIER = 0.1;

export class Particle implements Drawable {
    private moveVector = new Point(
        random(-PARTICLE_RANDOM_FACTOR, PARTICLE_RANDOM_FACTOR),
        random(-PARTICLE_RANDOM_FACTOR, PARTICLE_RANDOM_FACTOR)
    );
    public point: Point<Particle>;
    private framesToGlow = 0;

    constructor(
        private searchEngine: BaseSearchEngine,
        private readonly props: Props
    ) {
        this.point = new Point<Particle>(
            random(MIN_BOUNDARIES.x, MAX_BOUNDARIES.x),
            random(MIN_BOUNDARIES.y, MAX_BOUNDARIES.y),
            this
        );
    }

    markWithColor(app: p5): void {
        app.stroke("green");
        app.strokeWeight(this.props.sizeOfParticles * 2);
        app.point(this.point.x, this.point.y);
    }

    update(deltaTime: number): void {
        this.move(deltaTime);
        this.checkAndHandleMapCollision();
        this.checkAndHandleParticleCollision();
    }

    move(deltaTime: number): void {
        this.point.x += this.moveVector.x * deltaTime * DELTA_TIME_MODIFIER;
        this.point.y += this.moveVector.y * deltaTime * DELTA_TIME_MODIFIER;
    }

    checkAndHandleMapCollision(): void {
        if (
            this.point.x + this.props.sizeOfParticles / 2 > MAX_BOUNDARIES.x ||
            this.point.x - this.props.sizeOfParticles / 2 < MIN_BOUNDARIES.x
        ) {
            this.moveVector.x = -this.moveVector.x;
        }

        if (
            this.point.y + this.props.sizeOfParticles / 2 > MAX_BOUNDARIES.y ||
            this.point.y - this.props.sizeOfParticles / 2 < MIN_BOUNDARIES.y
        ) {
            this.moveVector.y = -this.moveVector.y;
        }
    }

    checkAndHandleParticleCollision(): void {
        const possiblyColliding = this.searchEngine.search(
            this.getRectangularBoundaryForQuadTree()
        );

        const collidingParticles = possiblyColliding.filter(
            (particle) => particle !== this && this.intersects(particle)
        );

        if (collidingParticles.length > 0) {
            const collidingOne = collidingParticles[0];

            this.handleCollisionWithParticle(collidingOne);
            this.framesToGlow = FRAMES_TO_GLOW;
            collidingOne.framesToGlow = FRAMES_TO_GLOW;
        }

        this.framesToGlow--;
    }

    draw(app: p5): void {
        this.update(app.deltaTime);

        app.stroke(this.framesToGlow > 0 ? WHITE : GRAY);
        app.strokeWeight(this.props.sizeOfParticles * 2);
        app.point(this.point.x, this.point.y);
    }

    intersects(particle: Particle): boolean {
        const distance = Math.sqrt(
            Math.pow(particle.point.x - this.point.x, 2) +
                Math.pow(particle.point.y - this.point.y, 2)
        );

        return distance < this.props.sizeOfParticles * 2;
    }

    handleCollisionWithParticle(particle: Particle): void {
        const nx = particle.point.x - this.point.x;
        const ny = particle.point.y - this.point.y;
        const distance = Math.sqrt(nx * nx + ny * ny);
        const unitNormal = { x: nx / distance, y: ny / distance };
        const unitTangent = { x: -unitNormal.y, y: unitNormal.x };

        // Project the velocities onto the normal and tangent vectors
        const v1n =
            unitNormal.x * this.moveVector.x + unitNormal.y * this.moveVector.y;
        const v1t =
            unitTangent.x * this.moveVector.x +
            unitTangent.y * this.moveVector.y;
        const v2n =
            unitNormal.x * particle.moveVector.x +
            unitNormal.y * particle.moveVector.y;
        const v2t =
            unitTangent.x * particle.moveVector.x +
            unitTangent.y * particle.moveVector.y;

        // Swap the normal components
        const v1nAfter = v2n;
        const v2nAfter = v1n;

        // Convert the scalar normal and tangential velocities into vectors
        const v1nVector = {
            x: v1nAfter * unitNormal.x,
            y: v1nAfter * unitNormal.y,
        };
        const v1tVector = { x: v1t * unitTangent.x, y: v1t * unitTangent.y };
        const v2nVector = {
            x: v2nAfter * unitNormal.x,
            y: v2nAfter * unitNormal.y,
        };
        const v2tVector = { x: v2t * unitTangent.x, y: v2t * unitTangent.y };

        // Update velocities
        this.moveVector.x = v1nVector.x + v1tVector.x;
        this.moveVector.y = v1nVector.y + v1tVector.y;
        particle.moveVector.x = v2nVector.x + v2tVector.x;
        particle.moveVector.y = v2nVector.y + v2tVector.y;

        // Separate the particles
        const overlap = this.props.sizeOfParticles * 2 - distance;
        const correctionFactor = 0.5; // to equally distribute the correction
        const correction = {
            x: unitNormal.x * overlap * correctionFactor,
            y: unitNormal.y * overlap * correctionFactor,
        };

        this.point.x -= correction.x;
        this.point.y -= correction.y;
        particle.point.x += correction.x;
        particle.point.y += correction.y;
    }

    getRectangularBoundaryForQuadTree(): RectangularBoundary {
        return new RectangularBoundary(
            new Point(
                this.point.x - this.props.sizeOfParticles * 2,
                this.point.y - this.props.sizeOfParticles * 2
            ),
            new Point(
                this.point.x + this.props.sizeOfParticles * 2,
                this.point.y + this.props.sizeOfParticles * 2
            )
        );
    }
}
