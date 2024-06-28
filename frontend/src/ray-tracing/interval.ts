export class Interval {
    constructor(public min: number, public max: number) {}

    public surrounds(x: number): boolean {
        return x >= this.min && x <= this.max;
    }

    public clamp(x: number): number {
        if (x < this.min) {
            return this.min;
        }
        if (x > this.max) {
            return this.max;
        }
        return x;
    }
}
