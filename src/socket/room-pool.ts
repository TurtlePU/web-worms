import { Room, dummy } from './room-class';

/** Pool of all rooms. */
class RoomPool {
    /** All rooms. */
    private rooms: Map<string, Room>;
    /** Joinable rooms' id-s. */
    private lobbies: Set<string>;

    /** Makes new Pool. */
    constructor() {
        this.rooms = new Map();
        this.lobbies = new Set();
    }

    /** @returns id of a joinable lobby. */
    get_lobby_id() {
        if (this.lobbies.size == 0) {
            this.add(new Room());
        }
        return this.lobbies.values().next().value;
    }

    /** @returns Room by given id. */
    get(id: string) {
        return this.rooms.get(id) || dummy;
    }

    /** Adds new room, sets listeners of its events. */
    private add(room: Room) {
        this.rooms.set(room.id, room);
        room
            .on('free', () => this.lobbies.add(room.id))
            .on('full', () => this.lobbies.delete(room.id));
    }
}

export default new RoomPool();
