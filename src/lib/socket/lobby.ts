import ShortID from 'shortid';
import { Socket } from 'socket.io';

/** Game lobby class. */
export default class Lobby {
    /** Available lobbies. */
    private static pool = new Map<string, Lobby>();

    // TODO: use filled lobbies
    /** Filled lobbies. */
    private static full = new Map<string, Lobby>();

    /** Maximum number of players. */
    static readonly CAPACITY = 4;

    /** Unique short identifier. */
    readonly ID: string;

    /** Sockets connected to the lobby. */
    private sockets: Socket[];

    /**
     * @constructor
     * Creates new Lobby with random ID.
     */
    private constructor() {
        this.ID = ShortID.generate();
        this.sockets = [];
    }

    static ID() {
        if (Lobby.pool.size === 0) {
            let lobby = new Lobby();
            Lobby.pool.set(lobby.ID, lobby);
        }
        return Lobby.pool.keys().next().value;
    }

    static has(ID: string) {
        return Lobby.pool.has(ID);
    }

    /**
     * Adds given socket to the lobby list.
     * @param socket
     */
    push(socket: Socket) {
        if (this.sockets.length === Lobby.CAPACITY) {
            throw new RangeError('Lobby is full');
        } else {
            this.sockets.push(socket);
        }
    }

    /**
     * @returns true if lobby is full, false otherwise
     */
    full() {
        return this.sockets.length === Lobby.CAPACITY;
    }

    /**
     * Removes given socket from lobby list.
     * @param socket
     * @returns true if socket was removed, false if not found
     */
    remove(socket: Socket) {
        let index = this.sockets.findIndex(conn => socket === conn);
        if (index !== -1) {
            this.sockets.splice(index, 1);
        }
        return index !== -1;
    }
};
