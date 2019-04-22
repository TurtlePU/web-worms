import { Socket } from 'socket.io';

import idGenerator from './id-generator';

class NullLobby {
    full() { return true; }
    push(_: any) { return false; }
    members() { return [] as string[]; }
}
const nullLobby = new NullLobby();

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

    /**
     * @constructor
     * Creates new Lobby with random ID.
     */
    private constructor() {
        this.ID = idGenerator();
        this.sockets = [];
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

            socket.join(this.ID);
            socket.on('lobby:left', () => {
                this.remove(socket);
                socket.to(this.ID).emit('lobby:left', socket.id);
            })
            socket.on('disconnect', () => {
                this.remove(socket);
                socket.to(this.ID).emit('lobby:left', socket.id);
            });
            socket.to(this.ID).emit('lobby:join', socket.id);

            if (this.full()) {
                Lobby.pool.delete(this.ID);
                Lobby.full.set(this.ID, this);
            }

            return true;
        }
    }

    members() {
        return this.sockets.map(socket => socket.id);
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
            // TODO: Lobby.remove
            // socket.removeListener();

            Lobby.full.delete(this.ID);
            Lobby.pool.set(this.ID, this);
        }
        return index != -1;
    }
};
