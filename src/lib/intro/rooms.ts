import Room from '../game/room';

/** Interface of a RoomHandler. */
export interface RoomHandler {
    /**
     * @returns ID of non-full room
     */
    getRoomID(): string,

    /**
     * @param id ID of a room
     * @returns true if one can join the room, false otherwise
     */
    checkRoom(id: string): boolean,

    /**
     * @param id ID of a room
     * @returns Room on given ID. If not found, returns undefined 
     */
    getRoom(id: string): Room,

    /**
     * Call on start of the game in the room. Removes it from the 'rooms' map
     * 
     * @param id
     * @returns true if room was removed, false otherwise 
     */
    lockRoom(id: string): boolean
}

const rooms = new Map<string, Room>();

/** Singleton room handler (all game interaction). */
export const RoomHandler = {
    getRoomID() {
        for (let room of rooms.values()) {
            if (!room.full()) {
                return room.id;
            }
        }
        let newRoom = new Room();
        rooms.set(newRoom.id, newRoom);
        return newRoom.id;
    },

    getRoom(id: string) {
        return rooms.get(id);
    },

    checkRoom(id: string) {
        return !rooms.get(id).full();
    },

    lockRoom(id: string) {
        return rooms.delete(id);
    }
} as RoomHandler;
