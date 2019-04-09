/** Game room class. */
export default class Room {
    /**
     * Unique identifier in human-readable format.
     */
    readonly id: string;

    /**
     * @constructor
     * Creates new Room with random ID.
     */
    constructor() {
        //
    }

    /**
     * @returns true if this room is full, false otherwise
     */
    full() {
        return false;
    }
};
