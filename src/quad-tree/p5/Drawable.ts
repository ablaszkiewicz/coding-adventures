import p5 from "p5";

export interface Drawable {
    draw(app: p5): void;
}
