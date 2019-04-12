import { Socket } from "socket.io";

/** Game room class. */
export default class Room {
/** STATIC */
    /** Live rooms. */
    private static pool = new Map<string, Room>();

    /**
     * @param ID - ID of some room
     * @returns true if given room is live, false otherwise 
     */
    static has(ID: string) {
        return Room.pool.has(ID);
    }

    /**
     * @param ID - ID of some room
     * @returns Room by given ID
     */
    static get(ID: string) {
        return Room.pool.get(ID);
    }

/** OBJECT */
    /** Sockets currently connected to the room. */
    private sockets: Socket[];

    /** IDs of Sockets previously connected to the room (each removed after 5 mins). */
    private oldSockets: Set<string>;

    /**
     * @param socketID - ID of some socket
     * @returns true if given socket was connected to this room, false otherwise
     */
    had(socketID: string) {
        return this.oldSockets.has(socketID);
    }
};
