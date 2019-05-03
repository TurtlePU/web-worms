export default class Player {
    readonly id: string;
    alive: boolean;

    wormCount: number;
    private index: number;

    constructor(id: string, wormCount: number) {
        this.id = id;
        this.alive = true;
        this.wormCount = wormCount;
        this.index = 0;
    }

    nextWorm() {
        let i = this.index++;
        if (this.index == this.wormCount) {
            this.index = 0;
        }
        return i;
    }
}
