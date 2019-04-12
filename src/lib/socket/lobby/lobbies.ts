import ShortID from 'shortid';
import { Socket } from 'socket.io';

/** Game lobby class. */
class Lobby {
    /** Unique short identifier. */
    readonly ID: string;

    /** Sockets connected to the lobby. */
    private sockets: Socket[];

    /** Maximum number of players. */
    static readonly CAPACITY = 4;

    /**
     * @constructor
     * Creates new Lobby with random ID.
     */
    constructor() {
        this.ID = ShortID.generate();
        this.sockets = [];
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

/** Interface of LobbyHandler. */
export interface LobbyHandler {
    /**
     * @returns ID of non-full lobby
     */
    getLobbyID(): string,

    /**
     * @param lobbyID ID of a lobby
     * @returns true if one can join the room, false otherwise
     */
    checkLobby(lobbyID: string): boolean
}

const helper = {
    lobby: new Map<string, Lobby>(),
    full: new Map<string, Lobby>()
};

/** Singleton lobby manager. */
export const LobbyHandler = {
    getLobbyID() {
        if (helper.lobby.size === 0) {
            let lb = new Lobby();
            helper.lobby.set(lb.ID, lb);
        }
        return helper.lobby.keys().next().value;
    },

    checkLobby(lobbyID: string) {
        return helper.lobby.has(lobbyID);
    }
} as LobbyHandler;
