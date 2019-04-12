import Room from './class';

/** Interface of a RoomHandler. */
export interface RoomHandler {
    /**
     * Gets room by ID.
     * @param roomID 
     * @returns Room object
     */
    getRoom(roomID: string): Room
}

const rooms = new Map<string, Room>();

/** Singleton Room manager. */
export const RoomHandler = {
    getRoom(roomID: string) {
        return rooms.get(roomID);
    }
} as RoomHandler;
