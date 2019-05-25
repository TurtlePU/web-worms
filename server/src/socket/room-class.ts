import { EventEmitter } from 'events';
import { next_id } from '../lib/id-generator';
import { Socket } from './socket-class';

/** A set of players playing together. */
export class Room extends EventEmitter implements IRoom {
    /** To emit events. */
    static io: SocketIO.Server;
    /** Unique, human-readable id. */
    readonly id: string;
    /** List of sockets connected to the room. */
    private sockets: Socket[];
    /** State of a room. */
    private _state: State;

    constructor() {
        super();
        this.id = next_id();
        this.sockets = [];
        this._state = State.LOBBY;
    }

    get state() {
        return this._state;
    }

    get members() {
        return this.sockets.map((_, index) =>
            this.socket_info(index)
        );
    }

    get schemes() {
        // TODO: return game schemes
        return {
            rules: {},
            physics: {}
        };
    }

    is_full() {
        return this.sockets.length == MAX_SOCKETS;
    }

    is_ready() {
        return this.sockets.every(socket => socket.ready);
    }

    join(socket: Socket) {
        if (this.is_full()) {
            return false;
        }
        socket.join(this.id);
        let n = this.sockets.push(socket);
        switch (this.state) {
            case State.LOBBY:
                this.cast('lobby:join', ...this.socket_info(n - 1));
                this.cast_enabled();
                if (this.is_full()) {
                    this.emit('full');
                }
                break;
            case State.ROOM:
                // TODO: reconnect to game
        }
        return true;
    }

    leave(socket: Socket) {
        let index = this.sockets.indexOf(socket);
        if (index == -1) {
            return false;
        }
        socket.leave(this.id);
        this.sockets.splice(index, 1);
        this.cast('left', socket.public_id);
        switch (this.state) {
            case State.LOBBY:
                this.cast_enabled();
                this.emit('free');
                break;
            case State.ROOM:
                // TODO: leave game
        }
        return true;
    }

    cast_ready(socket: Socket) {
        if (!this.sockets.includes(socket)) {
            return false;
        }
        this.cast('lobby:ready', socket.public_id, socket.ready);
        this.cast_enabled();
        return true;
    }

    load_game() {
        if (this.state != State.LOBBY) {
            return false;
        }
        // TODO: new Game, add game state
        this.sockets.forEach(socket => {
            socket.ready = false;
        });
        this._state = State.LOADING;
        this.emit('full');
        this.cast('room:start', this.id);
        return true;
    }

    start_game() {
        if (this.state != State.LOADING || !this.is_ready()) {
            return false;
        }
        // TODO: start game
        this._state = State.ROOM;
        this.cast('game:start');
        return true;
    }

    private cast(event: string, ...args: any[]) {
        Room.io.to(this.id).emit(event, ...args);
    }

    private cast_enabled() {
        if (this.sockets.length == 0) {
            return;
        }
        this.sockets[0].emit(
            'lobby:start-enabled',
            this.is_ready()
        );
    }

    private socket_info(index: number) {
        return [
            this.sockets[index].public_id,
            this.sockets[index].ready,
            index == 0
        ] as SocketInfo;
    }
}

const MAX_SOCKETS = 4;

export enum State { DUMMY, LOBBY, LOADING, ROOM };

export const dummy: IRoom = {
    state: State.DUMMY,
    members: <SocketInfo[]> [],
    schemes: { rules: {}, physics: {} },
    is_full: () => true,
    is_ready: () => false,
    join: (_: any) => false,
    leave: (_: any) => false,
    cast_ready: () => false,
    load_game: () => false,
    start_game: () => false
};

interface IRoom {
    /** State of a room. */
    readonly state: State
    /** List of info about players. */
    readonly members: SocketInfo[]
    /** Game schemes used in this room. */
    readonly schemes: { rules: any, physics: any }
    /** @returns true if sockets count reached its limit. */
    is_full(): boolean
    /** @returns true if everyone is ready. */
    is_ready(): boolean
    /**
     * Adds socket to the room.
     * @param socket
     * @returns true if socket was added.
     */
    join(socket: Socket): boolean
    /**
     * Removes socket from room, emits & casts events about it.
     * @param socket our wrapper above given socket
     * @returns true if socket was deleted.
     */
    leave(socket: Socket): boolean
    /**
     * Sends the 'ready' state of given socket for everyone in this room.
     * @param socket our wrapper above this socket
     * @return true if this player belongs to the room and state was sent.
     */
    cast_ready(socket: Socket): boolean
    /**
     * Prepares room for playing, e.g. sends an event about it to the players.
     * @returns true if everything went okay.
     */
    load_game(): boolean
    /**
     * Starts the game if everyone is ready.
     * @returns true if everything went okay.
     */
    start_game(): boolean
}

type SocketInfo = [string, boolean, boolean]
