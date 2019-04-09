import Room from '../game/room';

const { floor, random } = Math;

/** Interface of a RoomHandler. */
export interface RoomHandler {
    /**
     * @returns ID of non-full room
     */
    getRoomID(): string,

    /**
     * @param ID ID of a room
     * @param socketID ID of a socket if reconnects
     * @returns true if one can join the room, false otherwise
     */
    checkRoom(ID: string, socketID?: string): boolean,

    /**
     * @param ID ID of a room
     * @returns Room on given ID. If not found, returns undefined 
     */
    getRoom(ID: string): Room,
}

type RMap = Map<string, Room>;

const free: RMap = new Map();
const full: RMap = new Map();

const swap = (a: RMap, b: RMap, roomID: string, room: Room) => () => {
    a.set(roomID, room);
    b.delete(roomID);
};

/** Singleton room handler (all game interaction). */
export const RoomHandler = {
    getRoomID(): string {
        if (free.size === 0) {
            let room = new Room();
            free.set(room.ID, room);

            room.on('state:lobby', swap(free, full, room.ID, room));

            room.on('state:full', swap(full, free, room.ID, room));
            room.on('state:game', swap(full, free, room.ID, room));

            room.on('state:end', () => {
                [free, full].forEach(map => map.delete(room.ID));
            });

            return room.ID;
        } else {
            return [...free.values()][floor(random() * free.size)].ID;
        }
    },

    getRoom(ID: string): Room {
        return free.get(ID) || full.get(ID);
    },

    checkRoom(ID: string, socketID?: string): boolean {
        return free.has(ID) ||
            socketID && full.has(ID) &&
            full.get(ID).has(socketID);
    }
} as RoomHandler;
