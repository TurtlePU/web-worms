import ShortID from 'shortid';
import { Socket } from 'socket.io';

/** Game lobby class. */
export default class Lobby {
/** STATIC */
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
        if (Lobby.pool.size === 0) {
            let lobby = new Lobby();
            Lobby.pool.set(lobby.ID, lobby);
        }
        return Lobby.pool.keys().next().value;
    }

    /**
     * @param ID - ID of some lobby
     * @returns true if given lobby is joinable, false otherwise
     */
    static has(ID: string) {
        return Lobby.pool.has(ID);
    }

/** OBJECT */
    /** Unique short identifier. */
    private readonly ID: string;

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

    /**
     * Adds given socket to the lobby list.
     * @param socket
     * @returns true if socket was pushed, false if lobby is full
     */
    private push(socket: Socket) {
        if (this.full()) {
            return false;
        } else {
            this.sockets.push(socket);
            return true;
        }
    }

    /**
     * @returns true if lobby is full, false otherwise
     */
    private full() {
        return this.sockets.length === Lobby.CAPACITY;
    }

    /**
     * Removes given socket from lobby list.
     * @param socket
     * @returns true if socket was removed, false if not found
     */
    private remove(socket: Socket) {
        let index = this.sockets.findIndex(element => {
            return element.id == socket.id;
        });
        if (index != -1) {
            this.sockets.splice(index, 1);
        }
        return index != -1;
    }
};
