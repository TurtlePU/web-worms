import ShortID from 'shortid';
import { Socket } from 'socket.io';
import { EventEmitter } from 'events';

// FIXME: Emit events!
export type RoomEvent = 'state:lobby' | 'state:full' | 'state:game' | 'state:end';

// TODO: Decouple Lobby from Room.
/** Game room class. */
export default class Room extends EventEmitter {
    /**
     * Unique short identifier.
     */
    readonly ID: string;

    // TODO: Room.sockets
    // 2 lists: connected & online

    /**
     * @constructor
     * Creates new Room with random ID.
     */
    constructor() {
        super();
        this.ID = ShortID.generate();
    }

    emit(event: RoomEvent): boolean {
        return super.emit(event);
    }

    on(event: RoomEvent, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    /**
     * Adds necessary game event listeners to the socket.
     * 
     * @param socket 
     */
    capture(socket: Socket): void {
        // TODO: Room.capture
        /**
         *  1. Emit auth:reject if doesn't belong
         *  2. Add listeners for game events
         *  3. Push to online, emit events
         */
    }

    /**
     * @param socketID 
     * @returns true if given socket was connected to this game, false otherwise
     */
    has(socketID: string): boolean {
        // TODO: Room.has
        // Check in connected
        return true;
    }

    /**
     * Releases given socket in some way.
     * 
     * @param socket 
     */
    release(socket: Socket): void {
        // TODO: Room.release
        // Move to connected from online, emit events
    }
};
