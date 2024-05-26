export class Point<T = null> {
    constructor(public x: number, public y: number, public customData?: T) {}
}
