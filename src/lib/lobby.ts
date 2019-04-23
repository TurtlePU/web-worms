import { Socket } from 'socket.io';

import idGenerator from './id-generator';

const nullLobby = {
    full: () => true,
    push: (_: any) => false,
    members: () => [] as string[]
};

class Listener {
    event: string;
    handler: (...args: any[]) => void;
    constructor(event: string, handler: (...args: any[]) => void) {
        this.event = event;
        this.handler = handler;
    }
}

interface SocketInfo {
    ready: boolean,
    listeners: Listener[]
}

/** Game lobby class. */
export default class Lobby {
// STATIC
    /** Available lobbies. */
    private static pool = new Map<string, Lobby>();

    /** Filled lobbies. */
    private static full = new Map<string, Lobby>();

    /** Maximum number of players. */
    private static readonly CAPACITY = 4;

    /**
     * @returns ID of a joinable lobby (if there are none, creates new)
     */
    static ID() {
        if (Lobby.pool.size == 0) {
            let lobby = new Lobby();
            Lobby.pool.set(lobby.ID, lobby);
        }
        return Lobby.pool.keys().next().value;
    }

    /**
     * @param ID - ID of some lobby
     * @returns Lobby if it is joinable 
     */
    static get(ID: string) {
        return Lobby.pool.get(ID) || Lobby.full.get(ID) || nullLobby;
    }

// OBJECT
    /** Unique short identifier. */
    private readonly ID: string;

    /** Sockets connected to the lobby. */
    private sockets: Socket[];
    private socketInfo: Map<string, SocketInfo>;

    /**
     * @constructor
     * Creates new Lobby with random ID.
     */
    private constructor() {
        this.ID = idGenerator();
        this.sockets = [];
        this.socketInfo = new Map();
    }

    private emitEnabled() {
        if (this.sockets.length == 0) {
            return;
        }
        this.sockets[0].emit(
            'lobby:start-enabled',
            [...this.socketInfo.values()]
                .every(info => info.ready)
        );
    }

    /**
     * Adds given socket to the lobby list.
     * @param socket
     * @returns true if socket was pushed, false if lobby is full
     */
    push(socket: Socket) {
        if (this.full()) {
            return false;
        } else {
            this.sockets.push(socket);

            const leave = () => {
                this.remove(socket);
                socket.server.to(this.ID).emit('lobby:left', socket.id);
                this.emitEnabled();
            };

            const listeners = [
                new Listener('lobby:left', leave),
                new Listener('disconnect', leave),
                new Listener('lobby:ready', () => {
                    let info = this.socketInfo.get(socket.id);
                    info.ready = !info.ready;
                    socket.server.to(this.ID).emit('lobby:ready',
                        socket.id,
                        info.ready,
                        socket.id == this.sockets[0].id
                    );
                    this.emitEnabled();
                }),
                new Listener('lobby:start', () => {
                    // TODO: start game
                    console.log('Start!');
                })
            ];

            socket.join(this.ID);
            for (let { event, handler } of listeners) {
                socket.on(event, handler);
            }
            socket.server.to(this.ID).emit('lobby:join',
                socket.id,
                false,
                socket.id == this.sockets[0].id
            );

            this.socketInfo.set(socket.id, {
                ready: false,
                listeners
            });
            this.emitEnabled();

            if (this.full()) {
                Lobby.pool.delete(this.ID);
                Lobby.full.set(this.ID, this);
            }

            return true;
        }
    }

    members() {
        return this.sockets.map((socket, index) => {
            return {
                id: socket.id,
                ready: this.socketInfo.get(socket.id).ready,
                first: index == 0
            };
        });
    }

    /**
     * @returns true if lobby is full, false otherwise
     */
    full() {
        return this.sockets.length == Lobby.CAPACITY;
    }

    /**
     * Removes given socket from lobby list.
     * @param socket
     * @returns true if socket was removed, false if not found
     */
    remove(socket: Socket) {
        let index = this.sockets.findIndex(element => {
            return element.id == socket.id;
        });
        if (index != -1) {
            this.sockets.splice(index, 1);

            socket.leave(this.ID);
            for (let { event, handler } of this.socketInfo.get(socket.id).listeners) {
                socket.removeListener(event, handler);
            }

            this.socketInfo.delete(socket.id);

            Lobby.full.delete(this.ID);
            Lobby.pool.set(this.ID, this);
        }
        return index != -1;
    }
};
