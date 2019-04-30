import { Socket } from 'socket.io';

export interface ISocketRoom {
    /** Unique identifier. */
    readonly id: string,
    /**
     * Adds socket to the room, sets room-specific handlers.
     * @param socket - socket to add.
     */
    add(socket: Socket): boolean,
    flush(): void
}
