import { EventEmitter } from 'events';

import Physics from './physics';
import Player from './player';

const { floor, random } = Math;

const THROW_TIMEOUT = 10000;

export default class Game extends EventEmitter {
    private physics: Physics;
    private scheme: any;

    private death: boolean;

    private players: Player[];
    private index: number;

    private waitTimeout: NodeJS.Timeout;
    private resolve: Function;

    constructor(physicsScheme: any, gameScheme: any) {
        super();

        this.physics = new Physics(physicsScheme);
        this.scheme = gameScheme;

        this.suddenDeath = this.suddenDeath.bind(this);

        this.players = [];
        this.index = 0;
    }

    private crateType() {
        let i = floor(random() * this.scheme.crates.length);
        return this.scheme.crates[i];
    }

    private dropCrates() {
        if (random() <= this.scheme.dropChance) {
            this.emit('crate', {
                type: this.crateType(),
                point: this.physics.dropCrate()
            });
        }
    }

    private increaseWaterLevel() {
        // TODO: increase water level
    }

    private isEnd() {
        return this.players
        .map(player => +player.alive)
        .reduce((prev, cur) => prev + cur) <= 1;
    }

    private nextPlayer() {
        let i = this.index++;
        if (this.index == this.players.length) {
            this.index = 0;
        }
        return this.players[i];
    }

    private suddenDeath() {
        // TODO: sudden death
    }

    // TODO: change architecture a little --- get from physics how much to wait
    private async turn() {
        let player = this.nextPlayer();
        if (this.death) {
            this.suddenDeath();
            await this.ready();
        }
        this.dropCrates();
        await this.ready();
        // TODO: set correct game state
        this.emit('turn', player.nextWorm());
        await this.wait(this.scheme.turnTime);
        // TODO: set correct game state
        await this.wait(this.scheme.retreatTime);
        // TODO: set correct game state
        this.increaseWaterLevel();
    }

    interrupt(id: string) {
        if (id == this.players[this.index].id) {
            clearTimeout(this.waitTimeout);
            this.resolve();
        }
    }

    private async ready() {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.waitTimeout = setTimeout(reject, THROW_TIMEOUT);
        });
    }

    private async wait(time: number) {
        return new Promise((resolve, _) => {
            this.resolve = resolve;
            this.waitTimeout = setTimeout(resolve, time);
        });
    }

    addPlayer(id: string) {
        let contains = this.players.findIndex(player => {
            return player.id == id;
        }) != -1;
        if (!contains) {
            this.players.push(new Player(id, this.scheme.wormCount));
            // TODO: game-specific player adds, some emits
        }
        return !contains;
    }

    removePlayer(id: string) {
        let index = this.players.findIndex(player => {
            return player.id == id;
        });
        if (index != -1) {
            this.players.splice(index, 1);
            // TODO: game-specific player removes, some emits
        }
        return index != -1;
    }

    async start() {
        this.emit('terrain', this.physics.makeTerrain());
        this.emit('objects', this.physics.makeObjects());
        let worms = this.physics.placeWorms(
            this.players.length,
            this.scheme.wormCount
        ).map((worms, index) => ({
            id: this.players[index].id,
            worms
        }));
        this.emit('worms', worms);
        setTimeout(() => this.death = true, this.scheme.gameTime);
        while (!this.isEnd()) {
            await this.turn();
        }
        this.emit('end');
    }
}
