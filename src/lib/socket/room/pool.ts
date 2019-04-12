import Room from './class';

/** Interface of a RoomPool. */
export interface IRoomPool {
    /**
     * Gets room by ID.
     * @param roomID 
     * @returns Room object
     */
    getRoom(roomID: string): Room
}

const rooms = new Map<string, Room>();

/** Singleton Room manager. */
export const RoomPool = {
    getRoom(roomID: string) {
        return rooms.get(roomID);
    }
} as IRoomPool;
