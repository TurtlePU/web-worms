/** Interface of a RoomHandler. */
export interface RoomHandler {
    /**
     * @returns ID of a free room 
     */
    getRoom(): string,

    /**
     * @returns true if target room is free, false otherwise
     */
    checkRoom(id: string): boolean
}

/** Singleton room handler (all game interaction). */
export const RoomHandler = {
    getRoom() {
        return 'room-id';
    },

    checkRoom(id: string) {
        return true;
    }
} as RoomHandler;
