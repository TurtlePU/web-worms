import { EventEmitter } from 'events';

import { ISocketRoom } from './interface';

/** Makes all Rooms accessible from one distributor. */
export class Pool <
    SRoom extends ISocketRoom
> extends EventEmitter {
    /** "Empty" room. */
    protected dummy: SRoom;
    /** Set of rooms accessible via id. */
    protected pool: Map<String, SRoom>;

    /** Makes new room pool. */
    constructor(dummy: SRoom) {
        super();
        this.dummy = dummy;
        this.pool  = new Map();
    }

    /**
     * Adds new room to the pool.
     * @param room
     */
    protected add(room: SRoom) {
        return this.pool.set(room.id, room);
    }

    /**
     * @param id - id of a room.
     * @returns room on given id.
     */
    get(id: string): SRoom {
        return this.pool.get(id) || this.dummy;
    }
}
