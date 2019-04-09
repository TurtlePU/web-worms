import ShortID from 'shortid';
import { Socket } from 'socket.io';
import { EventEmitter } from 'events';

// Don't forget to emit the events!
export type RoomEvent = 'state:lobby' | 'state:full' | 'state:game' | 'state:end';

/** Game room class. */
export default class Room extends EventEmitter {
    /**
     * Unique short identifier.
     */
    readonly ID: string;

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
        // TODO
    }
    
    /**
     * @param socketID 
     * @returns true if given socket was connected to this game, false otherwise
     */
    has(socketID: string): boolean {
        // TODO
        return true;
    }

    /**
     * Releases given socket in some way.
     * 
     * @param socket 
     */
    release(socket: Socket): void {
        // TODO
    }
};
