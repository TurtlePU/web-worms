import { Socket } from 'socket.io';

import { game, physics } from '../data/export';

import Game from './game/class';

import {
    Handler,
    ISocketRoom,
    Pool,
    SocketInfo,
    SocketRoom
} from './room/export';

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

// TODO: pass old socket to Game to restore game data

class Room extends SocketRoom<Info> implements IRoom {
    /** Handles game logic. */
    private game: Game;
    /** List of previously connected sockets' IDs. */
    private oldSockets: Set<string>;

    /**
     * Makes new Room from given Lobby info.
     * @param id
     * @param sockets
     */
    constructor(id: string, sockets: Socket[]) {
        super(id);

        this.game = new Game(
            physics.basic,
            game.basic
        );

        this.oldSockets = new Set();
        sockets.forEach(socket => this.add(socket));

        // TODO: add game event handlers
    }

    private ready() {
        return [...this.socketInfo.values()]
            .every(info => info.ready);
    }

    protected handlers(socket: Socket) {
        const leave = () => {
            this.remove(socket);
            this.game.removePlayer(socket.id);
        };
        return [
            new Handler('disconnect', leave),
            new Handler('game:ready', () => {
                this.socketInfo.get(socket.id).ready = true;
                if (this.ready()) {
                    this.game.start();
                }
            }),
            new Handler('room:left', leave),
            new Handler('room:scheme:game', (ack) => {
                ack(game.basic);
            }),
            new Handler('room:scheme:physics', (ack) => {
                ack(physics.basic);
            }),
        ];
    }

    protected SocketInfo(handlers: Handler[]) {
        return {
            handlers,
            ready: false
        };
    }

    add(socket: Socket) {
        if (!this.oldSockets.has(socket.id)) {
            this.oldSockets.add(socket.id);
            return super.add(socket) && this.game.addPlayer(socket.id);
        }
        return true;
    }

    had(id: string) {
        return this.oldSockets.has(id);
    }

    start() {
        this.cast('room:start', this.id);
    }
}

interface Info extends SocketInfo {
    ready: boolean
}
