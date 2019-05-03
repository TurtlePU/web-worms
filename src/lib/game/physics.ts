export default class PhysicsEngine {
    constructor(scheme: any) {
        // TODO: Physics.constructor
    }

    dropCrate(): Point {
        // TODO: Physics.dropCrate
        return null;
    }

    makeTerrain(): Terrain {
        // TODO: Physics.makeTerrain
        return null;
    }

    makeObjects(): GameObject[] {
        // TODO: Physics.makeObjects
        return [];
    }

    placeWorms(playerCount: number, wormCount: number): Point[][] {
        // TODO: Physics.placeWorms
        return [];
    }
}

interface GameObject {
    type: 'gas' | 'landmine';
    coords: Point;
}

interface Point {
    x: number;
    y: number;
    z: number;
}

interface Terrain {
    // TODO: Physics::Terrain
}
