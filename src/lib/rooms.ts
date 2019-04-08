export const RoomHandler = {
    /**
     * @returns ID of a free room 
    */
    getRoom: () => {
        return 'room-id';
    },

    /**
     * @returns true if target room is free, false otherwise
     */
    checkRoom: (id: string) => {
        return true;
    }
};
