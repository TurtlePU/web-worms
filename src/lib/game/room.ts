import ShortID from 'shortid';

/** Game room class. */
export default class Room {
    /**
     * Unique short identifier.
     */
    readonly ID: string;

    /**
     * @constructor
     * Creates new Room with random ID.
     */
    constructor() {
        this.ID = ShortID.generate();
    }

    /**
     * @returns true if this room is full, false otherwise
     */
    full() {
        return false;
    }
};
