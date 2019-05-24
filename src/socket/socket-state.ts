export interface SocketState {
    ready: boolean,
    room_id: string
}

export const dummy: SocketState = {
    ready: false,
    room_id: 'ERROR: no room'
};
