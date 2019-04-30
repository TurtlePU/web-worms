import { Socket } from 'socket.io';

import {
    Handler,
    ISocketRoom,
    Pool,
    SocketInfo,
    SocketRoom
} from './room/export';

import { game, physics } from '../data/export';

class RoomPool extends Pool<IRoom> {
    /** @override in RoomPool. */
    constructor() {
        super({
            id: 'room dummy',
            add: (_: any) => false,
            flush: () => {},
            had: (_: any) => false,
            start: () => {}
        });
    }

    /** @override in RoomPool. */
    protected add(room: Room) {
        room
        .on('end', () => {
            this.emit('end', room.id);
        });
        return super.add(room);
    }

    /**
     * Adds new Room made from Lobby info.
     * @param id - id of Lobby (Room)
     * @param sockets - list of connected sockets
     */
    from(id: string, sockets: Socket[]) {
        this.add(new Room(id, sockets));
    }
}

export default new RoomPool();

interface IRoom extends ISocketRoom {
    /** @override in Room. */
    add(socket: Socket): boolean,

    /**
     * @param id
     * @returns true if socket by given id was connected to the room previously 
     */
    had(id: string): boolean,

    /** Sets the environments, emits 'game:start' to players. */
    start(): void
}

class Room extends SocketRoom<Info> implements IRoom {
    /** List of previously connected sockets' IDs. */
    private oldSockets: Set<string>;

    /**
     * Makes new Room from given Lobby info.
     * @param id
     * @param sockets
     */
    constructor(id: string, sockets: Socket[]) {
        super(id);
        this.oldSockets = new Set();
        sockets.forEach(socket => this.add(socket));
    }

    protected handlers(socket: Socket) {
        // TODO: Room.handlers
        return [
            new Handler('room:scheme:physics', (ack) => {
                ack(physics.basic);
            }),
            new Handler('room:scheme:game', (ack) => {
                ack(game.basic);
            })
        ];
    }

    protected SocketInfo(handlers: Handler[]) {
        // TODO: Room.SocketInfo
        return {
            handlers
        };
    }

    add(socket: Socket) {
        this.oldSockets.add(socket.id);
        return super.add(socket);
    }

    had(id: string) {
        return this.oldSockets.has(id);
    }

    start() {
        // TODO: Room.start: start the environments
        this.cast('room:start', this.id);
    }
}

interface Info extends SocketInfo {
    // TODO: Room:Info
}
