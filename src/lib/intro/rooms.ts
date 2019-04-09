import Room from '../game/room';

/** Interface of a RoomHandler. */
export interface RoomHandler {
    /**
     * @returns ID of non-full room
     */
    getRoomID(): string,

    /**
     * @param ID ID of a room
     * @returns true if one can join the room, false otherwise
     */
    checkRoom(ID: string): boolean,

    /**
     * @param ID ID of a room
     * @returns Room on given ID. If not found, returns undefined 
     */
    getRoom(ID: string): Room,

    /**
     * Call on start of the game in the room. Removes it from the 'rooms' map
     * 
     * @param ID
     * @returns true if room was removed, false otherwise 
     */
    lockRoom(ID: string): boolean
}

const rooms = new Map<string, Room>();

/** Singleton room handler (all game interaction). */
export const RoomHandler = {
    getRoomID() {
        for (let room of rooms.values()) {
            if (!room.full()) {
                return room.ID;
            }
        }
        let newRoom = new Room();
        rooms.set(newRoom.ID, newRoom);
        return newRoom.ID;
    },

    getRoom(ID: string) {
        return rooms.get(ID);
    },

    checkRoom(ID: string) {
        return !rooms.get(ID).full();
    },

    lockRoom(ID: string) {
        return rooms.delete(ID);
    }
} as RoomHandler;
