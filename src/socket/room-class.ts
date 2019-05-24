import { EventEmitter } from 'events';
import { next_id } from '../lib/id-generator';
import { Socket } from './socket-class';

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

    /** State of a room. */
    get state() {
        return this._state;
    }

    get members() {
        return this.sockets.map((_, index) =>
            this.socket_info(index)
        );
    }

    /** @returns true if sockets count reached its limit. */
    full() {
        return this.sockets.length == MAX_SOCKETS;
    }

    /**
     * Adds socket to the room.
     * @param socket
     * @returns true if socket was added.
     */
    join(socket: Socket) {
        if (this.full()) {
            return false;
        }
        socket.join(this.id);
        let n = this.sockets.push(socket);
        this.cast('join', this.socket_info(n - 1));
        this.emitEnabled();
        if (this.full()) {
            this.emit('full');
        }
        return true;
    }

    /**
     * Removes socket from room.
     * @param socket
     * @returns true if socket was deleted.
     */
    leave(socket: Socket) {
        let index = this.sockets.indexOf(socket);
        if (index == -1) {
            return false;
        }
        socket.leave(this.id);
        this.sockets.splice(index, 1);
        if (this.state == State.LOBBY) {
            this.emit('free');
        }
        return true;
    }

    private cast(event: string, ...args: any[]) {
        Room.io.to(this.id).emit(event, ...args);
    }

    private emitEnabled() {
        if (this.sockets.length == 0) {
            return;
        }
        this.sockets[0].emit(
            'lobby:start-enabled',
            this.sockets.every(socket => socket.ready)
        );
    }

    private socket_info(index: number) {
        return {
            id: this.sockets[index].id,
            ready: this.sockets[index].ready,
            first: index == 0
        };
    }
}

const MAX_SOCKETS = 4;

export enum State { DUMMY, LOBBY, ROOM };

export const dummy: IRoom = {
    state: State.DUMMY,
    members: <SocketInfo[]> [],
    full() {
        return false;
    },
    join(_: any) {
        return false;
    }
};

interface IRoom {
    readonly state: State
    readonly members: SocketInfo[]
    full(): boolean
    join(socket: Socket): boolean
}

type SocketInfo = {
    id: string
    ready: boolean
    first: boolean
}
