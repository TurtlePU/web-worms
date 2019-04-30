import { Socket } from 'socket.io';

import { Handler } from './room/handler';

const nullRoom = {
    had: (_: any) => false,
    start: () => {},
    push: (_: any) => false
};

/** Game room class. */
export default class Room {
// STATIC
    /** Live rooms. */
    private static pool = new Map<string, Room>();

    /**
     * Makes new room from given params.
     * @param ID 
     * @param sockets 
     */
    static from(ID: string, sockets: Socket[]) {
        Room.pool.set(ID, new Room(ID, sockets));
    }

    /**
     * @param ID - ID of some room
     * @returns Room by given ID
     */
    static get(ID: string) {
        return Room.pool.get(ID) || nullRoom;
    }

// OBJECT
    /** Unique short identifier. */
    private readonly ID: string;
    /** Sockets currently connected to the room. */
    private sockets: Socket[];
    /** IDs of Sockets previously connected to the room. */
    private oldSockets: Set<string>;
    /** Game settings. */
    private readonly schemes = {
        physics: {
            // TODO: physics settings
        },
        game: {
            // TODO: game settings
        }
    };

    private constructor(ID: string, sockets: Socket[]) {
        this.ID = ID;
        this.sockets = sockets;
        this.oldSockets = new Set(sockets.map(socket => socket.id));
    }

    /**
     * Sets the environments, emits the game:start event to sockets.
     */
    start() {
        // TODO: Room.start()
    }

    push(socket: Socket) {
        // FIXME: Room.push -- unit operation of start() & reconnect
        const listeners = [
            new Handler('room:scheme:physics', (ack) => {
                ack(this.schemes.physics);
            }),
            new Handler('room:scheme:game', (ack) => {
                ack(this.schemes.game);
            })
        ];
        return true;
    }

    /**
     * @param socketID - ID of some socket
     * @returns true if given socket was connected to this room, false otherwise
     */
    had(socketID: string) {
        return this.oldSockets.has(socketID);
    }
};
