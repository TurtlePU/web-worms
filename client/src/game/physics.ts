const { max, cos, random, sin, sqrt } = Math;

// TODO: physics engine
class PhysicsEngine {
    private dots: Circle[];

    init(...args: any[]) {
        this.dots = [];
    }

    addDot(x: number, y: number) {
        this.dots.push(new Circle(
            'cyan',
            2,
            new Point(x, y),
            10
        ));
    }

    private C = 10;
    private border = 100;

    update(delta: number) {
        for (let a of this.dots) {
            for (let b of this.dots) {
                if (a === b) continue;
                let r = sub(b.c, a.c);
                let f = this.C * delta * delta / r.sqlen();
                let d = r.norm().mul(f);
                if (r.len() <= max(a.r + b.r, this.border)) {
                    d = d.neg();
                }
                /*if (r.len() >= 2 * this.border) {
                    d = new Point(0, 0);
                }*/
                a.c = sum(a.c, d.mul(b.mass));
                b.c = sum(b.c, d.neg().mul(a.mass));
            }
        }
    }

    get circles() {
        return this.dots;
    }
}

class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    len() {
        return sqrt(this.sqlen());
    }
    mul(k: number) {
        return new Point(this.x * k, this.y * k);
    }
    neg() {
        return new Point(-this.x, -this.y);
    }
    norm() {
        return new Point(this.x / this.len(), this.y / this.len());
    }
    rot(alpha: number) {
        return new Point(
            this.x * cos(alpha) - this.y * sin(alpha),
            this.y * cos(alpha) + this.x * sin(alpha)
        );
    }
    sqlen() {
        return this.x * this.x + this.y * this.y;
    }
}

function sum(a: Point, b: Point) {
    return new Point(a.x + b.x, a.y + b.y);
}

function sub(a: Point, b: Point) {
    return sum(a, b.neg());
}

class Circle {
    c: Point;
    mass: number;
    r: number;
    type: string;
    constructor(type: string, mass: number, c: Point, r: number) {
        this.type = type;
        this.mass = mass;
        this.c = c;
        this.r = r;
    }
}

export const Physics = new PhysicsEngine();
